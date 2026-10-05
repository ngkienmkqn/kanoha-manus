"""Sinh ảnh mockup + dữ liệu sản phẩm quần áo POD cho web Kanoha."""
import json, os, random, re, sys
from PIL import Image
from mockup import GARMENTS, META, colors, sizes, compose, lum, slug
import designs as D
from phrases import PHRASES

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(HERE, '..', '..'))
OUT_IMG = os.path.join(REPO, 'client/public/images/apparel')
OUT_JSON = os.path.join(REPO, 'client/src/data/apparel.json')
OUT_CREDITS = os.path.join(REPO, 'client/public/images/apparel/CREDITS.md')
os.makedirs(OUT_IMG, exist_ok=True)

ITEMS = json.load(open(os.path.join(HERE, 'art/relevant.json')))
PICKED = json.load(open(os.path.join(HERE, 'art/picked.json')))

EXCLUDE = set('''aic-51724 aic-77333 cma-129882 cma-129881 cma-106963 cma-106965 aic-130510 aic-86999
aic-25613 aic-13279 aic-25333 aic-33943 aic-33318 aic-84389 aic-61429 aic-60665 aic-21217 aic-21214
cma-118643 aic-39160'''.split())

TITLES = {
 'cma-168557': 'Cat Sketches', 'cma-679088': 'Cat, Bird and Crabapple', 'cma-133603': 'Sleeping Cat',
 'cma-162253': 'Head of a Kitten', 'aic-100627': 'Fishing Boats at Choshi', 'aic-100625': 'Fishing by Torchlight',
 'aic-89503': 'The Great Wave off Kanagawa', 'aic-100626': 'Whaling off the Goto Islands',
 'aic-47667': 'Crane Flying Over Wave', 'aic-81535': 'Sea View, Calm Weather', 'cma-169332': 'Two Silver Herons',
 'aic-142422': 'Purple Heron', 'aic-25117': 'Hydrangea and Swallow', 'aic-25105': 'Cotton Roses and Sparrow',
 'aic-29486': 'Society Finches', 'cma-143247': 'Gossiping Sparrows', 'aic-191528': 'Swallows',
 'aic-18635': 'Swallowtail Butterfly and Insects', 'cma-680380': 'Flowers and Butterflies No. 8',
 'cma-680375': 'Flowers and Butterflies No. 5', 'cma-680373': 'Flowers and Butterflies No. 3',
 'cma-680374': 'Flowers and Butterflies No. 4', 'cma-680382': 'Flowers and Butterflies No. 10',
 'cma-680383': 'Flowers and Butterflies No. 11', 'cma-164600': 'Moth and Butterflies',
 'aic-160091': 'Five Butterflies and a Moth', 'cma-104262': 'Butterflies and Fish',
 'cma-329329': 'Hawk Moth and Morning Glory', 'aic-25091': 'Canary and Peony', 'aic-4368': 'Ferries at Mitsuke',
 'aic-4381': 'Shiomi Slope at Shirasuka', 'aic-25110': 'Chrysanthemum and Horsefly',
 'aic-32276': 'Iris and Grasshopper', 'aic-4374': 'The Ferry at Maisaka', 'cma-314466': 'Bouquet of Wildflowers',
 'aic-34380': 'Cherry Blossoms in Rain', 'aic-25476': 'Sumida River Cherry Blossoms',
 'aic-47943': 'Goten Hill Cherry Blossoms', 'aic-26396': 'Goten Hill in Full Bloom',
 'aic-109405': 'Arashiyama Cherry Blossoms', 'aic-33958': 'Evening Cherry Blossoms',
 'aic-36589': 'Cherry Blossoms at Goten Hill', 'aic-25479': 'Blossom Viewing at Asuka Hill',
 'aic-88853': 'Great Tit on Cherry Blossom', 'aic-103331': 'Ferocious Tiger', 'cma-137588': 'Donkey in a Tiger Skin',
 'cma-126769': 'Jungle Tiger', 'aic-35262': "The Earl's Horse", 'cma-314469': 'Prince on a Blue Horse',
 'aic-74752': 'Fox and Rabbit Woodcut', 'aic-90768': 'Full Cry Fox Hunt', 'cma-150775': 'Reynard the Fox',
 'aic-33386': 'Hokusai Fox', 'aic-44245': 'White Rabbit and Amaranth', 'aic-19013': 'Rabbits in Moonlight',
 'cma-163850': 'The Hare', 'aic-21330': 'Hares Playing in the Surf', 'cma-79084': 'Hare in the Field',
 'aic-33426': 'Two Rabbits', 'aic-25099': 'Morning Glories and Tree Frog', 'cma-314472': 'Woman Feeding Deer',
 'cma-677517': 'The Golden Deer', 'cma-118988': 'Mountain Bear', 'cma-150816': 'The Bear and Reynard',
 'cma-150817': 'Honey for the Bear', 'cma-150812': 'The Wolf and the Monkey', 'aic-95849': "Lion's Head",
 'aic-18686': 'Lion Studies', 'aic-36318': 'Dragon in the Clouds', 'aic-47729': 'Moon and Wild Geese',
 'aic-22820': 'Cuckoo Against the Moon', 'aic-18972': 'Autumn Moon over Ishiyama',
 'cma-152499': 'Moon-Viewing Promontory', 'cma-152502': 'Night-Weeping Stone at Nissaka',
 'cma-152490': 'Night Rain at Karasaki', 'cma-106964': 'Full Moon on Kanazawa',
 'aic-19040': 'Snow at Inokashira Pond', 'cma-111673': 'Crow and Full Moon', 'cma-149393': 'Plum Blossoms in Moonlight',
 'aic-22173': 'Sea Lane off Kazusa', 'aic-87005': 'Red Fuji', 'aic-24778': 'Tagonoura Bay',
 'aic-24794': 'Inume Pass', 'aic-77331': 'Thunderstorm Below the Summit', 'aic-24790': 'Tama River',
 'aic-24601': 'Cranes at Umezawa Marsh', 'aic-24751': 'Surugadai in Edo', 'aic-86982': 'Nakahara',
 'aic-24686': 'Nihonbashi Bridge', 'aic-24720': 'Lower Meguro', 'aic-86996': 'Hodogaya Pine Road',
 'aic-24610': 'Cushion Pine at Aoyama', 'aic-86735': 'Fuji from the Minobu River', 'aic-13274': 'Senju',
 'aic-24728': 'Riders at Sekiya Village', 'aic-19006': 'Satta Peak', 'aic-25356': 'Fuji from Zoshigaya Teahouse',
 'aic-24781': 'Fuji from Senju', 'aic-86985': 'Katakura Tea Plantation', 'aic-24756': 'Goten Hill at Shinagawa',
 'aic-23555': 'Fuji from Lake Ashi', 'aic-10932': 'Snow at Akabane Bridge', 'aic-89593': 'Snow on the Sumida River',
 'aic-26219': 'Golden Pheasant in Snow', 'cma-152495': 'Evening Snow at Kambara',
 'aic-22017': 'Couple Under an Umbrella in Snow', 'aic-112221': 'Deer Sketch', 'cma-155078': 'Flower Boat',
 'aic-19183': 'The Treasure Ship', 'aic-18645': 'Insects and Snail', 'cma-129867': 'Floral Dog and Insects',
 'cma-154040': 'Festival of Insects', 'cma-452194': 'Insect Studies', 'aic-81198': 'Fishermen of Katase',
 'aic-81196': 'Koto and Seashells', 'aic-23535': 'Cranes by the Shore', 'cma-155931': 'Vintage Seashell',
 'aic-81173': 'Two Crabs and Camellia', 'aic-89539': 'Monkey Bridge', 'aic-210511': 'Monumental Monkey',
 'cma-155095': 'Bantam Rooster', 'aic-21334': 'Rooster Over Adonis', 'cma-104260': 'Roosters and Ducks',
 'cma-153138': 'Rooster Key', 'cma-104269': 'Rooster and Morning Glories', 'aic-31642': 'Pheasant and Pine',
 'aic-33392': 'Male Pheasant', 'cma-104255': 'Pheasants and Bird', 'aic-77324': 'Mandarin Ducks',
 'aic-19804': 'Mandarin Ducks in Reeds', 'cma-140408': 'Peregrine Falcons', 'cma-120091': 'The Beautiful Swan',
 'cma-170792': 'Brahminy Ducks', 'aic-197424': 'Red Parrot', 'aic-43421': 'Parrot and Fans',
 'aic-43416': 'Parrot and Bells', 'aic-33395': 'Hokusai Hawk', 'cma-163797': 'Royal Elephant',
 'cma-314445': 'Prince and Elephant', 'aic-113249': 'Elephant from Behind', 'cma-109031': 'Elephant with Howdah',
 'aic-86741': 'Bamboo and Rising Sun', 'cma-132620': 'Orange Lily Botanical', 'cma-143234': 'Windmill Landscape',
 'aic-49276': "Halley's Comet 1910", 'cma-108400': 'A Great Star Fell', 'cma-127078': 'Fruit of February',
 'cma-124246': 'Fruit of May', 'cma-124247': 'Fruit of June', 'cma-114512': 'Siberian Apple',
 'aic-72183': 'Still Life with Fruit', 'aic-56236': 'Autumn Flower and Sparrow', 'aic-4280': 'Shinagawa Harbor',
 'aic-4315': 'Mount Fuji from Hara', 'aic-4321': 'Kanbara', 'aic-4407': 'Torii at Miya', 'aic-4390': 'Goyu',
 'aic-4394': 'Akasaka', 'aic-4404': 'Narumi', 'aic-4330': 'Ejiri', 'aic-4384': 'Futakawa',
 'aic-81135': 'Sea Turtles and Urashima Taro', 'cma-150745': 'Tortoise', 'aic-26750': 'Turtles Swimming in a Stream',
 'aic-24889': 'Boy and the Giant Carp', 'cma-140476': 'Paulownias and Chrysanthemums', 'aic-21177': 'Cat Pawing at Goldfish',
}

