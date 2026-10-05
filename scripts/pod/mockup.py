"""Ghép hình in (RGBA) lên ảnh áo trơn Printful, giữ nếp vải bằng bản đồ sáng tối."""
import json, re, os
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
META = json.load(open(os.path.join(HERE, 'blanks/meta.json')))

# pid -> nhãn, nhóm danh mục, vùng in (x0,y0,x1,y1) trên ảnh 700x1000
GARMENTS = {
    '71':   dict(label='T-Shirt', cat='T-Shirts', box=(240, 320, 430, 575)),
    '586':  dict(label='Comfort Colors T-Shirt', cat='T-Shirts', box=(248, 345, 440, 600)),
    '438':  dict(label='Classic T-Shirt', cat='T-Shirts', box=(255, 325, 447, 580)),
    '1592': dict(label='Oversized Boxy Tee', cat='T-Shirts', box=(245, 290, 455, 560)),
    '307':  dict(label='Youth T-Shirt', cat='Kids & Youth', box=(255, 350, 440, 590)),
    '360':  dict(label="Women's Relaxed T-Shirt", cat='T-Shirts', box=(300, 215, 420, 365)),
    '162':  dict(label='Tri-Blend T-Shirt', cat='T-Shirts', box=(250, 335, 440, 585)),
    '356':  dict(label='Long Sleeve Tee', cat='Long Sleeves', box=(262, 330, 440, 580)),
    '57':   dict(label='Long Sleeve Shirt', cat='Long Sleeves', box=(250, 335, 437, 590)),
    '248':  dict(label='Tank Top', cat='Tank Tops', box=(200, 390, 365, 620)),
    '380':  dict(label='Hoodie', cat='Hoodies', box=(265, 330, 450, 600)),
    '734':  dict(label='Relaxed Hoodie', cat='Hoodies', box=(258, 330, 445, 585)),
    '892':  dict(label='Oversized Hoodie', cat='Hoodies', box=(262, 325, 450, 575)),
    '1412': dict(label="Women's Relax Hoodie", cat='Hoodies', box=(225, 275, 460, 540)),
    '145':  dict(label='Sweatshirt', cat='Sweatshirts', box=(265, 330, 462, 600)),
    '411':  dict(label='Premium Sweatshirt', cat='Sweatshirts', box=(258, 300, 442, 560)),
    '845':  dict(label='Crewneck Sweatshirt', cat='Sweatshirts', box=(247, 265, 463, 540)),
}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def lum(rgb):
    r, g, b = [c / 255 for c in rgb]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def colors(pid):
    """[(tên màu, slug, rgb)] chỉ những màu có ảnh cùng tư thế."""
    out = []
    for name, info in META[pid]['colors'].items():
        s = slug(name)
        fn = os.path.join(HERE, f'blanks/{pid}/{s}.jpg')
        if not os.path.exists(fn):
            continue
        if Image.open(fn).size != ((550, 1000) if pid == '248' else (700, 1000)):
            continue
        out.append((name, s, hex_rgb(info['code'])))
    return out

def sizes(pid):
    d = json.load(open(os.path.join(HERE, f'blanks/p{pid}.json')))['result']
    order = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', '6XL']
    seen = []
    for v in d['variants']:
        if v['size'] not in seen:
            seen.append(v['size'])
    return sorted(seen, key=lambda z: order.index(z) if z in order else len(order) + seen.index(z))

def compose(pid, color_slug, design, out_size=700, scale=1.0, valign='top'):
    g = GARMENTS[pid]
    blank = Image.open(os.path.join(HERE, f'blanks/{pid}/{color_slug}.jpg')).convert('RGB')
    x0, y0, x1, y1 = g['box']
    bw, bh = int((x1 - x0) * scale), int((y1 - y0) * scale)
    d = design.copy()
    r = min(bw / d.width, bh / d.height)
    d = d.resize((max(1, int(d.width * r)), max(1, int(d.height * r))), Image.LANCZOS)
    ox = (x0 + x1) // 2 - d.width // 2
    oy = y0 if valign == 'top' else (y0 + y1) // 2 - d.height // 2
    region = blank.crop((ox, oy, ox + d.width, oy + d.height))
    L = np.asarray(region.convert('L'), dtype=np.float32)
    Lb = np.asarray(region.convert('L').filter(ImageFilter.GaussianBlur(2)), dtype=np.float32)
    med = float(np.median(L))
    k = 35.0
    shade = np.clip((Lb + k) / (med + k), 0.62, 1.22)
    # nhiễu vải: thành phần tần số cao của ảnh áo
    hf = L - np.asarray(region.convert('L').filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)
    D = np.asarray(d.filter(ImageFilter.GaussianBlur(0.35)), dtype=np.float32)
    rgb, a = D[..., :3], D[..., 3:4] / 255.0
    R = np.asarray(region, dtype=np.float32)
    ink = rgb * shade[..., None] + hf[..., None] * 0.6
    garment_dark = med < 110
    if not garment_dark:
        # mực in trên vải sáng ngấm nhẹ màu vải
        ink = ink * (0.88 + 0.12 * R / 255.0)
    a = a * 0.97
    out = R * (1 - a) + ink * a
    out = np.clip(out, 0, 255).astype(np.uint8)
    blank.paste(Image.fromarray(out), (ox, oy))
    # cắt vuông quanh ngực áo
    W, H = blank.size
    cy = (y0 + y1) // 2 + 40
    side = min(W, H)
    top = max(0, min(H - side, cy - side // 2))
    left = (W - side) // 2
    sq = blank.crop((left, top, left + side, top + side))
    if sq.size[0] != out_size:
        sq = sq.resize((out_size, out_size), Image.LANCZOS)
    return sq
