"""Vẽ hình in (RGBA, nền trong suốt) cho áo POD: tranh CC0 có khung + chữ kiểu POD."""
import math, os, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
_fc = {}

def F(name, size, var=None):
    key = (name, size, var)
    if key not in _fc:
        f = ImageFont.truetype(os.path.join(HERE, 'fonts', name), size)
        if var:
            f.set_variation_by_name(var)
        _fc[key] = f
    return _fc[key]

def rgba(c, a=255):
    if isinstance(c, str):
        c = c.lstrip('#')
        c = tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
    return tuple(c[:3]) + (a,)

def trim(im, pad=6):
    bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bb:
        return im
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

# ---------- chữ ----------

def text_w(font, s, tracking=0):
    if not tracking:
        b = font.getbbox(s)
        return b[2] - b[0]
    return sum(font.getlength(ch) for ch in s) + tracking * (len(s) - 1)

def fit_font(name, s, max_w, max_size, var=None, tracking_em=0.0, min_size=10):
    size = max_size
    while size > min_size:
        f = F(name, size, var)
        if text_w(f, s, int(size * tracking_em)) <= max_w:
            return f
        size -= 2
    return F(name, min_size, var)

def draw_line(img, s, font, cy, fill, tracking=0, stroke=0, stroke_fill=None, cx=None, anchor='mm'):
    d = ImageDraw.Draw(img)
    cx = img.width // 2 if cx is None else cx
    if not tracking:
        d.text((cx, cy), s, font=font, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=stroke_fill)
        return
    w = text_w(font, s, tracking)
    x = cx - w / 2
    for ch in s:
        d.text((x, cy), ch, font=font, fill=fill, anchor='lm', stroke_width=stroke, stroke_fill=stroke_fill)
        x += font.getlength(ch) + tracking

def line_h(font, s='Hg'):
    b = font.getbbox(s, anchor='mm')
    return b[3] - b[1]

def arc_text(img, s, font, cx, cy, r, center_deg, fill, tracking=4, bottom=False):
    """Chữ chạy theo cung tròn; center_deg = -90 là đỉnh."""
    widths = [font.getlength(ch) + tracking for ch in s]
    total = sum(widths) - tracking
    ang_total = total / r
    a = math.radians(center_deg) + (ang_total / 2 if bottom else -ang_total / 2)
    for ch, w in zip(s, widths):
        half = (w - tracking) / 2 / r
        a_mid = a - half if bottom else a + half
        x = cx + r * math.cos(a_mid)
        y = cy + r * math.sin(a_mid)
        tile = Image.new('RGBA', (int(font.size * 2), int(font.size * 2)), (0, 0, 0, 0))
        ImageDraw.Draw(tile).text((tile.width / 2, tile.height / 2), ch, font=font, fill=fill, anchor='mm')
        rot = -math.degrees(a_mid) - 90 if not bottom else -math.degrees(a_mid) + 90
        tile = tile.rotate(rot, resample=Image.BICUBIC)
        img.alpha_composite(tile, (int(x - tile.width / 2), int(y - tile.height / 2)))
        a = a - w / r if bottom else a + w / r

# ---------- tranh ----------

def rounded_mask(size, r):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], r, fill=255)
    return m

