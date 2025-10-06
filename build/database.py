from collections import defaultdict
import os, json, shutil

os.chdir("./screenshots")

files = [i for i in os.listdir() if os.path.isfile(i)]

by_year, by_month, by_day, by_acft, by_lvry, by_arpt, tags = (
    defaultdict(list),
    defaultdict(list),
    defaultdict(list),
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
    by_year[year].append(filename)
    by_month[month].append(filename)
    by_day[day].append(filename)

if os.path.isdir("../database"):
    shutil.rmtree("../database")
os.mkdir("../database")
os.chdir("../database")

tags = {
    "by_year": list(by_year.keys()),
    "by_month": list(by_month.keys()),
    "by_day": list(by_day.keys()),
    "by_acft": list(by_acft.keys()),
    "by_lvry": list(by_lvry.keys()),
    "by_arpt": list(by_arpt.keys()),
}

with open("by_year.json", "w") as f:
    json.dump(by_year, f)
with open("by_month.json", "w") as f:
    json.dump(by_month, f)
with open("by_day.json", "w") as f:
    json.dump(by_day, f)

with open("by_acft.json", "w") as f:
    json.dump(by_acft, f)
with open("by_lvry.json", "w") as f:
    json.dump(by_lvry, f)
with open("by_arpt.json", "w") as f:
    json.dump(by_arpt, f)

with open("tags.json", "w") as f:
    json.dump(tags, f)
