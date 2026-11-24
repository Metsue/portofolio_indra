import json
from pathlib import Path
from PIL import Image
root=Path('.qa/certificate-review')
dest=Path('public/assets/certificates'); dest.mkdir(parents=True,exist_ok=True)
names={'01-0':'konservasi-alam','03-0':'pemira','05-0':'pustakawan-digital','05-1':'pustakawan-digital-materi','06-0':'pueblo-science','07-0':'bincang-rupawan','08-0':'bnsp-network-administrator','09-0':'praktik-industri-sgi','11-0':'praktik-industri-smk'}
results=[]
for source,name in names.items():
    im=Image.open(root/f'{source}.png').convert('RGB')
    im.thumbnail((2200,3200))
    out=dest/f'{name}.webp'; im.save(out,'WEBP',quality=87,method=6)
    thumb=im.copy();thumb.thumbnail((800,1000));thumb.save(dest/f'{name}-thumb.webp','WEBP',quality=80,method=6)
    results.append({'file':out.name,'bytes':out.stat().st_size,'dimensions':im.size})
print(json.dumps(results))
