# -*- coding: utf-8 -*-
"""Parse Вопросы.docx into structured quiz bank JSON."""
from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

BASE = Path(__file__).resolve().parents[1]
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

KNOWN = {
    1: "Мурмелад",
    2: "Завод в Пушкине",
    3: "Маршрут президента",
    4: "Венесуэла",
    5: "Мона Лиза",
    6: "ALCOA+",
    7: "кишечная палочка с тельцами включения на полюсах (один из этапов синтеза инсулина)",
    8: "детское отделение поликлиники номер 7 городского округа Серпухова",
    9: "Панкрасио",
    10: "образ глиняной вазы",
}

# Fallback options for early glued questions
MANUAL_OPTIONS: dict[int, list[str]] = {
    1: ["Мурофарм", "Мурципан", "Мурмелад", "Муршмеллоу"],
    2: [
        "R&D в Стрельне",
        "Завод в Пушкине",
        "Завод в Оболенске",
        "Новая площадка на ул. Возрождения",
    ],
    3: [
        "Маршрут президента",
        "Маршрут Петра Петровича",
        "Маршрут Минпромторга",
        "Маршрут Трампа",
    ],
    4: ["Венесуэла", "Испания", "Марокко", "Португалия"],
    5: ["Мона Лиза", "Звездная ночь", "Черный квадрат", "Девушка на шаре"],
    6: ["ALCOA+", "ACLOA+", "ALCAO+", "OLCOA+"],
    7: [
        "просто отверстия в жалюзи, чтобы в столовую попадало больше солнечного света",
        "арт-объект известного художника",
        "символ спортивных достижений сотрудников завода",
        "кишечная палочка с тельцами включения на полюсах (один из этапов синтеза инсулина)",
    ],
    8: [
        "детское отделение поликлиники номер 7 городского округа Серпухова",
        "эндокринологическое отделение больницы им. Раухфуса",
        "кабинет главврача Московского областного научно-исследовательского клинического института имени М. Ф. Владимирского (МОНИКИ)",
        "вестибюль ФГБУ «НМИЦ эндокринологии им. академика И.И. Дедова» Минздрава России (ЭНЦ)",
    ],
    9: ["Поджио", "Панкрасио", "Патрицио", "Серхио"],
    10: [
        "образ женщины в хиджабе",
        "образ глиняной вазы",
        "образ волшебной лампы",
        "образ кисти художницы",
    ],
    56: ["Анна Семенович", "Ирина Слуцкая", "Наташа Королева", "Виктория Боня"],
    60: ["Пинеамин", "Ретиналамин", "Кортексин", "Ринсулин"],
}

MANUAL_PROMPTS: dict[int, str] = {
    2: "О какой площадке идёт речь?",
    31: "А знаете ли вы, с каких препаратов начинался путь ГЕРОФАРМ?",
    53: "Какие новые мощности развиваются на площадке в Оболенске?",
    56: "Кто это был?",
    57: "Кто из этих людей еще не видел нашу знаменитую Мону Лизу?",
    58: "Как называется эта стратегическая инициатива?",
    60: "О каком препарате идет речь?",
    61: "Выберите название этого марафона:",
}

