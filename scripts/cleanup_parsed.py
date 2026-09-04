# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "_parsed_questions.json"
qs = json.loads(p.read_text(encoding="utf-8"))

for q in qs:
    ctx = q["context"] or ""
    ctx = re.sub(
        r"(?i)^Картинка\s*[—\-–]?\s*.*?(?=[А-ЯA-Z«\"])",
        "",
        ctx,
    ).strip()
    ctx = re.sub(r"(?i)^На картинку.*?(?=[А-ЯA-Z«\"])", "", ctx).strip()
    ctx = re.sub(r"(?i)^Фото Моны Лизы\s*", "", ctx).strip()
    ctx = re.sub(
        r"(?i)^можно просто что-то универсальное в духе наград и лого Герофарм\s*",
        "",
        ctx,
    ).strip()
    if q["prompt"] and q["prompt"] in ctx:
        ctx = ctx.replace(q["prompt"], "").strip()
    q["context"] = ctx

p.write_text(json.dumps(qs, ensure_ascii=False, indent=2), encoding="utf-8")

lines = []
for n in [2, 28, 31, 56, 57, 60, 61]:
    q = next(x for x in qs if x["n"] == n)
    lines.append(
        f"{n}|prompt={q['prompt']}|ctx={q['context'][:80]}|ans={q['options'][q['correct_index']]}"
    )
Path(__file__).resolve().parents[1].joinpath("_debug_qs.txt").write_text(
    "\n".join(lines), encoding="utf-8"
)
print("cleaned", len(qs))
