import json, os, time, urllib.request, urllib.parse, re, sys
UA={'User-Agent':'kanoha-catalog/1.0','AIC-User-Agent':'kanoha-catalog/1.0','Content-Type':'application/json'}
THEMES={
 'cat':['cat','cats','kitten'],'dog':['dog','puppy'],'turtle':['turtle','tortoise'],
 'wave':['wave','waves','ocean','sea'],'koi':['carp','koi','goldfish','fish'],'crane':['crane','heron','egret'],
 'owl':['owl'],'bird':['bird','sparrow','swallow','finch'],'butterfly':['butterfly','butterflies','moth'],
 'flower':['flowers','peony','iris','chrysanthemum','rose','lotus'],'blossom':['cherry blossom','plum blossom','blossoms'],
 'mushroom':['mushroom','fungi'],'tiger':['tiger'],'horse':['horse','horses','horseman'],'fox':['fox'],
 'rabbit':['rabbit','hare'],'frog':['frog','toad'],'deer':['deer','stag'],'bear':['bear'],'wolf':['wolf'],
 'lion':['lion'],'dragon':['dragon'],'moon':['moon','moonlight','night'],'mountain':['mount fuji','mountain','mountains'],
 'snow':['snow','winter'],'sunflower':['sunflower'],'skull':['skull'],'ship':['ship','sailboat','boat'],
 'bee':['bee','bees','insect','beetle'],'shell':['shell','shells'],'octopus':['octopus','squid','crab'],'whale':['whale'],
 'monkey':['monkey'],'rooster':['rooster','cock','hen'],'peacock':['peacock','pheasant'],'swan':['swan','duck'],
 'parrot':['parrot','cockatoo'],'eagle':['eagle','hawk','falcon'],'elephant':['elephant'],'bamboo':['bamboo'],
 'garden':['garden','landscape'],'star':['comet','stars','astronomy','planet'],'fruit':['fruit','pear','apple','lemon'],
}
BAD=re.compile(r'nude|naked|bath|bather|venus|leda|crucif|execution|massacre|war|battle|dead|death|corpse|slave|negro|blackface|minstrel|caricature|satire|lynch|hanging|suicide|erotic|shunga|courtesan|brothel|sex|bloody|murder|blood|beheading',re.I)
def post(url,body):
    r=urllib.request.Request(url,data=json.dumps(body).encode(),headers=UA)
    return json.load(urllib.request.urlopen(r,timeout=60))
def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60))
items={}
if os.path.exists('art/index.json'): items=json.load(open('art/index.json'))
for theme,qs in THEMES.items():
    for q in qs:
        # AIC
        try:
            d=post('https://api.artic.edu/api/v1/artworks/search',{
              'q':q,'limit':60,
              'query':{'bool':{'must':[{'term':{'is_public_domain':True}},{'exists':{'field':'image_id'}}],
                               'should':[{'match':{'artwork_type_title':'Print'}},{'match':{'artwork_type_title':'Painting'}},{'match':{'artwork_type_title':'Drawing and Watercolor'}}],'minimum_should_match':1}},
              'fields':['id','title','artist_title','date_display','image_id','artwork_type_title','thumbnail','place_of_origin','style_title']})
            for a in d['data']:
                if not a.get('image_id'): continue
                if a.get('artwork_type_title') not in ('Print','Painting','Drawing and Watercolor'): continue
                t=a.get('thumbnail') or {}
                w,h=t.get('width') or 0,t.get('height') or 0
                if not w or not h: continue
                key=f"aic-{a['id']}"
                if key in items: continue
                if BAD.search(a['title'] or ''): continue
                items[key]={'src':'aic','theme':theme,'q':q,'title':a['title'],'artist':a.get('artist_title') or '','date':a.get('date_display') or '',
                  'type':a['artwork_type_title'],'origin':a.get('place_of_origin') or '','ratio':w/h,
                  'img':f"https://www.artic.edu/iiif/2/{a['image_id']}/full/843,/0/default.jpg",
                  'page':f"https://www.artic.edu/artworks/{a['id']}",'license':'CC0 (public domain)'}
        except Exception as e: print('aic err',q,e,file=sys.stderr)
        time.sleep(1.1)
        # Cleveland
        try:
            u='https://openaccess-api.clevelandart.org/api/artworks/?'+urllib.parse.urlencode({'q':q,'cc0':1,'has_image':1,'limit':60})
            d=get(u)
            for a in d['data']:
                if a.get('type') not in ('Print','Painting','Drawing'): continue
                im=(a.get('images') or {}).get('web') or {}
                if not im.get('url'): continue
                w,h=int(im.get('width') or 0),int(im.get('height') or 0)
                if not w or not h: continue
                key=f"cma-{a['id']}"
                if key in items: continue
                if BAD.search(a['title'] or ''): continue
                creators=a.get('creators') or []
                artist=re.sub(r'\s*\(.*','',creators[0]['description']) if creators else ''
                items[key]={'src':'cma','theme':theme,'q':q,'title':a['title'],'artist':artist,'date':a.get('creation_date') or '',
                  'type':a['type'],'origin':a.get('culture',[''])[0] if a.get('culture') else '','ratio':w/h,'img':im['url'],
                  'page':a.get('url') or '','license':'CC0'}
        except Exception as e: print('cma err',q,e,file=sys.stderr)
        time.sleep(0.5)
    print(theme, sum(1 for v in items.values() if v['theme']==theme), flush=True)
json.dump(items,open('art/index.json','w'),indent=0)
print('total',len(items))
