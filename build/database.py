from collections import defaultdict
import os, json, shutil

os.chdir("./screenshots")

files = [i for i in os.listdir() if os.path.isfile(i)]

by_acft, by_lvry, by_arpt = (
    defaultdict(list),
    defaultdict(list),
    defaultdict(list)
)

for i in files:
    filename = i
    i = i.split("_")
    if len(i) == 3:
        by_arpt[i[0]].append(filename)
    else:
        by_lvry[i[0]].append(filename)
        by_acft[i[1]].append(filename)

if os.path.isdir("../database"):
    shutil.rmtree("../database")
os.mkdir("../database")
os.chdir("../database")


with open("by_acft.json", "w") as f:
    json.dump(by_acft, f)
with open("by_lvry.json", "w") as f:
    json.dump(by_lvry, f)
with open("by_arpt.json", "w") as f:
    json.dump(by_arpt, f)

with open("all_files.json", "w") as f:
    json.dump(files, f)