JP = re.compile(r'Hiroshige|Hokusai|Koryusai|Kunimaro|Kunisada|Hokkei|Taito|Eisen|Masayoshi|Otei|Harunobu|Ganku|Ky.sai|Sekka|Moromasa|J.t.|Zeshin|K.rin|Shigenaga|Terutada|Jakuchu|Shutei|Kunimaru|Chosui|Bensaku|Rosetsu|Shunsho|H.itsu|Toyokuni|Utagawa|Katsushika|Isoda')
CN = re.compile(r'Ren Yi|Zhang Ruoai|Yan Hui')
TEE = ['71', '586', '438', '1592', '162', '360']
HOOD = ['380', '734', '892', '1412']
SWEAT = ['145', '411', '845']
LS = ['356', '57']
GOOD = re.compile(r'black|white|natural|sand|bone|oatmeal|cream|ivory|heather|ash|navy|forest|sage|military|olive|maroon|khaki|latte|dust|tan|toast|mauve|slate|charcoal|asphalt|pebble|butter|chambray|moss|espresso|terracotta|brick|blue-jean|denim|dusty-rose|light-pink|soft-pink|carolina|sky|lavender|clay|mustard|gold|cypress|pine|chestnut|vintage|grey|gray|smoke|sandshell|cardinal|wine|adobe|agave|storm|steel|teal|berry|spruce|seafoam|ice|chalky|hemp|granite|pepper|graphite|stone')
BAD = re.compile(r'neon|lime|heliconia|azalea|daisy|haze|flo-blue|watermelon|crunchberry|yam|tropical|irish|kelly|turf|grass|prism|orchid|charity|lagoon|island')

