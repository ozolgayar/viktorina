# -*- coding: utf-8 -*-
"""Build questions-bank.ts and copy question images into public/questions."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
JSON_PATH = BASE / "_parsed_questions.json"
OUT_TS = BASE / "src" / "lib" / "questions-bank.ts"
PUBLIC_Q = BASE / "public" / "questions"
IMG_SRC_ROOT = BASE / "img" / "questions_2"


def find_img_dir() -> Path:
    if not IMG_SRC_ROOT.exists():
        raise FileNotFoundError(IMG_SRC_ROOT)
    # images live in a nested folder (Cyrillic name)
    subs = [p for p in IMG_SRC_ROOT.iterdir() if p.is_dir()]
    if subs:
        return subs[0]
    return IMG_SRC_ROOT


def make_id(n: int) -> str:
    return f"11111111-1111-4111-8111-1111111111{n:02d}"


def ts_string(s: str) -> str:
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    # Prefer regular quotes with JSON escaping for safety
    return json.dumps(s, ensure_ascii=False)


def copy_images(img_dir: Path) -> dict[int, str]:
    PUBLIC_Q.mkdir(parents=True, exist_ok=True)
    # Clear old question images
    for old in PUBLIC_Q.glob("*"):
        if old.is_file():
            old.unlink()

    mapping: dict[int, str] = {}
    files = list(img_dir.iterdir())
    by_num: dict[int, list[Path]] = {}
    for f in files:
        if not f.is_file():
            continue
        m = re.match(r"^(\d+)(?:_(\d+))?(\.[a-zA-Z0-9]+)$", f.name)
        if not m:
            continue
        n = int(m.group(1))
        by_num.setdefault(n, []).append(f)

    for n in range(1, 62):
        cands = by_num.get(n, [])
        if not cands:
            print(f"WARNING: no image for question {n}")
            continue
        # Prefer plain N.ext over N_2.ext; prefer png
        def score(p: Path) -> tuple:
            m = re.match(r"^(\d+)(?:_(\d+))?(\.[a-zA-Z0-9]+)$", p.name)
            suffix = m.group(2) if m else None
            ext = p.suffix.lower()
            return (0 if suffix is None else 1, 0 if ext == ".png" else 1, p.name)

        src = sorted(cands, key=score)[0]
        ext = src.suffix.lower()
        dest_name = f"{n}{ext}"
        dest = PUBLIC_Q / dest_name
        shutil.copy2(src, dest)
        mapping[n] = f"/questions/{dest_name}"
        print(f"img {n}: {src.name} -> {dest_name}")

    return mapping


def build_ts(questions: list[dict], images: dict[int, str]) -> str:
    blocks = []
    for q in questions:
        n = q["n"]
        image = images.get(n, f"/questions/{n}.png")
        opts = ",\n".join(f"      {ts_string(o)}" for o in q["options"])
        block = f"""  {{
    id: {ts_string(make_id(n))},
    context:
      {ts_string(q["context"])},
    prompt: {ts_string(q["prompt"])},
    options: [
{opts},
    ],
    correct_index: {q["correct_index"]},
    image: {ts_string(image)},
  }}"""
        blocks.append(block)

    body = ",\n".join(blocks)
    return f"""/** Банк вопросов викторины (из Вопросы.docx, 61 вопрос; в сессии — случайные 10) */

export interface BankQuestion {{
  id: string;
  /** Вводный текст над картинкой */
  context: string;
  /** Короткий вопрос в блоке ответов */
  prompt: string;
  options: string[];
  correct_index: number;
  image: string;
}}

function capitalizeOption(raw: string): string {{
  const text = raw.replace(/^[-–—]\\s*/, "").trim();
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
}}

const RAW_QUESTIONS: BankQuestion[] = [
{body},
];

export const QUESTIONS_BANK: BankQuestion[] = RAW_QUESTIONS.map((q) => ({{
  ...q,
  options: q.options.map(capitalizeOption),
}}));

export function getBankQuestionById(id: string): BankQuestion | undefined {{
  return QUESTIONS_BANK.find((q) => q.id === id);
}}

/** Публичный lookup картинки без отдачи correct_index в API */
export function getQuestionImageById(id: string): string | undefined {{
  return QUESTIONS_BANK.find((q) => q.id === id)?.image;
}}
"""


def write_answers(questions: list[dict]) -> None:
    lines = [
        "ВЕРНЫЕ ОТВЕТЫ — ВИКТОРИНА ГЕРОФАРМ",
        f"({len(questions)} вопросов в банке; в каждой сессии участнику случайно выдаётся 10)",
        "",
        "─" * 60,
        "",
    ]
    for q in questions:
        ans = q["options"][q["correct_index"]] if q["correct_index"] is not None else "?"
        lines.append(f"ВОПРОС {q['n']}")
        lines.append(f"Вопрос: {q['prompt']}")
        lines.append(f"ВЕРНЫЙ ОТВЕТ: {ans}")
        lines.append("")
        lines.append("─" * 60)
        lines.append("")
    (BASE / "correct-answers.txt").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    questions = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    assert len(questions) == 61, len(questions)
    for q in questions:
        assert q["opt_count"] == 4 and q["correct_index"] is not None and q["prompt"]

    img_dir = find_img_dir()
    print("img_dir", img_dir)
    images = copy_images(img_dir)
    assert len(images) == 61, f"images={len(images)}"

    OUT_TS.write_text(build_ts(questions, images), encoding="utf-8")
    write_answers(questions)
    print("wrote", OUT_TS)
    print("bank size", len(questions))


if __name__ == "__main__":
    main()
