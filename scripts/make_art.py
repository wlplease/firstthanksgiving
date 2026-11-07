from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'public'
OUT.mkdir(exist_ok=True)
BG = '#d9ded2'
GREEN = '#254738'
CLAY = '#b65d3d'
GOLD = '#dfc58b'

def font(size, serif=False):
    name = 'georgia.ttf' if serif else 'arial.ttf'
    try: return ImageFont.truetype(f'C:/Windows/Fonts/{name}', size)
    except OSError: return ImageFont.load_default()

def art(size, title=False):
    w,h=size
    im=Image.new('RGB',size,BG)
    d=ImageDraw.Draw(im)
    d.rectangle((0,int(h*.62),w,h),fill=GREEN)
    d.ellipse((int(w*.53),int(h*.08),int(w*.94),int(h*.08)+int(w*.41)),fill=GOLD)
    for n in range(7):
        y=int(h*(.66+n*.07))
        d.arc((-int(w*.2),y-int(h*.16),int(w*1.2),y+int(h*.32)),0,180,fill='#6d8b70',width=max(2,int(w*.003)))
    cx,cy=(int(w*.33),int(h*.72)) if title else (int(w*.29),int(h*.40))
    for angle in range(0,360,45):
        import math
        x1=cx+int(w*.055*math.cos(math.radians(angle))); y1=cy+int(w*.055*math.sin(math.radians(angle)))
        x2=cx+int(w*.13*math.cos(math.radians(angle))); y2=cy+int(w*.13*math.sin(math.radians(angle)))
        d.line((x1,y1,x2,y2),fill=CLAY,width=max(4,int(w*.012)))
    d.ellipse((cx-int(w*.035),cy-int(w*.035),cx+int(w*.035),cy+int(w*.035)),fill=CLAY)
    if title:
        d.text((int(w*.08),int(h*.13)),'SHORE &',font=font(int(w*.09),True),fill=GREEN)
        d.text((int(w*.08),int(h*.13)+int(w*.105)),'SEASON',font=font(int(w*.09),True),fill=GREEN)
        d.text((int(w*.08),int(h*.52)),'NATIVE FOODWAYS  ·  PLACE  ·  FOOD',font=font(int(w*.018)),fill=GREEN)
    return im

art((1024,1024)).save(OUT/'icon.png')
art((200,200)).save(OUT/'splash.png')
art((1200,800),True).save(OUT/'embed.png')
art((1200,630),True).save(OUT/'hero.png')