def nice_colors(pid):
    return [c for c in colors(pid) if GOOD.search(c[1]) and not BAD.search(c[1])]

def pick_garment(rng, mix):
    r = rng.random()
    acc = 0
    for group, w in mix:
        acc += w
        if r < acc:
            return rng.choice(group)
    return rng.choice(TEE)

def pick_color(rng, pid, want=None):
    cs = nice_colors(pid)
    if want == 'dark':
        cs = [c for c in cs if lum(c[2]) < 0.12] or cs
    elif want == 'light':
        cs = [c for c in cs if lum(c[2]) > 0.55] or cs
    elif want == 'mid':
        cs = [c for c in cs if 0.08 < lum(c[2]) < 0.6] or cs
    return rng.choice(cs)

def ink_for(rgb):
    return '#F3EBDD' if lum(rgb) < 0.32 else '#1F1F24'

def year(s):
    m = re.search(r'1[0-9]{3}', s or '')
    return m.group(0) if m else ''

def clean_title(k, v):
    if k in TITLES:
        return TITLES[k]
    t = v['title'].split('\n')[0]
    t = re.split(r'\s*\(|, from| from the series| from an untitled|, illustration for|, section of|, plate ', t)[0]
    t = t.strip(' ,;:')
    small = {'a', 'an', 'and', 'the', 'of', 'in', 'on', 'at', 'by', 'for', 'to', 'with', 'or', 'from'}
    words = t.split()
    return ' '.join(w if (i and w.lower() in small) or not w[:1].islower() else w[:1].upper() + w[1:]
                    for i, w in enumerate(words))

