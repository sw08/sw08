import os
from PIL import Image

os.chdir("./source/screenshots")
os.mkdir("1080p")  # desktop high
os.mkdir("720p")  # mobile high / desktop middle
os.mkdir("360p")  # mobile middle / desktop low
os.mkdir("144p")  # mobile small
for i in os.listdir():
    if os.path.isfile(i):
        img = Image.open(i)
        img.resize((1280, 720)).save(f"720p/{i}")
        img.resize((640, 360)).save(f"360p/{i}")
        img.resize((256, 144)).save(f"144p/{i}")
        os.rename(i, f"1080p/{i}")
