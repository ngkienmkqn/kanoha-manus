"""Tải ảnh tranh (bản ~700px) cho các tác phẩm đã chọn trong art/picked.json."""
import json, os, urllib.request, concurrent.futures as cf, io
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
items = json.load(open(os.path.join(HERE, 'art/relevant.json')))
picked = json.load(open(os.path.join(HERE, 'art/picked.json')))
UA = {'User-Agent': 'kanoha-catalog/1.0', 'AIC-User-Agent': 'kanoha-catalog/1.0'}
os.makedirs(os.path.join(HERE, 'art/full'), exist_ok=True)

def job(k):
    fn = os.path.join(HERE, f'art/full/{k}.jpg')
    if os.path.exists(fn):
        return
    v = items[k]
    urls = [v['img'].replace('/full/843,/', '/full/700,/'), v['img'].replace('/full/843,/', '/full/300,/')] if v['src'] == 'aic' else [v['img']]
    for u in urls:
        try:
            data = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            im.thumbnail((800, 800))
            im.save(fn, quality=90)
            return
        except Exception as e:
            err = e
    print('fail', k, err)

with cf.ThreadPoolExecutor(6) as ex:
    list(ex.map(job, picked))
