from collections import defaultdict
import os, json, shutil

os.chdir("./screenshots")

files = [i for i in os.listdir() if os.path.isfile(i)]

by_date, by_acft, by_lvry, by_arpt, tags = (
    defaultdict(lambda: defaultdict(lambda: defaultdict(list))),
    defaultdict(list),
    defaultdict(list),
    defaultdict(list),
    defaultdict(list),
)

for i in files:
    filename = i
    i = i.split("_")
    if len(i) == 3:
        by_arpt[i[0]].append(filename)
    else:
        by_lvry[i[0]].append(filename)
        by_acft[i[1]].append(filename)
    date = i[-2]
    year = date[:4]
    month = date[4:6]
    day = date[6:8]
    by_date[year][month][day].append(filename)

if os.path.isdir("../database"):
    shutil.rmtree("../database")
os.mkdir("../database")
os.chdir("../database")

tags = {
    "by_acft": list(by_acft.keys()),
    "by_lvry": list(by_lvry.keys()),
    "by_arpt": list(by_arpt.keys()),
}

with open("by_date.json", "w") as f:
    json.dump(by_date, f)

with open("by_acft.json", "w") as f:
    json.dump(by_acft, f)
with open("by_lvry.json", "w") as f:
    json.dump(by_lvry, f)
with open("by_arpt.json", "w") as f:
    json.dump(by_arpt, f)

with open("tags.json", "w") as f:
    json.dump(tags, f)