def style_of(k, v):
    a = v.get('artist', '')
    if JP.search(a) or 'Japan' in v.get('origin', ''):
        return 'Japanese Woodblock' if v['type'] == 'Print' else 'Japanese Art'
    if CN.search(a) or 'China' in v.get('origin', ''):
        return 'Chinese Painting'
    if re.search(r'India|Mughal|Rajasthan|Mewar', v.get('origin', '') + v['title']) or re.search(r'Prince|Ragini|Ramayana|Mahout', v['title']):
        return 'Indian Miniature'
    if v['type'] == 'Print' and v.get('colorful', 99) < 14:
        return 'Vintage Etching'
    return 'Vintage Art'

def short_artist(a):
    a = re.sub(r'\s*\(.*', '', a or '').strip()
    if not a:
        return ''
    parts = a.split()
    if JP.search(a) and len(parts) >= 2:
        return parts[1] if parts[0] in ('Utagawa', 'Katsushika', 'Isoda', 'Totoya', 'Suzuki', 'Kitao', 'Keisai', 'Maezawa', 'Shibata', 'Kawanabe', 'Kamisaka', 'Ogata', 'Nishimura', 'Ito', 'Tanaka', 'Nagasawa', 'Katsukawa', 'Sakai', 'Kishi', 'Furuyama', 'Yabu', 'Tsuda') else a
    return parts[-1] if len(parts) > 1 else a

PRODUCTS, CREDITS = [], []
_used_slugs = set()

def save(name, cat, pid, color, design, desc, features, rng, scale=1.0):
    s = slug(name)
    base, i = s, 2
    while s in _used_slugs:
        s, i = f'{base}-{i}', i + 1
    _used_slugs.add(s)
    img = compose(pid, color[1], design, scale=scale)
    img.save(os.path.join(OUT_IMG, f'{s}.webp'), 'WEBP', quality=80, method=6)
    g = GARMENTS[pid]
    sz = sizes(pid)
    cols = [c[0] for c in nice_colors(pid)]
    PRODUCTS.append({
        'id': f'pod-{len(PRODUCTS) + 1:04d}',
        'name': name,
        'price': 'Contact for Price',
        'category': cat,
        'img': f'/images/apparel/{s}.webp',
        'description': desc,
        'features': features + [
            f"Blank: {META[pid]['title']}",
            f"Shown in {color[0]}",
            f"Sizes: {sz[0]}–{sz[-1]}" if len(sz) > 1 else f'Size: {sz[0]}',
            f"{len(cols)} colors available",
            'Printed on demand (DTG)',
        ],
    })

MIX_ART = [(TEE, 0.46), (HOOD, 0.24), (SWEAT, 0.20), (LS, 0.06), (['248'], 0.04)]
MIX_TXT = [(TEE, 0.44), (HOOD, 0.24), (SWEAT, 0.22), (LS, 0.05), (['248'], 0.05)]

def art_design(k, v, rng, ink, force=None):
    im = Image.open(os.path.join(HERE, f'art/full/{k}.jpg')).convert('RGB')
    title = clean_title(k, v)
    art_by = short_artist(v.get('artist'))
    sub = ' · '.join(x for x in [art_by, year(v.get('date'))] if x)
    r = im.width / im.height
    if force:
        st = force
    elif r > 1.15:
        st = rng.choice(['framed', 'framed', 'plain', 'stamp'])
    elif r > 0.85:
        st = rng.choice(['circle', 'circle', 'framed', 'stamp'])
    else:
        st = rng.choice(['arch', 'arch', 'framed', 'stamp'])
    if st == 'framed':
        return st, D.art_framed(im, title, sub, ink, cap=rng.choice(['sans', 'serif']))
    if st == 'plain':
        return st, D.art_plain(im, title, sub, ink)
    if st == 'stamp':
        return st, D.art_stamp(im, year(v.get('date')) and f"{title.split(',')[0][:28]}" or title[:28], sub, ink)
    if st == 'arch':
        return st, D.art_arch(im, title, sub, ink)
    return st, D.art_circle(im, title, sub, ink)