PROMPT_STARTS = [
    "Как его назвали?",
    "О какой площадке идет речь?",
    "О какой площадке идёт речь?",
    "Что это за неофициальное название?",
    "Что это за страна?",
    "Что это за работа?",
    "Какой?",
    "Что означают «гантельки» на жалюзи?",
    "Что означают",
    "Где теперь живёт Поджик?",
    "Где теперь живёт",
    "Как зовут испаноговорящего Поджика?",
    "Как зовут",
    "Какой образ используется в мусульманских странах?",
    "Какой образ используется",
    "Кто стал этой звездной гостьей?",
    "Кто стал этой",
    "Как называется эта серия плакатов?",
    "Как называется эта серия",
    "Выберите, какой активности на фестивале мы еще не устраивали?",
    "Выберите, какой активности",
    "Совместно с каким изданием был создан этот тест?",
    "Совместно с каким изданием",
    "Совместно с каким университетом реализуется эта программа?",
    "Совместно с каким университетом",
    "Что это был за проект?",
    "А где они еще не были?",
    "Кстати, сколько это в километрах?",
    "А в какой из этих стран пока еще НЕ зарегистрирован Семавик?",
    "А в какой из этих стран",
    "Какое российское название у парагвайского Somero?",
    "Какое российское название",
    "Как называется эта научно-исследовательская программа по изучению проблемы ожирения, запущенная ГЕРОФАРМ?",
    "Как называется эта научно",
    "В каком формате проходит конференция?",
    "В каком формате проходит",
    "Из скольких стран были гости?",
    "Из скольких стран",
    "Как называется этот конкурс?",
    "На какой язык переведена детская книга?",
    "На какой язык переведена",
    "О какой сертификации идет речь?",
    "О какой сертификации",
    "А сможете ли вы найти лишнюю — ту, которой в «Серебряной лиге» просто не существует?",
    "А сможете ли вы найти лишнюю",
    "А знаете ли вы, какой лиги в ГЕРОФАРМ на самом деле нет?",
    "А знаете ли вы, какой лиги",
    "Какой препарат из этого списка — оригинальный?",
    "Какой препарат из этого списка",
    "А как называется этот проект?",
    "А знаете ли вы, с каких препаратов начинался путь ГЕРОФАРМ?",
    "А знаете ли вы, с каких препаратов",
    "А знаете ли вы, в каком году R&D центр официально получил статус соответствия стандартам GLP?",
    "А знаете ли вы, в каком году",
    "За что поблагодарили ГЕРОФАРМ?",
    "За что поблагодарили",
    "А знаете ли вы, о каком препарате идёт речь?",
    "А знаете ли вы, о каком препарате",
    "Как же звали этого «Героя нашего времени», на котором сотрудники Оболенска отрабатывали навыки первой помощи?",
    "Как же звали",
    "Какая же фраза-пароль стала финальным аккордом и главной ценностью вечера?",
    "Какая же фраза-пароль",
    "Что же скрывает котенок на фотографии?",
    "Что же скрывает",
    "Вспомните, какие у нас?",
    "Как назывался этот квест?",
    "Какой ценности был посвящён август?",
    "Какой ценности был посвящён",
    "Какая группа является четвёртой?",
    "Какие специалисты вошли в него дополнительно?",
    "Какие специалисты вошли",
    "Что НЕ планируется реализовать на основе результатов ОРБИТЫ?",
    "Что НЕ планируется",
    "Что обязательно отличается проект от обычной текущей работы?",
    "Что обязательно отличается",
    "Вспомните, кто в проекте отвечает за результат, формирует команду, контролирует сроки и бюджет, а также управляет рисками и изменениями?",
    "Вспомните, кто в проекте отвечает",
    "Как называется топ-менеджер, который поддерживает проект и помогает обеспечить его необходимыми ресурсами?",
    "Как называется топ-менеджер",
    "Как называется этот документ?",
    "Какие две страны стали фокусными рынками экспортного направления в 2026 году?",
    "Какие две страны стали",
    "Какую цель поставила команда для Семавика в Казахстане?",
    "Какую цель поставила",
    "Какая из этих стран входит в число новых рынков для ГЕРОФАРМ?",
    "Какая из этих стран входит",
    "С чего начинается каждый продуктовый проект в ГЕРОФАРМ?",
    "С чего начинается каждый",
    "Как часто рассчитан на применение разрабатываемый инсулин?",
    "Как часто рассчитан",
    "Какие новые мощности развиваются на площадке в Оболенске?",
    "Какие новые мощности",
    "С какой площадки переносили производство БАД?",
    "С какой площадки переносили",
    "На какой режим работы планируется вывести участок №3?",
    "На какой режим работы",
    "Кто это был?",
    "Кто из этих людей еще не видел нашу знаменитую Мону Лизу?",
    "Кто из этих людей еще не видел",
    "Как называется эта стратегическая инициатива?",
    "Как называется эта стратегическая",
    "Кто автор этого произведения?",
    "О каком препарате идет речь?",
    "Выберите название этого марафона:",
]

