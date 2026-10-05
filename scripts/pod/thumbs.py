import json, os, urllib.request, concurrent.futures as cf, io
from PIL import Image
items=json.load(open('art/relevant.json'))
UA={'User-Agent':'kanoha-catalog/1.0','AIC-User-Agent':'kanoha-catalog/1.0'}
def job(kv):
    k,v=kv; fn=f'art/thumb/{k}.jpg'
    if os.path.exists(fn): return
    u=v['img'].replace('/full/843,/','/full/300,/') if v['src']=='aic' else v['img']
    for attempt in range(3):
        try:
            data=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
            im=Image.open(io.BytesIO(data)).convert('RGB'); im.thumbnail((300,300)); im.save(fn,quality=85); return
        except Exception as e: err=e
    print('fail',k,err)
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(job,items.items()))
print(len(os.listdir('art/thumb')))