CUTE = {'cat', 'dog', 'rabbit', 'owl', 'frog', 'turtle', 'bird', 'butterfly', 'monkey', 'elephant', 'fox', 'koi', 'parrot', 'swan'}
POPULAR = {'cat', 'wave', 'mountain', 'tiger', 'moon', 'koi', 'crane', 'rabbit', 'dragon', 'owl', 'butterfly', 'turtle', 'blossom', 'horse', 'bird', 'parrot', 'snow'}
THEME_WORD = {'cat': 'Cat', 'dog': 'Dog', 'turtle': 'Turtle', 'wave': 'Ocean', 'koi': 'Koi Fish', 'crane': 'Crane',
              'owl': 'Owl', 'bird': 'Bird', 'butterfly': 'Butterfly', 'flower': 'Floral', 'blossom': 'Cherry Blossom',
              'mushroom': 'Mushroom', 'tiger': 'Tiger', 'horse': 'Horse', 'fox': 'Fox', 'rabbit': 'Rabbit', 'frog': 'Frog',
              'deer': 'Deer', 'bear': 'Bear', 'wolf': 'Wolf', 'lion': 'Lion', 'dragon': 'Dragon', 'moon': 'Moon',
              'mountain': 'Mount Fuji', 'snow': 'Winter', 'sunflower': 'Sunflower', 'skull': 'Skull', 'ship': 'Sailing',
              'bee': 'Insect', 'shell': 'Seashell', 'octopus': 'Crab', 'whale': 'Whale', 'monkey': 'Monkey',
              'rooster': 'Rooster', 'peacock': 'Pheasant', 'swan': 'Duck', 'parrot': 'Parrot', 'eagle': 'Falcon',
              'elephant': 'Elephant', 'bamboo': 'Bamboo', 'garden': 'Landscape', 'star': 'Celestial', 'fruit': 'Fruit'}

def build_art():
    rng = random.Random(2026)
    for k in PICKED:
        if k in EXCLUDE:
            continue
        v = ITEMS[k]
        reps = 3 if v['theme'] in POPULAR else 2
        styles_done, groups_done = set(), set()
        for rep in range(reps):
            mix = MIX_ART if rep == 0 else [(HOOD, 0.45), (SWEAT, 0.35), (TEE, 0.2)]
            if v['theme'] in CUTE and rep == reps - 1:
                mix = [(['307'], 0.5), (HOOD, 0.25), (TEE, 0.25)]
            for _ in range(6):
                pid = pick_garment(rng, mix)
                if GARMENTS[pid]['cat'] not in groups_done:
                    break
            groups_done.add(GARMENTS[pid]['cat'])
            color = pick_color(rng, pid, rng.choice(['dark', 'light', 'mid', None]))
            ink = ink_for(color[2])
            force = None
            for _ in range(4):
                st, des = art_design(k, v, rng, ink, force)
                if st not in styles_done:
                    break
            styles_done.add(st)
            title = clean_title(k, v)
            stl = style_of(k, v)
            g = GARMENTS[pid]
            name = f"{title} {stl} {g['label']}"
            artist = re.sub(r'\s*\(.*', '', v.get('artist') or 'Unknown artist')
            museum = 'Art Institute of Chicago' if v['src'] == 'aic' else 'Cleveland Museum of Art'
            tw = THEME_WORD.get(v['theme'], '')
            desc = (f"{tw} {stl.lower()} {g['label'].lower()} featuring “{title}” by {artist}"
                    f"{' (' + v['date'] + ')' if v.get('date') else ''}. Museum artwork from the {museum} open-access "
                    f"collection (CC0 public domain), printed on demand.").strip()
            feats = [f'Artwork: {artist}', f'Style: {stl}', f'Theme: {tw}']
            save(name, g['cat'], pid, color, des, desc, feats, rng)
        who = re.sub(r'\s*\(.*', '', v.get('artist') or '—')
        CREDITS.append(f"| {clean_title(k, v)} | {who} | {v.get('date', '')} | {v['license']} | {v['page']} |")