NOTE_RE = re.compile(
    r"^(Картинка|На картинку|Фото|Можно просто)\b",
    re.I,
)
HEADER_RE = re.compile(r"Вопрос\s*№\s*(\d+)", re.I)
HASHTAG_RE = re.compile(r"^#")


def find_docx() -> Path:
    for p in BASE.glob("*.docx"):
        if p.name.lower() != "questions.docx":
            return p
    raise FileNotFoundError("Вопросы.docx not found")


def run_bold(r) -> bool:
    rPr = r.find(W + "rPr")
    if rPr is None:
        return False
    b = rPr.find(W + "b")
    if b is None:
        b = rPr.find(W + "bCs")
    if b is None:
        return False
    val = b.get(W + "val")
    return val not in ("0", "false", "False")


def collect_bold_snippets(runs: list[dict]) -> list[str]:
    parts: list[str] = []
    cur = ""
    for r in runs:
        if r["bold"]:
            cur += r["t"]
        else:
            if cur.strip():
                parts.append(cur.strip())
            cur = ""
    if cur.strip():
        parts.append(cur.strip())
    return parts


def para_from(text: str, has_num: bool, bold_snips: list[str] | None = None) -> dict:
    bold_snips = bold_snips or []
    # Rebuild naive runs marking bold snippets
    runs: list[dict] = []
    remaining = text
    while remaining:
        hit = None
        hit_pos = None
        for bp in bold_snips:
            if not bp or bp.lower().startswith("вопрос"):
                continue
            p = remaining.find(bp)
            if p >= 0 and (hit_pos is None or p < hit_pos):
                hit, hit_pos = bp, p
        if hit is None or hit_pos is None:
            runs.append({"t": remaining, "bold": False})
            break
        if hit_pos > 0:
            runs.append({"t": remaining[:hit_pos], "bold": False})
        runs.append({"t": hit, "bold": True})
        remaining = remaining[hit_pos + len(hit) :]
    return {
        "text": text.strip(),
        "has_num": has_num,
        "runs": runs,
        "any_bold": any(r["bold"] and r["t"].strip() for r in runs),
        "bold_snips": [b for b in bold_snips if b and not b.lower().startswith("вопрос")],
    }


def resolve_header_number(raw_digits: str, expected_hint: int | None = None) -> tuple[int, str]:
    """Return (question_number, remainder_after_number) from digit prefix."""
    full = int(re.match(r"\d+", raw_digits).group(0))
    rest_after_full = raw_digits[len(str(full)) :]
    if 1 <= full <= 61:
        return full, rest_after_full
    # Glued: 424 / 2022 / 604
    if expected_hint and str(full).startswith(str(expected_hint)):
        s = str(expected_hint)
        return expected_hint, raw_digits[len(s) :]
    # Try 1 or 2 digit valid numbers
    for width in (2, 1):
        if len(str(full)) >= width:
            n = int(str(full)[:width])
            if 1 <= n <= 61:
                return n, raw_digits[width:]
    return full, rest_after_full


def iter_paragraph_runs(p) -> list[dict]:
    """Collect all w:r nodes under paragraph (including nested), with bold flags."""
    runs: list[dict] = []
    for r in p.iter(W + "r"):
        # Skip runs that belong to nested paragraphs (shouldn't happen) 
        texts = []
        for t_el in r.findall(W + "t"):
            if t_el.text:
                texts.append(t_el.text)
        if not texts:
            continue
        runs.append({"t": "".join(texts), "bold": run_bold(r)})
    return runs


