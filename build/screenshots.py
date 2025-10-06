import os
import shutil
from PIL import Image

os.chdir("./screenshots")
if not os.path.isdir("1080p"):
    os.mkdir("1080p")  # desktop high
if not os.path.isdir("720p"):
    os.mkdir("720p")  # mobile high / desktop middle
if not os.path.isdir("360p"):
    os.mkdir("360p")  # mobile middle / desktop low
if not os.path.isdir("144p"):
    os.mkdir("144p")  # mobile small
for i in os.listdir():
    if (not os.path.isfile(f"1080p/{i}")) and os.path.isfile(i):
        img = Image.open(i)
        img.resize((1280, 720)).save(f"720p/{i}")
        img.resize((640, 360)).save(f"360p/{i}")
        img.resize((256, 144)).save(f"144p/{i}")
        shutil.copy(i, f"1080p/{i}")
