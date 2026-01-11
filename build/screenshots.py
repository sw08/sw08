import os
import shutil
from PIL import Image

os.chdir("./screenshots")
if not os.path.isdir("1080p"):
    os.mkdir("1080p")  # high
if not os.path.isdir("360p"):
    os.mkdir("360p")  # low
for i in os.listdir():
    if (not os.path.isfile(f"1080p/{i}")) and os.path.isfile(i):
        img = Image.open(i)
        img.resize((640, 360)).save(f"360p/{i}")
        shutil.copy(i, f"1080p/{i}")