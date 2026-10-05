import json, numpy as np, collections
from PIL import Image, ImageDraw, ImageFont
items=json.load(open('art/relevant.json'))
for k,v in items.items():
    a=np.asarray(Image.open(f'art/thumb/{k}.jpg').convert('RGB'),dtype=float)
    L=a@[.299,.587,.114]
    rg=a[...,0]-a[...,1]; yb=.5*(a[...,0]+a[...,1])-a[...,2]
    colorful=np.sqrt(rg.std()**2+yb.std()**2)+.3*np.sqrt(rg.mean()**2+yb.mean()**2)
    v['contrast']=float(L.std()); v['mean']=float(L.mean()); v['colorful']=float(colorful)
    s=min(v['contrast'],70)/70 + min(colorful,60)/60*0.8
    if v['mean']<55 or v['mean']>225: s-=0.8
    if v['type']=='Print' and ('Japan' in v['origin'] or 'Japan' in v.get('artist','')): s+=0.25
    v['score']=s
json.dump(items,open('art/relevant.json','w'),indent=0)
CAP={'flower':40,'moon':30,'mountain':30,'garden':25,'wave':35,'snow':20,'fruit':25,'blossom':30,'koi':30,'ship':25}
by=collections.defaultdict(list)
for k,v in items.items(): by[v['theme']].append((v['score'],k))
sel=[]
for t,l in by.items():
    l.sort(reverse=True); sel+= [k for s,k in l[:CAP.get(t,40)] if s>0.55]
print(len(sel))
json.dump(sel,open('art/candidates.json','w'))
# contact sheets 8x6 per sheet
font=ImageFont.truetype('fonts/Poppins-Bold.ttf',13)
per=48
for p in range(0,len(sel),per):
    sheet=Image.new('RGB',(8*190,6*215),'white'); d=ImageDraw.Draw(sheet)
    for i,k in enumerate(sel[p:p+per]):
        im=Image.open(f'art/thumb/{k}.jpg'); im.thumbnail((180,180))
        x,y=(i%8)*190,(i//8)*215
        sheet.paste(im,(x+5+(180-im.width)//2,y+5+(180-im.height)//2))
        d.text((x+5,y+188),f"{p+i} {items[k]['theme']}",fill='red',font=font)
    sheet.save(f'art/sheet_{p//per:02d}.jpg',quality=80)
print('sheets',(len(sel)+per-1)//per)
