import os
from PIL import Image

os.chdir("./screenshots")
if not os.path.isdir("1080p"):
    os.mkdir("1080p")  # high
if not os.path.isdir("360p"):
    os.mkdir("360p")  # low
if not os.path.isdir("720p"):
    os.mkdir("720p")  # low
for i in os.listdir():
    if os.path.isdir(i): continue
    cached = 0
    for j, k in enumerate(('360p', '720p', '1080p')):
        cached += (2 ** j) * os.path.isfile(f'{k}/{i[:-4]}.webp')
    if cached != 7:
        img = Image.open(i)
        if not (cached & 0b001): img.resize((640, 360)).save(f"360p/{i[:-4]}.webp")
        if not (cached & 0b010): img.resize((1280, 720)).save(f"720p/{i[:-4]}.webp")
        if not (cached & 0b100): img.save(f"1080p/{i[:-4]}.webp")

for i in os.listdir('360p'):
    if not os.path.isfile(i[:-5] + '.png'):
        os.remove(f'360p/{i}')
for i in os.listdir('720p'):
    if not os.path.isfile(i[:-5] + '.png'):
        os.remove(f'720p/{i}')
for i in os.listdir('1080p'):
    if not os.path.isfile(i[:-5] + '.png'):
        os.remove(f'1080p/{i}')