def load_paras(docx: Path) -> list[dict]:
    with zipfile.ZipFile(docx) as z:
        root = ET.fromstring(z.read("word/document.xml"))

    raw_paras: list[dict] = []
    for p in root.iter(W + "p"):
        pPr = p.find(W + "pPr")
        has_num = pPr is not None and pPr.find(W + "numPr") is not None
        runs = iter_paragraph_runs(p)
        text = "".join(r["t"] for r in runs)
        if not text.strip():
            continue
        bold_snips = collect_bold_snippets(runs)
        raw_paras.append({"text": text, "has_num": has_num, "bold_snips": bold_snips, "runs": runs})

    # Flatten: split on every inline question header
    flat: list[dict] = []
    for rp in raw_paras:
        text = rp["text"]
        matches = list(HEADER_RE.finditer(text))
        if not matches:
            flat.append(para_from(text.strip(), rp["has_num"], rp["bold_snips"]))
            continue

        # Leading text before first header (belongs to previous question)
        lead = text[: matches[0].start()].strip()
        if lead:
            flat.append(para_from(lead, False, rp["bold_snips"]))

        for mi, m in enumerate(matches):
            start = m.start()
            end = matches[mi + 1].start() if mi + 1 < len(matches) else len(text)
            chunk = text[start:end].strip()
            flat.append(para_from(chunk, False, rp["bold_snips"]))

    return flat


def match_q_header(text: str, expected: int) -> str | None:
    m = re.match(r"Вопрос\s*№\s*", text, re.I)
    if not m:
        return None
    rest = text[m.end() :]
    dm = re.match(r"(\d+)", rest)
    if not dm:
        return None
    n, after = resolve_header_number(dm.group(1) + rest[len(dm.group(1)) :], expected)
    # resolve_header_number already got digits only from start — redo simply:
    fullnum = int(dm.group(1))
    s = str(expected)
    if fullnum == expected:
        return rest[len(s) :].lstrip()
    if rest.startswith(s) and fullnum > 61:
        return rest[len(s) :]
    return None


def clean_option(s: str) -> str:
    s = re.sub(r"^[-–—]\s*", "", s).strip()
    s = re.sub(r"\s+", " ", s)
    # strip trailing hashtags
    s = re.sub(r"(?:\s*#[\wа-яА-ЯёЁ_]+)+$", "", s).strip()
    return s


def split_context_prompt(body: str) -> tuple[str, str]:
    body = re.sub(r"(?:\s*#[\wа-яА-ЯёЁ_]+)+$", "", body.strip()).strip()
    # Remove image notes inside body
    body = re.sub(
        r"(?im)^(Картинка|На картинку|Фото Моны|Фото).*$",
        "",
        body,
    ).strip()
    body = re.sub(r"(?i)Картинка\s*-\s*[^\n]+", "", body).strip()
    body = re.sub(r"(?i)На картинку[^\n.]*\.?", "", body).strip()
    body = re.sub(r"(?i)Фото Моны Лизы", "", body).strip()
    body = re.sub(r"\s+", " ", body).strip()

    for ps in sorted(PROMPT_STARTS, key=len, reverse=True):
        idx = body.find(ps)
        if idx >= 0:
            return body[:idx].strip(), body[idx:].strip()

    qmark = body.rfind("?")
    if qmark >= 0:
        before = body[: qmark + 1]
        parts = re.split(r"(?<=[.!])\s+", before)
        if len(parts) >= 2:
            prompt = parts[-1].strip()
            context = body[: body.rfind(prompt)].strip()
            return context, prompt
        return "", before
    return body, ""


def extract_glued_dash_options(full_body: str) -> tuple[str, list[dict]] | None:
    """Split options only from the segment after the last '?'."""
    text = full_body.replace("–", "-").replace("—", "-")
    qmark = text.rfind("?")
    if qmark < 0:
        return None
    head = text[: qmark + 1].strip()
    tail = text[qmark + 1 :].strip()
    if not tail:
        return None
    # Options like: - A- B- C- D  or  A- B- C- D
    tail_norm = re.sub(r"^\s*-\s*", "", tail)
    parts = [clean_option(x) for x in re.split(r"\s*-\s*", tail_norm)]
    parts = [p for p in parts if p]
    if len(parts) != 4:
        return None
    if not all(2 <= len(o) < 220 for o in parts):
        return None
    return head, [{"text": o, "bold": False} for o in parts]