SUN = [['#F6C453', '#F4A259', '#E76F51', '#C8553D', '#8E3B46'],
       ['#FFE29A', '#FFB86B', '#FF8C61', '#E3646B', '#A23E6B'],
       ['#F9DC5C', '#F4A259', '#E9724C', '#C5283D', '#481D24'],
       ['#FFD3A5', '#FD9F8B', '#F2727F', '#B65B8E', '#5B4B8A']]
GROOVY = [['#F6C453', '#E76F51', '#F4A259', '#2A9D8F'], ['#FFE29A', '#FF6F59', '#FF9F1C', '#2EC4B6'],
          ['#F7B2BD', '#D7263D', '#F46036', '#1B998B'], ['#EAE2B7', '#D62828', '#F77F00', '#003049'],
          ['#FFCB77', '#FE6D73', '#17C3B2', '#227C9D']]
ACCENT_DARK = ['#F4A259', '#E9C46A', '#F7B2BD', '#8ECAE6', '#FFB4A2', '#B5E48C']
ACCENT_LIGHT = ['#C8553D', '#2A9D8F', '#9D4EDD', '#BC4749', '#386641', '#1D3557', '#B5651D']

def text_design(layout, payload, rng, color):
    dark = lum(color[2]) < 0.32
    ink = '#F3EBDD' if dark else '#1F1F24'
    accent = rng.choice(ACCENT_DARK if dark else ACCENT_LIGHT)
    if layout == 'stack':
        return D.lay_stack(payload, ink, accent, rng)
    if layout == 'groovy':
        pal = list(rng.choice(GROOVY))
        if not dark:
            pal[0] = rng.choice(['#1F1F24', '#3D2C2E', '#264653'])
        return D.lay_groovy(payload, pal, rng)
    if layout == 'sunset':
        t, sub, mtn = payload
        return D.lay_sunset(t, sub, ink, rng.choice(SUN), rng, mountains=('#2B2D42' if not dark else '#3A2E39') if mtn else None)
    if layout == 'badge':
        top, center, bottom = payload
        return D.lay_badge(top, center, bottom, ink, accent, rng)
    if layout == 'verse':
        w, sub, verse, ref = payload
        return D.lay_verse(w, sub, verse, ref, ink, accent if dark else rng.choice(['#B5651D', '#8E3B46', '#386641', '#1D3557']), rng)
    if layout == 'minimal':
        t, small = payload
        return D.lay_minimal(t, small, ink, rng)
    raise ValueError(layout)

THEME_SUFFIX = {'Christian': 'Christian', 'Cat Lover': 'Cat Lover', 'Dog Lover': 'Dog Lover', 'Coffee': 'Coffee',
                'Outdoors': 'Outdoor', 'Beach': 'Beach', 'Retro': 'Retro', 'Positive': 'Positive', 'Family': 'Family',
                'Teacher': 'Teacher', 'Nurse': 'Nurse', 'Funny': 'Funny', 'Plants': 'Plant Lover', 'Books': 'Book Lover',
                'Gaming': 'Gamer', 'Motivation': 'Motivational', 'Music': 'Music', 'Fall': 'Fall', 'Halloween': 'Halloween',
                'Christmas': 'Christmas', 'Summer': 'Summer', 'Spring': 'Spring', 'Sports': 'Sports', 'Fitness': 'Fitness',
                'Fishing': 'Fishing', 'Motorcycle': 'Biker', 'Horses': 'Horse Lover', 'Farm': 'Farm', 'Travel': 'Travel'}

def build_text():
    rng = random.Random(7)
    for layout, payload, base, theme in PHRASES:
        groups_done = set()
        for rep in range(2):
            for _ in range(6):
                pid = pick_garment(rng, MIX_TXT if rep == 0 else [(HOOD, 0.4), (SWEAT, 0.35), (TEE, 0.25)])
                if GARMENTS[pid]['cat'] not in groups_done:
                    break
            groups_done.add(GARMENTS[pid]['cat'])
            color = pick_color(rng, pid, rng.choice(['dark', 'dark', 'light', 'mid']))
            des = text_design(layout, payload, rng, color)
            g = GARMENTS[pid]
            suf = THEME_SUFFIX.get(theme, '')
            name = f"{base} {suf} {g['label']}" if suf and suf.split()[0].lower() not in base.lower() else f"{base} {g['label']}"
            desc = f"{suf or theme} graphic {g['label'].lower()} – “{base}” design, printed on demand on a soft {META[pid]['title'].split('|')[0].strip().lower()}."
            if layout == 'verse':
                desc += f" Scripture: {payload[3]} (KJV)."
            feats = [f'Theme: {theme}', f'Design style: {layout.title()}']
            save(name, g['cat'], pid, color, des, desc, feats, rng, scale=0.95)

