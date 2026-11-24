from pathlib import Path
import zipfile, fitz, json
from PIL import Image, ImageDraw

root = Path('.qa/certificate-review').resolve()
root.mkdir(parents=True, exist_ok=True)
records = []
with zipfile.ZipFile(r'D:\Downloads\sertifikat.zip') as archive:
    for i, info in enumerate(archive.infolist()):
        if info.is_dir() or 'vaksin' in info.filename.lower():
            continue
        target = root / Path(info.filename).name
        target.write_bytes(archive.read(info))
        if target.suffix.lower() == '.pdf':
            doc = fitz.open(target)
            for page_no, page in enumerate(doc):
                output = root / f'{i:02d}-{page_no}.png'
                page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(output)
                records.append({'id':f'{i:02d}-{page_no}', 'original':target.name,'image':str(output),'text':page.get_text()})
        else:
            output = root / f'{i:02d}-0.png'
            Image.open(target).convert('RGB').save(output)
            records.append({'id':f'{i:02d}-0','original':target.name,'image':str(output),'text':''})
sheet = Image.new('RGB',(1500,((len(records)+2)//3)*390),'#181124')
draw = ImageDraw.Draw(sheet)
for i, record in enumerate(records):
    im = Image.open(record['image']); im.thumbnail((480,340))
    x=(i%3)*500;y=(i//3)*390
    sheet.paste(im,(x,y));draw.text((x+5,y+345),record['id']+' '+record['original'][:48],fill='white')
sheet.save(root/'contact-sheet.jpg')
(root/'inventory.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps([{'id':r['id'],'original':r['original'],'text':r['text']} for r in records],ensure_ascii=False))