def find_correct(options: list[str], expected: int, bold_snips: list[str]) -> int | None:
    # Bold option paragraphs already applied via options meta — here bold_snips
    for bt in bold_snips:
        bt_c = clean_option(bt)
        if not bt_c or len(bt_c) < 2:
            continue
        if bt_c.lower().startswith("вопрос"):
            continue
        for j, o in enumerate(options):
            oc = o.casefold()
            bc = bt_c.casefold()
            if oc == bc or bc in oc or oc in bc:
                return j

    if expected in KNOWN:
        target = KNOWN[expected].casefold()
        for j, o in enumerate(options):
            if o.casefold() == target or target in o.casefold() or o.casefold() in target:
                return j
    return None


def strip_manual_options_from_body(body: str, opts: list[str]) -> str:
    text = body
    for o in opts:
        text = text.replace(o, "")
    text = re.sub(r"\s*[-–—]\s*", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_questions(paras: list[dict]) -> list[dict]:
    questions: list[dict] = []
    expected = 1
    i = 0
    while i < len(paras) and expected <= 61:
        rest = match_q_header(paras[i]["text"], expected)
        if rest is None:
            i += 1
            continue

        body_parts: list[str] = []
        options_meta: list[dict] = []
        notes: list[str] = []
        bold_snips: list[str] = list(paras[i].get("bold_snips") or [])

        if rest.strip():
            # Rest after header may still be "Картинка ..." note + body
            body_parts.append(rest.strip())

        i += 1
        while i < len(paras):
            if expected < 61 and match_q_header(paras[i]["text"], expected + 1) is not None:
                break
            # Any other question header
            if re.match(r"Вопрос\s*№\s*\d+", paras[i]["text"], re.I):
                break

            p = paras[i]
            t = p["text"]
            bold_snips.extend(p.get("bold_snips") or [])

            if NOTE_RE.match(t):
                notes.append(t)
                i += 1
                continue
            if HASHTAG_RE.match(t):
                i += 1
                continue

            if p["has_num"]:
                options_meta.append({"text": clean_option(t), "bold": p["any_bold"]})
                i += 1
                continue

            if re.match(r"^[-–—]\s*\S", t) and len(t) < 220:
                options_meta.append({"text": clean_option(t), "bold": p["any_bold"]})
                i += 1
                continue

            body_parts.append(t)
            i += 1

        full_body = "\n".join(body_parts).strip()

        # Drop leading image-instruction notes without eating the question body
        full_body = re.sub(
            r"(?i)^Картинка\s*[—\-–]?\s*[^\n.]*\.?\s*",
            "",
            full_body,
        ).strip()
        full_body = re.sub(
            r"(?i)^На картинку[^\n.А-ЯA-Z]*\.?\s*",
            "",
            full_body,
        ).strip()
        full_body = re.sub(r"(?i)^Фото Моны Лизы\s*", "", full_body).strip()
        full_body = re.sub(
            r"(?i)^4 упаковки лекарства на картинку\s*",
            "",
            full_body,
        ).strip()

        if expected in MANUAL_OPTIONS and len(options_meta) < 4:
            opts = MANUAL_OPTIONS[expected]
            full_body = strip_manual_options_from_body(full_body, opts)
            options_meta = [{"text": o, "bold": False} for o in opts]

        # Force-fix known glued option sets even if wrong options were parsed
        if expected in (56, 60) and expected in MANUAL_OPTIONS:
            opts = MANUAL_OPTIONS[expected]
            # Keep body before options / after stripping dashed tail
            glued = extract_glued_dash_options(full_body)
            if glued:
                full_body = glued[0]
            else:
                full_body = strip_manual_options_from_body(full_body, opts)
            options_meta = [{"text": o, "bold": False} for o in opts]

        if len(options_meta) < 4:
            lines = [
                ln.strip()
                for ln in full_body.split("\n")
                if ln.strip() and not HASHTAG_RE.match(ln.strip()) and not NOTE_RE.match(ln.strip())
            ]
            if len(lines) >= 5 and all(len(x.split()) <= 35 for x in lines[-4:]):
                options_meta = [{"text": clean_option(x), "bold": False} for x in lines[-4:]]
                full_body = "\n".join(lines[:-4]).strip()

        if len(options_meta) < 4:
            glued = extract_glued_dash_options(full_body)
            if glued:
                full_body, options_meta = glued

        # Apply bold flags onto options
        options = [o["text"] for o in options_meta]
        for j, o in enumerate(options_meta):
            if o.get("bold"):
                # keep
                pass

        correct_from_bold_opts = [j for j, o in enumerate(options_meta) if o.get("bold")]
        context, prompt = split_context_prompt(full_body)

        if expected in MANUAL_PROMPTS:
            want = MANUAL_PROMPTS[expected]
            if not prompt:
                # Try to locate prompt in context/full_body
                src = full_body or context
                idx = src.find(want)
                if idx < 0:
                    # fuzzy: match without trailing punct
                    key = want.rstrip("?:").strip()
                    idx = src.find(key)
                    if idx >= 0:
                        # extend to ? if present
                        end = src.find("?", idx)
                        prompt = src[idx : end + 1] if end >= 0 else want
                        context = src[:idx].strip()
                    else:
                        prompt = want
                else:
                    prompt = src[idx : idx + len(want)].strip() or want
                    context = src[:idx].strip()
            elif want.rstrip("?:") not in prompt:
                prompt = want

        if expected == 24:
            # Truncated sentence in source before prompt
            if "Как называется этот конкурс?" in full_body:
                idx = full_body.find("Как называется этот конкурс?")
                context = re.sub(
                    r"(?i)Картинка[^\n]*",
                    "",
                    full_body[:idx],
                ).strip()
                prompt = "Как называется этот конкурс?"

        if len(correct_from_bold_opts) == 1:
            correct_index = correct_from_bold_opts[0]
        else:
            correct_index = find_correct(options, expected, bold_snips)

        questions.append(
            {
                "n": expected,
                "context": context,
                "prompt": prompt,
                "options": options,
                "correct_index": correct_index,
                "notes": notes,
                "opt_count": len(options),
                "bold_snips": [b for b in bold_snips if b and not b.lower().startswith("вопрос")][:10],
            }
        )
        expected += 1

    return questions


def main() -> None:
    docx = find_docx()
    paras = load_paras(docx)
    questions = parse_questions(paras)
    print(f"docx={docx.name} paras={len(paras)} questions={len(questions)}")

    bad = 0
    for q in questions:
        issues = []
        if q["opt_count"] != 4:
            issues.append(f"opts={q['opt_count']}")
        if q["correct_index"] is None:
            issues.append("no_correct")
        if not q["prompt"]:
            issues.append("no_prompt")
        if issues:
            bad += 1
            print(
                f"Q{q['n']}: {', '.join(issues)} | prompt={q['prompt'][:80]!r} | "
                f"opts={q['options']} | bold={q['bold_snips']}"
            )

    print(f"issues_count={bad}")
    for n, ans in KNOWN.items():
        q = next((x for x in questions if x["n"] == n), None)
        if not q:
            print(f"KNOWN Q{n}: MISSING")
            continue
        if q["correct_index"] is not None and q["options"]:
            got = q["options"][q["correct_index"]]
            ok = got.casefold() == ans.casefold() or ans.casefold() in got.casefold()
            print(f"KNOWN Q{n}: ok={ok} got={got!r}")
        else:
            print(f"KNOWN Q{n}: FAIL opts={q['options']}")

    out = BASE / "_parsed_questions.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print("wrote", out)


if __name__ == "__main__":
    main()
