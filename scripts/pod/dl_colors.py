import json, os, urllib.request, concurrent.futures as cf, re
SEL=[71,586,307,356,380,734,145,411,1592,57,845,1412,248,360,162,892,438]
meta=json.load(open('blanks/meta.json'))
jobs=[]
for pid in SEL:
    for c,info in meta[str(pid)]['colors'].items():
        slug=re.sub(r'[^a-z0-9]+','-',c.lower()).strip('-')
        fn=f'blanks/{pid}/{slug}.jpg'
        os.makedirs(os.path.dirname(fn),exist_ok=True)
        if not os.path.exists(fn): jobs.append((info['img'],fn))
def dl(j):
    u,fn=j
    data=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'kanoha-catalog/1.0'}),timeout=60).read()
    open(fn,'wb').write(data)
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(dl,jobs))
print(len(jobs),'downloaded')