def build_special():
    rng = random.Random(42)
    def art(k):
        return Image.open(os.path.join(HERE, f'art/full/{k}.jpg')).convert('RGB')
    c = lambda pid, s: next(x for x in colors(pid) if x[1] == s)

    # 1. Ocean Turtle Hoodie
    des = D.lay_badge('Ocean Turtle', '', 'Save the Seas', '#F3EBDD', '#8ECAE6', rng, inner=art('aic-33485'))
    save('Ocean Turtle Hoodie', 'Hoodies', '380', c('380', 'navy-blazer'), des,
         'Ocean turtle hoodie with a vintage Hiroshige sea-turtle woodblock print inside a “Save the Seas” badge. Cozy premium pullover hoodie for ocean and beach lovers.',
         ['Artwork: Utagawa Hiroshige, c. 1840s (CC0)', 'Theme: Ocean / Turtle'], rng)

    # 2. Folk festival
    W = 1200
    canvas = Image.new('RGBA', (W, 1500), (0, 0, 0, 0))
    canvas.alpha_composite(D.string_lights(W, rng, wire='#9A9A9A'), (0, 0))
    txt = D.lay_stack([('All lights turned off', 'mid'), ('can be turned on', 'script'), ('Folk Music Festival', 'small')],
                      '#F3EBDD', '#FFD166', rng)
    txt.thumbnail((W - 60, 1100))
    canvas.alpha_composite(txt, ((W - txt.width) // 2, 330))
    save('All Lights Turned Off Can Be Turned On Folk Music Festival Hoodie', 'Hoodies', '734', c('734', 'black'),
         D.trim(canvas), 'Folk music festival hoodie with warm string lights and the line “All lights turned off can be turned on.” Relaxed-fit hoodie for festival nights and acoustic sessions.',
         ['Theme: Folk Music Festival', 'Design style: String lights typography'], rng)

    # 3. Forgiven & Faithful
    des = D.lay_verse('Forgiven', '& Faithful', 'Blessed is he whose transgression is forgiven, whose sin is covered.', 'Psalm 32:1', '#2B2B2B', '#8E3B46', rng)
    save('Forgiven & Faithful Sweatshirt – Psalm 32:1 Christian Hoodie for Spiritual Comfort', 'Sweatshirts', '411', c('411', 'bone'), des,
         'Christian sweatshirt with “Forgiven & Faithful” script and Psalm 32:1 (KJV): “Blessed is he whose transgression is forgiven, whose sin is covered.” A soft, comforting faith piece.',
         ['Scripture: Psalm 32:1 (KJV)', 'Theme: Christian / Faith'], rng)

    # 4. Cats in Space
    S = 900
    canvas = Image.new('RGBA', (1200, 1500), (0, 0, 0, 0))
    sky = D.starfield(S, rng)
    from PIL import ImageDraw as _ID
    d = _ID.Draw(sky)
    D.planet(d, 190, 210, 60, '#F4A259', '#FFE29A')
    d.ellipse([650, 130, 740, 220], fill=D.rgba('#E9E4D8'))
    kitten = D.thicken(D.cutout_dark(art('cma-162253'), gap=30, soft=50, crop=(0.1, 0.22, 0.95, 0.9)), 3, '#F3EBDD')
    kitten.thumbnail((560, 560))
    sky.alpha_composite(kitten, ((S - kitten.width) // 2, S - kitten.height - 110))
    canvas.alpha_composite(sky, ((1200 - S) // 2, 0))
    f = D.fit_font('Righteous-Regular.ttf', 'CATS IN SPACE', 1100, 190)
    for off, col in ((14, '#E76F51'), (7, '#F4A259')):
        D.draw_line(canvas, 'CATS IN SPACE', f, S + 120 + off, D.rgba(col), cx=600 + off)
    D.draw_line(canvas, 'CATS IN SPACE', f, S + 120, D.rgba('#F3EBDD'))
    save('Cats in Space Hoodie', 'Hoodies', '892', c('892', 'black'), D.trim(canvas),
         'Cats in space hoodie: a vintage kitten sketch floating in a starry galaxy with a ringed planet and retro “Cats in Space” lettering. Oversized heavyweight hoodie.',
         ['Artwork: Paul Gachet, Head of a Kitten (CC0)', 'Theme: Cat / Space'], rng)

    # 5. Funny Cat Hoodie
    canvas = Image.new('RGBA', (1200, 1700), (0, 0, 0, 0))
    a = D.art_arch(art('aic-12518'), 'Nope. Not today.', None, '#1F1F24')
    a.thumbnail((1000, 1500))
    canvas.alpha_composite(a, ((1200 - a.width) // 2, 0))
    save('Funny Cat Hoodie', 'Hoodies', '380', c('380', 'oatmeal-heather'), D.trim(canvas),
         'Funny cat hoodie with Steinlen’s lazy tabby lounging on a balustrade and the caption “Nope. Not today.” Perfect for cat lovers who need a nap.',
         ['Artwork: Théophile-Alexandre Steinlen, 1909 (CC0)', 'Theme: Funny Cat'], rng)

    # 6. Retro Kitten Trendy Hoodie
    W = 1200
    canvas = Image.new('RGBA', (W, 1800), (0, 0, 0, 0))
    disc = D.sunset_disc(820, SUN[1])
    canvas.alpha_composite(disc, ((W - 820) // 2, 0))
    kit = D.thicken(D.cutout_dark(art('cma-162253'), gap=30, soft=50, crop=(0.1, 0.22, 0.95, 0.9)), 3, '#3D2C2E')
    kit.thumbnail((700, 700))
    canvas.alpha_composite(kit, ((W - kit.width) // 2, 860 - kit.height))
    g = D.lay_groovy(['Retro Kitten'], ['#3D2C2E', '#E3646B', '#FF8C61', '#FFB86B'], rng)
    g.thumbnail((W, 400))
    canvas.alpha_composite(g, ((W - g.width) // 2, 900))
    save('Retro Kitten Trendy Hoodie', 'Hoodies', '734', c('734', 'bone'), D.trim(canvas),
         'Retro kitten hoodie: a sketched kitten in front of a 70s striped sunset with groovy “Retro Kitten” lettering. Trendy relaxed-fit hoodie.',
         ['Artwork: Paul Gachet, Head of a Kitten (CC0)', 'Theme: Retro / Cat'], rng)

    # 7. We Ride at Dawn T-Shirt
    rider = D.thicken(D.cutout_dark(art('cma-166878'), crop=(0.08, 0.0, 0.97, 0.97), gap=25, soft=60), 5, '#1F1A1C')
    des = D.lay_sunset('We Ride at Dawn', 'Saddle up', '#F3EBDD', SUN[2], rng, mountains=None, silhouette=rider, sil_scale=0.85)
    save('We Ride at Dawn T-Shirt', 'T-Shirts', '71', c('71', 'black'), des,
         'We Ride at Dawn t-shirt: a Degas horse-and-rider sketch against a retro striped sunrise. Soft Bella + Canvas staple tee.',
         ['Artwork: Edgar Degas, Horse and Rider (CC0)', 'Theme: Retro / Horse'], rng)

if __name__ == '__main__':
    only = os.environ.get('ONLY')
    build_special()
    if only != 'special':
        build_text()
        build_art()
    head, rest = PRODUCTS[:7], PRODUCTS[7:]
    random.Random(99).shuffle(rest)
    json.dump(head + rest, open(OUT_JSON, 'w'), indent=1, ensure_ascii=False)
    with open(OUT_CREDITS, 'w') as f:
        f.write('# Apparel artwork credits\n\nAll artwork used on apparel mockups is public domain / CC0 open access.\n'
                'Blank garment photos: Printful product catalog (api.printful.com). Fonts: Google Fonts (SIL OFL / Apache 2.0).\n\n'
                '| Artwork | Artist | Date | License | Source |\n|---|---|---|---|---|\n')
        f.write('\n'.join(CREDITS) + '\n')
    print(len(PRODUCTS), 'products')
