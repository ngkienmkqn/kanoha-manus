import json, os, time, urllib.request
IDS=[71,438,586,360,1592,162,307,356,57,248,380,146,294,892,734,1412,145,411,897,845]
UA={'User-Agent':'kanoha-catalog/1.0'}
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read()
meta={}
for pid in IDS:
    fn=f'blanks/p{pid}.json'
    if not os.path.exists(fn):
        open(fn,'wb').write(get(f'https://api.printful.com/products/{pid}')); time.sleep(2.2)
    d=json.load(open(fn))['result']
    colors={}
    for v in d['variants']:
        colors.setdefault(v['color'],{'code':v['color_code'],'img':v['image']})
    meta[pid]={'title':d['product']['title'],'type':d['product']['type_name'],'colors':colors}
json.dump(meta,open('blanks/meta.json','w'),indent=1)
# one image per product for preview
for pid,m in meta.items():
    c,info=next(iter(m['colors'].items()))
    fn=f'blanks/prev_{pid}.jpg'
    if not os.path.exists(fn): open(fn,'wb').write(get(info['img']))
print('ok')
