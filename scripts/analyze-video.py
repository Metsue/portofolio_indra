import cv2
from PIL import Image, ImageDraw
capture = cv2.VideoCapture(r'D:\Downloads\WhatsApp Video 2026-11-23 at 00.30.44.mp4')
fps = capture.get(cv2.CAP_PROP_FPS)
print('FPS, seconds, width, height:', fps, capture.get(cv2.CAP_PROP_FRAME_COUNT)/fps, capture.get(3), capture.get(4))
times = [1,4,6,8,10,12,14,18,20,24,28,30,34,38,40,46,50,54]
sheet = Image.new('RGB', (1200,1500), (9,6,17))
draw = ImageDraw.Draw(sheet)
for i,t in enumerate(times):
    capture.set(cv2.CAP_PROP_POS_MSEC,t*1000)
    ok,frame = capture.read()
    if ok:
        im = Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB))
        im.thumbnail((395,220))
        sheet.paste(im,((i%3)*400,(i//3)*250))
        draw.text(((i%3)*400+8,(i//3)*250+225),str(t)+' sec',fill='white')
sheet.save('.qa/video-analysis.jpg')
capture.release()
