# -*- coding: utf-8 -*-
from pathlib import Path
import re
ts = Path(r"C:\Users\Пользователь\Desktop\Cursor\viktorina 2.0\src\lib\questions-bank.ts").read_text(encoding="utf-8")
ids = re.findall(r'id: "([^"]+)"', ts)
images = re.findall(r'image: "([^"]+)"', ts)
corrects = re.findall(r"correct_index: (\d+)", ts)
print("ids", len(ids), "unique", len(set(ids)))
print("images", len(images), "unique", len(set(images)))
print("corrects", len(corrects))
print("sample last", ids[-1], images[-1], corrects[-1])
# ensure public files exist
pub = Path(r"C:\Users\Пользователь\Desktop\Cursor\viktorina 2.0\public\questions")
missing = []
for img in images:
    if not (pub.parent / img.lstrip("/").replace("/", "\\") if False else pub / Path(img).name).exists():
        # path is /questions/N.ext -> public/questions/N.ext
        fp = Path(r"C:\Users\Пользователь\Desktop\Cursor\viktorina 2.0\public") / img.lstrip("/")
        if not fp.exists():
            missing.append(img)
print("missing images", missing)