def crop_ratio(im, ratio):
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio)
        return im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = int(w / ratio)
    top = max(0, (h - nh) // 2)
    return im.crop((0, top, w, top + nh))

def caption(canvas, y, title, sub, ink, width, style='sans'):
    if style == 'serif':
        tf = fit_font('PlayfairDisplay.ttf', title, width, 64, 'Bold')
        draw_line(canvas, title, tf, y + line_h(tf) // 2, ink)
        y += line_h(tf) + 18
    else:
        t = title.upper()
        tf = fit_font('Montserrat.ttf', t, width, 58, 'Bold', tracking_em=0.18)
        draw_line(canvas, t, tf, y + line_h(tf) // 2, ink, tracking=int(tf.size * 0.18))
        y += line_h(tf) + 16
    if sub:
        s = sub.upper()
        sf = fit_font('Montserrat.ttf', s, width * 0.9, 30, 'Medium', tracking_em=0.3)
        draw_line(canvas, s, sf, y + line_h(sf) // 2, ink, tracking=int(sf.size * 0.3))
        y += line_h(sf) + 10
    return y

def art_framed(art, title, sub, ink, cap='sans'):
    art = art.copy()
    art.thumbnail((900, 900))
    pad, bw = 14, 6
    W = art.width + 2 * (pad + bw)
    canvas = Image.new('RGBA', (W, art.height + 2 * (pad + bw) + 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.rectangle([0, 0, W - 1, art.height + 2 * (pad + bw) - 1], outline=rgba(ink), width=bw)
    canvas.paste(art, (pad + bw, pad + bw))
    y = art.height + 2 * (pad + bw) + 34
    caption(canvas, y, title, sub, rgba(ink), W - 20, cap)
    return trim(canvas)

def art_plain(art, title=None, sub=None, ink=None):
    art = art.copy().convert('RGBA')
    art.thumbnail((900, 900))
    art.putalpha(rounded_mask(art.size, 18))
    if not title:
        return art
    canvas = Image.new('RGBA', (art.width, art.height + 240), (0, 0, 0, 0))
    canvas.alpha_composite(art)
    caption(canvas, art.height + 36, title, sub, rgba(ink), art.width - 20, 'serif')
    return trim(canvas)

def art_arch(art, title, sub, ink):
    a = crop_ratio(art, 0.78).convert('RGBA').resize((700, 897), Image.LANCZOS)
    m = Image.new('L', a.size, 0)
    d = ImageDraw.Draw(m)
    r = a.width // 2
    d.ellipse([0, 0, a.width - 1, 2 * r], fill=255)
    d.rectangle([0, r, a.width - 1, a.height - 1], fill=255)
    a.putalpha(m)
    W = a.width + 40
    canvas = Image.new('RGBA', (W, a.height + 300), (0, 0, 0, 0))
    o = Image.new('RGBA', (a.width + 24, a.height + 24), (0, 0, 0, 0))
    om = m.resize(o.size)
    o.paste(Image.new('RGBA', o.size, rgba(ink)), (0, 0), om)
    canvas.alpha_composite(o, (8, 8))
    canvas.alpha_composite(a, (20, 20))
    caption(canvas, a.height + 70, title, sub, rgba(ink), W - 20, 'sans')
    return trim(canvas)

def art_circle(art, title, sub, ink):
    a = crop_ratio(art, 1.0).convert('RGBA').resize((760, 760), Image.LANCZOS)
    m = Image.new('L', a.size, 0)
    ImageDraw.Draw(m).ellipse([0, 0, 759, 759], fill=255)
    a.putalpha(m)
    canvas = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.ellipse([100 - 26, 100 - 26, 860 + 26, 860 + 26], outline=rgba(ink), width=7)
    canvas.alpha_composite(a, (100, 100))
    t = title.upper()
    f = fit_font('Montserrat.ttf', t, 1100, 48, 'Bold')
    if text_w(f, t, 6) < 1150:
        arc_text(canvas, t, f, 480, 480, 455, 90, rgba(ink), tracking=6, bottom=True)
        big = Image.new('RGBA', (1000, 1080), (0, 0, 0, 0))
        big.alpha_composite(canvas)
        return trim(big)
    return trim(canvas)

def art_stamp(art, title, sub, ink, paper='#F4EEDF'):
    a = crop_ratio(art, 0.8 if art.height >= art.width else 1.25).convert('RGBA')
    a.thumbnail((760, 760))
    pad = 46
    W, H = a.width + 2 * pad, a.height + 2 * pad + 90
    st = Image.new('RGBA', (W, H), rgba(paper))
    st.alpha_composite(a, (pad, pad))
    d = ImageDraw.Draw(st)
    f = fit_font('Montserrat.ttf', title.upper(), W - 2 * pad, 40, 'Bold', tracking_em=0.12)
    draw_line(st, title.upper(), f, a.height + pad + 50, rgba('#2b2b2b'), tracking=int(f.size * 0.12))
    # răng cưa tem
    m = Image.new('L', (W, H), 255)
    md = ImageDraw.Draw(m)
    r, step = 13, 38
    for x in range(step // 2, W, step):
        md.ellipse([x - r, -r, x + r, r], fill=0)
        md.ellipse([x - r, H - r, x + r, H + r], fill=0)
    for y in range(step // 2, H, step):
        md.ellipse([-r, y - r, r, y + r], fill=0)
        md.ellipse([W - r, y - r, W + r, y + r], fill=0)
    st.putalpha(m)
    if sub:
        canvas = Image.new('RGBA', (W, H + 120), (0, 0, 0, 0))
        canvas.alpha_composite(st)
        s = sub.upper()
        sf = fit_font('Montserrat.ttf', s, W * 0.9, 34, 'SemiBold', tracking_em=0.3)
        draw_line(canvas, s, sf, H + 60, rgba(ink), tracking=int(sf.size * 0.3))
        return trim(canvas)
    return st

def cutout_dark(art, gap=45, soft=55, color=None, crop=None):
    """Tách nét đậm khỏi nền giấy (tranh khắc, bóng đen); color: tô lại một màu."""
    if crop:
        w, h = art.size
        art = art.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    g = art.convert('L')
    px = list(g.getdata())
    paper = sorted(px)[int(len(px) * 0.80)]
    hi = paper - gap
    lo = hi - soft
    a = g.point(lambda v: 255 if v <= lo else (0 if v >= hi else int(255 * (hi - v) / (hi - lo))))
    out = art.convert('RGBA') if color is None else Image.new('RGBA', art.size, rgba(color))
    out.putalpha(a)
    return trim(out)

# ---------- nền trang trí ----------

def sunset_disc(size, colors, stripes=5, gap_start=0.55):
    """Mặt trời retro: dải màu ngang, có khe trống phía dưới."""
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    n = len(colors)
    for i, c in enumerate(colors):
        y0 = int(size * i / n)
        y1 = int(size * (i + 1) / n)
        d.rectangle([0, y0, size, y1], fill=rgba(c))
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).ellipse([0, 0, size - 1, size - 1], fill=255)
    md = ImageDraw.Draw(m)
    y = int(size * gap_start)
    h = size * 0.018
    while y < size:
        md.rectangle([0, y, size, y + h], fill=0)
        y += int(size * 0.07)
        h *= 1.35
    im.putalpha(m)
    return im

def starfield(size, rng, bg=('#0b1026', '#2a1b4a')):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    grad = Image.new('RGBA', (1, size))
    c0, c1 = rgba(bg[0]), rgba(bg[1])
    for y in range(size):
        t = y / size
        grad.putpixel((0, y), tuple(int(c0[i] * (1 - t) + c1[i] * t) for i in range(4)))
    grad = grad.resize((size, size))
    d = ImageDraw.Draw(grad)
    for _ in range(int(size * 0.35)):
        x, y = rng.randrange(size), rng.randrange(size)
        r = rng.choice([1, 1, 1, 2, 2, 3])
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 240, rng.randrange(150, 255)))
    for _ in range(6):
        x, y = rng.randrange(size), rng.randrange(size)
        s = rng.randrange(8, 16)
        d.line([x - s, y, x + s, y], fill=(255, 255, 255, 230), width=2)
        d.line([x, y - s, x, y + s], fill=(255, 255, 255, 230), width=2)
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).ellipse([0, 0, size - 1, size - 1], fill=255)
    grad.putalpha(m)
    return grad

def planet(d, cx, cy, r, color, ring):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rgba(color))
    d.ellipse([cx - r * 2.0, cy - r * 0.45, cx + r * 2.0, cy + r * 0.45], outline=rgba(ring), width=max(3, r // 7))
    d.pieslice([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=rgba(color))

# ---------- bố cục chữ ----------

def lay_stack(lines, ink, accent, rng):
    """lines: [(text, role)] role ∈ big|script|small|mid"""
    W = 1200
    canvas = Image.new('RGBA', (W, 2200), (0, 0, 0, 0))
    big = rng.choice(['Anton-Regular.ttf', 'BebasNeue-Regular.ttf', 'ArchivoBlack-Regular.ttf', 'Oswald.ttf', 'AlfaSlabOne-Regular.ttf'])
    script = rng.choice(['Pacifico-Regular.ttf', 'Lobster-Regular.ttf', 'KaushanScript-Regular.ttf', 'Satisfy-Regular.ttf', 'DancingScript.ttf'])
    y = 40
    for text, role in lines:
        if role == 'big':
            t = text.upper()
            f = fit_font(big, t, W - 40, 260, 'Bold' if big == 'Oswald.ttf' else None)
            draw_line(canvas, t, f, y + line_h(f) // 2, rgba(ink))
            y += line_h(f) + 24
        elif role == 'script':
            f = fit_font(script, text, W - 80, 210, 'Bold' if script == 'DancingScript.ttf' else None)
            draw_line(canvas, text, f, y + line_h(f) // 2 - 10, rgba(accent))
            y += line_h(f) + 10
        elif role == 'mid':
            t = text.upper()
            f = fit_font('Montserrat.ttf', t, W - 120, 110, 'ExtraBold', tracking_em=0.08)
            draw_line(canvas, t, f, y + line_h(f) // 2, rgba(ink), tracking=int(f.size * 0.08))
            y += line_h(f) + 26
        else:
            t = text.upper()
            f = fit_font('Montserrat.ttf', t, W - 200, 54, 'SemiBold', tracking_em=0.35)
            draw_line(canvas, t, f, y + line_h(f) // 2, rgba(ink), tracking=int(f.size * 0.35))
            y += line_h(f) + 26
    return trim(canvas)

def lay_groovy(lines, colors, rng):
    """Chữ 70s nhiều lớp bóng đổ."""
    W = 1300
    font = rng.choice(['Shrikhand-Regular.ttf', 'Shrikhand-Regular.ttf', 'Bungee-Regular.ttf', 'Righteous-Regular.ttf', 'Chewy-Regular.ttf'])
    canvas = Image.new('RGBA', (W, 1900), (0, 0, 0, 0))
    y = 60
    layers = colors[1:4]
    for text in lines:
        f = fit_font(font, text, W - 160, 250)
        h = line_h(f)
        for i, c in enumerate(reversed(layers)):
            off = (len(layers) - i) * 12
            draw_line(canvas, text, f, y + h // 2 + off, rgba(c), cx=W // 2 + off)
        draw_line(canvas, text, f, y + h // 2, rgba(colors[0]))
        y += h + 70
    return trim(canvas)

def lay_sunset(title, sub, ink, sun_colors, rng, mountains=None, silhouette=None, sil_scale=0.62):
    W = 1200
    canvas = Image.new('RGBA', (W, 1700), (0, 0, 0, 0))
    S = 760
    disc = sunset_disc(S, sun_colors)
    canvas.alpha_composite(disc, ((W - S) // 2, 20))
    d = ImageDraw.Draw(canvas)
    base = 20 + S - 40
    if mountains:
        pts = [((W - S) // 2 - 80, base)]
        x = (W - S) // 2 - 80
        while x < (W + S) // 2 + 80:
            x += rng.randrange(70, 150)
            pts.append((min(x, (W + S) // 2 + 80), base - rng.randrange(120, 330)))
        pts.append(((W + S) // 2 + 80, base))
        d.polygon(pts, fill=rgba(mountains))
        d.rectangle([(W - S) // 2 - 80, base, (W + S) // 2 + 80, base + 18], fill=rgba(mountains))
    if silhouette is not None:
        s = silhouette.copy()
        s.thumbnail((int(S * sil_scale), int(S * sil_scale)))
        canvas.alpha_composite(s, ((W - s.width) // 2, base - s.height + 10))
    t = title.upper()
    font = rng.choice(['Anton-Regular.ttf', 'BebasNeue-Regular.ttf', 'BowlbyOneSC-Regular.ttf', 'Righteous-Regular.ttf'])
    f = fit_font(font, t, W - 60, 230)
    y = base + 70 + line_h(f) // 2
    draw_line(canvas, t, f, y, rgba(ink))
    y += line_h(f) // 2 + 30
    if sub:
        s = sub.upper()
        sf = fit_font('Montserrat.ttf', s, W - 220, 56, 'SemiBold', tracking_em=0.35)
        draw_line(canvas, s, sf, y + line_h(sf) // 2, rgba(ink), tracking=int(sf.size * 0.35))
    return trim(canvas)

def lay_badge(top, center, bottom, ink, accent, rng, inner=None):
    S = 1100
    canvas = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    c = S // 2
    d.ellipse([20, 20, S - 20, S - 20], outline=rgba(ink), width=14)
    d.ellipse([170, 170, S - 170, S - 170], outline=rgba(ink), width=8)
    f = F('Montserrat.ttf', 78, 'ExtraBold')
    arc_text(canvas, top.upper(), f, c, c, 445, -90, rgba(ink), tracking=10)
    if bottom:
        arc_text(canvas, bottom.upper(), F('Montserrat.ttf', 64, 'Bold'), c, c, 445, 90, rgba(ink), tracking=10, bottom=True)
    for ang in (180, 0):
        x = c + 445 * math.cos(math.radians(ang))
        star(d, x, c, 26, rgba(accent))
    if inner is not None:
        a = crop_ratio(inner, 1.0).convert('RGBA').resize((S - 360, S - 360), Image.LANCZOS)
        m = Image.new('L', a.size, 0)
        ImageDraw.Draw(m).ellipse([0, 0, a.width - 1, a.height - 1], fill=255)
        a.putalpha(m)
        canvas.alpha_composite(a, (180, 180))
    else:
        t = center.upper()
        cf = fit_font(rng.choice(['Anton-Regular.ttf', 'BebasNeue-Regular.ttf', 'AlfaSlabOne-Regular.ttf']), t, 640, 240)
        draw_line(canvas, t, cf, c, rgba(accent))
    return trim(canvas)

def star(d, x, y, r, fill):
    pts = []
    for i in range(10):
        a = math.radians(-90 + i * 36)
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
    d.polygon(pts, fill=fill)

def wrap(text, font, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if font.getlength(t) <= max_w:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def lay_verse(word, sub, verse, ref, ink, accent, rng):
    W = 1200
    canvas = Image.new('RGBA', (W, 2000), (0, 0, 0, 0))
    script = rng.choice(['GreatVibes-Regular.ttf', 'Sacramento-Regular.ttf', 'Pacifico-Regular.ttf', 'Satisfy-Regular.ttf'])
    f = fit_font(script, word, W - 60, 300)
    y = 40 + line_h(f) // 2
    draw_line(canvas, word, f, y, rgba(accent))
    y += line_h(f) // 2 + 30
    if sub:
        s = sub.upper()
        sf = fit_font('Cinzel.ttf', s, W - 120, 120, 'Bold', tracking_em=0.12)
        draw_line(canvas, s, sf, y + line_h(sf) // 2, rgba(ink), tracking=int(sf.size * 0.12))
        y += line_h(sf) + 50
    vf = F('PlayfairDisplay.ttf', 58, 'Regular')
    for ln in wrap('“' + verse + '”', vf, W - 200):
        draw_line(canvas, ln, vf, y + 34, rgba(ink))
        y += 80
    y += 24
    d = ImageDraw.Draw(canvas)
    d.line([W // 2 - 260, y, W // 2 - 60, y], fill=rgba(accent), width=4)
    d.line([W // 2 + 60, y, W // 2 + 260, y], fill=rgba(accent), width=4)
    star(d, W // 2, y, 18, rgba(accent))
    y += 50
    rf = F('Montserrat.ttf', 50, 'Bold')
    draw_line(canvas, ref.upper(), rf, y + 25, rgba(ink), tracking=16)
    return trim(canvas)

def lay_minimal(text, small, ink, rng):
    W = 1200
    canvas = Image.new('RGBA', (W, 900), (0, 0, 0, 0))
    font = rng.choice(['SpecialElite-Regular.ttf', 'DMSerifDisplay-Regular.ttf', 'PermanentMarker-Regular.ttf', 'CaveatBrush-Regular.ttf'])
    lines = text.split('|')
    y = 40
    for ln in lines:
        f = fit_font(font, ln, W - 100, 170)
        draw_line(canvas, ln, f, y + line_h(f) // 2, rgba(ink))
        y += line_h(f) + 30
    if small:
        d = ImageDraw.Draw(canvas)
        d.line([W // 2 - 220, y + 10, W // 2 + 220, y + 10], fill=rgba(ink), width=5)
        sf = fit_font('Montserrat.ttf', small.upper(), W - 300, 46, 'SemiBold', tracking_em=0.35)
        draw_line(canvas, small.upper(), sf, y + 70, rgba(ink), tracking=int(sf.size * 0.35))
    return trim(canvas)

def string_lights(W, rng, wire='#3b3b3b'):
    """Dây đèn trang trí võng xuống, bóng vàng ấm có quầng sáng."""
    im = Image.new('RGBA', (W, 360), (0, 0, 0, 0))
    glow = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d, g = ImageDraw.Draw(im), ImageDraw.Draw(glow)
    pts = []
    for i in range(101):
        t = i / 100
        x = 40 + t * (W - 80)
        y = 60 + 160 * (1 - (2 * t - 1) ** 2)
        pts.append((x, y))
    d.line(pts, fill=rgba(wire), width=6)
    cols = ['#FFD166', '#FFB347', '#FFE29A', '#F7A072']
    for i in range(4, 100, 8):
        x, y = pts[i]
        c = rgba(rng.choice(cols))
        g.ellipse([x - 40, y + 10, x + 40, y + 90], fill=c[:3] + (120,))
        d.rectangle([x - 8, y, x + 8, y + 22], fill=rgba(wire))
        d.ellipse([x - 18, y + 18, x + 18, y + 70], fill=c)
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    glow.alpha_composite(im)
    return glow

def thicken(im, n=3, color=None):
    """Làm đậm nét của hình đã tách nền (MaxFilter trên kênh alpha)."""
    a = im.getchannel('A').filter(ImageFilter.MaxFilter(n))
    base = Image.new('RGBA', im.size, rgba(color)) if color else im.copy()
    base.putalpha(a)
    return base
