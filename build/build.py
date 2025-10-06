import os, shutil
from distutils.dir_util import copy_tree as copytree

if os.path.isdir("./source"):
    shutil.rmtree("./source")
os.mkdir("./source")
for i in os.listdir("."):
    if i.endswith(".html"):
        shutil.copy(i, f"source/{i}")
    elif i in ["resource", "screenshots", "database", "style", "script"]:
        copytree(i, f"source/{i}")
