#!/usr/bin/env python3
"""
import_tufs.py — Import TUFS vocabulary data into Supabase.

Supported source files (auto-detected by extension):
  tufs-vocab.tsv  — 10-column TSV produced by scripts/munge.py in the TUFS pipeline
                    Columns: cid  lang  wid  lemma  comment  iids  examples
                             is_basic  scenes  bunrui
  tufs.db         — Cygnet/wn SQLite built by the full TUFS pipeline

Download the TSV (smallest, fastest):
    wget https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv

Download the compiled SQLite:
    wget https://omwn.org/tufs/data/tufs.db.gz && gunzip tufs.db.gz

Usage:
    python import_tufs.py \\
        --url  https://YOUR_PROJECT.supabase.co \\
        --key  YOUR_SERVICE_ROLE_KEY \\
        --source ./tufs-vocab.tsv \\
        [--langs ja,en,ko,fr,es,de,it,pt,ar,zh] \\
        [--batch 100] \\
        [--dry-run]

Requirements:
    pip install supabase
"""

import argparse
import csv
import gzip
import os
import re
import shutil
import sqlite3
import sys
import uuid
from pathlib import Path
from typing import Iterator

# ---------------------------------------------------------------------------
# Language code normalisation
# TUFS uses full BCP-47 tags or its own abbreviations; map them to ISO 639-1.
# ---------------------------------------------------------------------------
LANG_NORM: dict[str, str] = {
    # Japanese
    "jpn": "ja", "ja": "ja", "ja-Hira": "ja", "ja-Kana": "ja",
    # English
    "eng": "en", "en": "en",
    # Korean
    "kor": "ko", "ko": "ko",
    # French
    "fra": "fr", "fre": "fr", "fr": "fr",
    # Spanish
    "spa": "es", "es": "es",
    # German
    "deu": "de", "ger": "de", "de": "de",
    # Italian
    "ita": "it", "it": "it",
    # Portuguese
    "por": "pt", "pt": "pt",
    # Arabic
    "ara": "ar", "ar": "ar",
    # Chinese (Mandarin / classical)
    "cmn": "zh", "zho": "zh", "zh": "zh", "zh-Hans": "zh", "zh-Hant": "zh",
    # Indonesian
    "ind": "id", "id": "id",
    # Thai
    "tha": "th", "th": "th",
    # Vietnamese
    "vie": "vi", "vi": "vi",
    # Russian
    "rus": "ru", "ru": "ru",
    # Mongolian
    "mon": "mn", "mn": "mn",
    # Turkish
    "tur": "tr", "tr": "tr",
    # Persian
    "fas": "fa", "per": "fa", "fa": "fa",
    # Hindi
    "hin": "hi", "hi": "hi",
    # Malay
    "msa": "ms", "may": "ms", "ms": "ms",
    # Tagalog
    "tgl": "tl", "tl": "tl",
    # Khmer
    "khm": "km", "km": "km",
    # Urdu
    "urd": "ur", "ur": "ur",
    # Burmese
    "mya": "my", "my": "my",
}

# Part-of-speech codes (WN tags → readable)
POS_MAP: dict[str, str] = {
    "n": "noun", "v": "verb", "a": "adjective",
    "s": "adjective", "r": "adverb", "x": "other",
}

# Heuristic level assignment based on TUFS bunrui (semantic category code)
# bunrui is a numeric prefix; lower ≈ more basic.
def _bunrui_to_level(bunrui: str) -> int:
    try:
        n = int(str(bunrui).split(".")[0])
        if n <= 2:
            return 1
        if n <= 6:
            return 2
        return 3
    except (ValueError, TypeError):
        return 1


def normalise_lang(raw: str) -> str | None:
    """Return ISO 639-1 code or None if not mappable."""
    raw = raw.strip()
    return LANG_NORM.get(raw) or LANG_NORM.get(raw.split("-")[0].lower())


# ---------------------------------------------------------------------------
# Reading from tufs-vocab.tsv
# ---------------------------------------------------------------------------

def _parse_examples_tsv(raw: str) -> str:
    """Extract first example sentence from the pipe/semicolon-separated field."""
    if not raw or raw.strip() in ("", "NULL", "\\N"):
        return ""
    # Format: sentence1|translation1;sentence2|translation2;...
    first = re.split(r"[;；]", raw)[0]
    # Keep both sides joined with " / "
    parts = re.split(r"[|｜]", first)
    return " / ".join(p.strip() for p in parts if p.strip())[:500]


def _parse_reading_tsv(comment: str) -> str:
    """
    The 'comment' field sometimes contains reading hints in parentheses,
    or morph:tag style annotations like (morph:ja-Hira ひらがな).
    """
    if not comment:
        return ""
    m = re.search(r"\(morph:[^\s)]+\s+([^)]+)\)", comment)
    if m:
        return m.group(1).strip()
    m = re.search(r"【読み】([^\s【】]+)", comment)
    if m:
        return m.group(1).strip()
    return ""


def _parse_meaning_tsv(comment: str) -> str:
    """Extract 【意味】 definition from the comment field."""
    if not comment:
        return ""
    m = re.search(r"【意味】(.+?)(?:【|$)", comment, re.DOTALL)
    if m:
        return m.group(1).strip()[:500]
    return ""


def read_tsv(path: Path, allowed_langs: set[str] | None) -> Iterator[dict]:
    """
    Yield vocabulary dicts from tufs-vocab.tsv.
    Columns: cid  lang  wid  lemma  comment  iids  examples  is_basic  scenes  bunrui
    """
    with open(path, encoding="utf-8", newline="") as f:
        reader = csv.reader(f, delimiter="\t")
        header = None
        for row in reader:
            # Skip blank / comment lines
            if not row or row[0].startswith("#"):
                continue
            # First non-comment row is the header
            if header is None:
                header = [h.lower().strip() for h in row]
                # Validate expected columns
                required = {"lang", "lemma"}
                if not required.issubset(set(header)):
                    # Try positional fallback: cid lang wid lemma ...
                    header = ["cid", "lang", "wid", "lemma", "comment",
                              "iids", "examples", "is_basic", "scenes", "bunrui"]
                continue

            # Pad short rows
            row = row + [""] * (len(header) - len(row))
            rec = dict(zip(header, row))

            lang_raw = rec.get("lang", "")
            lang = normalise_lang(lang_raw)
            if lang is None:
                continue
            if allowed_langs and lang not in allowed_langs:
                continue

            lemma = rec.get("lemma", "").strip()
            if not lemma:
                continue

            comment  = rec.get("comment", "")
            examples = rec.get("examples", "")
            bunrui   = rec.get("bunrui", "")

            # Detect part-of-speech from wid or comment
            wid = rec.get("wid", "")
            pos = "noun"
            m = re.search(r"\b([nvars])\b", wid)
            if m:
                pos = POS_MAP.get(m.group(1), "noun")

            yield {
                "id":               str(uuid.uuid4()),
                "lang_code":        lang,
                "word":             lemma,
                "meaning":          _parse_meaning_tsv(comment),
                "reading":          _parse_reading_tsv(comment),
                "part_of_speech":   pos,
                "level":            _bunrui_to_level(bunrui),
                "example_sentence": _parse_examples_tsv(examples),
            }


# ---------------------------------------------------------------------------
# Reading from tufs.db (Cygnet/wn SQLite format)
# ---------------------------------------------------------------------------
# Cygnet schema (wn library):
#   lexicon(id, language, ...)
#   entry(id, lexicon_id, name, pos)
#   form(entry_id, written_form, script, tag)          ← pronunciation / alt forms
#   sense(id, entry_id, synset_id, ...)
#   synset(id, lexicon_id, pos, ili, ...)
#   definition(synset_id, lang_id, text)
#   example(id, synset_id, lang_id, text, ...)
# ---------------------------------------------------------------------------

_CYGNET_ENTRY_QUERY = """
SELECT
    e.id        AS entry_id,
    e.name      AS lemma,
    e.pos       AS pos,
    lx.language AS lang,
    lx.id       AS lex_id
FROM entry e
JOIN lexicon lx ON lx.id = e.lexicon_id
"""

_CYGNET_FORM_QUERY = """
SELECT entry_id, written_form, script, tag
FROM form
WHERE entry_id = ?
"""

_CYGNET_SENSE_QUERY = """
SELECT sense.synset_id
FROM sense
WHERE sense.entry_id = ?
LIMIT 1
"""

_CYGNET_DEF_QUERY = """
SELECT text FROM definition
WHERE synset_id = ?
ORDER BY rowid
LIMIT 1
"""

_CYGNET_EXAMPLE_QUERY = """
SELECT text FROM example
WHERE synset_id = ?
ORDER BY rowid
LIMIT 1
"""


def read_sqlite(path: Path, allowed_langs: set[str] | None) -> Iterator[dict]:
    """Yield vocabulary dicts from Cygnet tufs.db SQLite."""
    con = sqlite3.connect(str(path))
    con.row_factory = sqlite3.Row

    # Introspect available tables
    tables = {r[0] for r in con.execute(
        "SELECT name FROM sqlite_master WHERE type='table'").fetchall()}

    # --- Cygnet / wn format ---
    if "entry" in tables and "lexicon" in tables:
        yield from _read_cygnet(con, allowed_langs)

    # --- Legacy flat TUFS format (single table per language or flat vocab table) ---
    elif "vocab" in tables or "word" in tables:
        yield from _read_flat(con, allowed_langs)

    else:
        # Unknown schema — dump all tables for diagnosis
        print("Unknown DB schema. Tables found:", tables, file=sys.stderr)
        print("Try using tufs-vocab.tsv instead (see --source).", file=sys.stderr)

    con.close()


def _read_cygnet(con: sqlite3.Connection, allowed_langs: set[str] | None) -> Iterator[dict]:
    rows = con.execute(_CYGNET_ENTRY_QUERY).fetchall()

    for row in rows:
        lang = normalise_lang(row["lang"] or "")
        if lang is None:
            continue
        if allowed_langs and lang not in allowed_langs:
            continue

        lemma = (row["lemma"] or "").strip()
        if not lemma:
            continue

        pos = POS_MAP.get(row["pos"] or "", "noun")

        # Reading / pronunciation (first alternate form with script hint)
        reading = ""
        forms = con.execute(_CYGNET_FORM_QUERY, (row["entry_id"],)).fetchall()
        for f in forms:
            if f["written_form"] and f["written_form"] != lemma:
                reading = f["written_form"]
                break

        # Synset for definitions + examples
        sense_row = con.execute(_CYGNET_SENSE_QUERY, (row["entry_id"],)).fetchone()
        meaning = ""
        example = ""
        if sense_row:
            sid = sense_row[0]
            def_row = con.execute(_CYGNET_DEF_QUERY, (sid,)).fetchone()
            if def_row:
                meaning = (def_row[0] or "").strip()[:500]
            ex_row = con.execute(_CYGNET_EXAMPLE_QUERY, (sid,)).fetchone()
            if ex_row:
                example = (ex_row[0] or "").strip()[:500]

        yield {
            "id":               str(uuid.uuid4()),
            "lang_code":        lang,
            "word":             lemma,
            "meaning":          meaning,
            "reading":          reading,
            "part_of_speech":   pos,
            "level":            1,
            "example_sentence": example,
        }


def _read_flat(con: sqlite3.Connection, allowed_langs: set[str] | None) -> Iterator[dict]:
    """Fallback for simple flat-table schemas."""
    table = "vocab" if "vocab" in {
        r[0] for r in con.execute(
            "SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    } else "word"

    cols = {r[1] for r in con.execute(f"PRAGMA table_info({table})").fetchall()}

    lang_col  = next((c for c in ("lang", "language", "lang_code") if c in cols), None)
    word_col  = next((c for c in ("lemma", "word", "form") if c in cols), None)
    def_col   = next((c for c in ("definition", "meaning", "def", "gloss") if c in cols), None)
    read_col  = next((c for c in ("reading", "pronunciation", "pron") if c in cols), None)
    pos_col   = next((c for c in ("pos", "part_of_speech", "type") if c in cols), None)
    ex_col    = next((c for c in ("example", "examples", "sentence") if c in cols), None)

    if not word_col:
        print(f"Cannot find word column in table '{table}'. Columns: {cols}", file=sys.stderr)
        return

    for row in con.execute(f"SELECT * FROM {table}"):
        row = dict(row)
        lang_raw = row.get(lang_col, "") if lang_col else ""
        lang = normalise_lang(str(lang_raw)) if lang_raw else None
        if lang is None:
            continue
        if allowed_langs and lang not in allowed_langs:
            continue

        lemma = str(row.get(word_col, "") or "").strip()
        if not lemma:
            continue

        yield {
            "id":               str(uuid.uuid4()),
            "lang_code":        lang,
            "word":             lemma,
            "meaning":          str(row.get(def_col, "") or "")[:500] if def_col else "",
            "reading":          str(row.get(read_col, "") or "") if read_col else "",
            "part_of_speech":   str(row.get(pos_col, "") or "noun") if pos_col else "noun",
            "level":            1,
            "example_sentence": str(row.get(ex_col, "") or "")[:500] if ex_col else "",
        }


# ---------------------------------------------------------------------------
# Supabase upsert
# ---------------------------------------------------------------------------

def upsert_batch(client, records: list[dict], dry_run: bool) -> int:
    if not records:
        return 0
    if dry_run:
        for r in records:
            print(f"  DRY  {r['lang_code']:5s} {r['word'][:40]:<40s} | {r['meaning'][:50]}")
        return len(records)

    resp = (
        client.table("vocabulary_items")
        .upsert(records, on_conflict="lang_code,word")
        .execute()
    )
    # supabase-py v2 raises on error; v1 returns resp.error
    if hasattr(resp, "error") and resp.error:
        print(f"  ERROR upsert: {resp.error}", file=sys.stderr)
        return 0
    return len(records)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import TUFS vocabulary into Supabase vocabulary_items table."
    )
    parser.add_argument("--url",    required=True,
                        help="Supabase project URL, e.g. https://abc.supabase.co")
    parser.add_argument("--key",    required=True,
                        help="Supabase anon or service-role key")
    parser.add_argument("--source", default="tufs-vocab.tsv",
                        help="Path to tufs-vocab.tsv OR tufs.db[.gz] (default: tufs-vocab.tsv)")
    parser.add_argument("--langs",  default=None,
                        help="Comma-separated ISO-639-1 codes to import, e.g. ja,en,ko "
                             "(default: all languages in the file)")
    parser.add_argument("--batch",  type=int, default=100,
                        help="Rows per upsert batch (default: 100)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print rows without writing to Supabase")
    args = parser.parse_args()

    # Allowed languages filter
    allowed: set[str] | None = None
    if args.langs:
        allowed = {c.strip().lower() for c in args.langs.split(",")}
        print(f"Filtering to languages: {sorted(allowed)}")

    # Resolve source file — handle .gz on-the-fly
    src = Path(args.source)
    if not src.exists():
        print(f"ERROR: source file not found: {src}", file=sys.stderr)
        sys.exit(1)

    actual_src = src
    tmp_file: Path | None = None

    if src.suffix == ".gz":
        print(f"Decompressing {src} …")
        tmp_file = src.with_suffix("")       # strip .gz
        with gzip.open(src, "rb") as gz_in, open(tmp_file, "wb") as out:
            shutil.copyfileobj(gz_in, out)
        actual_src = tmp_file
        print(f"  → {tmp_file}")

    # Choose reader
    suffix = actual_src.suffix.lower()
    if suffix in (".tsv", ".txt", ".csv"):
        print(f"Reading TSV: {actual_src}")
        records_iter = read_tsv(actual_src, allowed)
    elif suffix in (".db", ".sqlite", ".sqlite3"):
        print(f"Reading SQLite: {actual_src}")
        records_iter = read_sqlite(actual_src, allowed)
    else:
        print(f"ERROR: unknown file type '{suffix}'. Use .tsv or .db", file=sys.stderr)
        sys.exit(1)

    # Initialise Supabase client (supports both supabase-py v1 and v2)
    try:
        from supabase import create_client        # type: ignore
        client = create_client(args.url, args.key)
    except ImportError:
        print("ERROR: supabase package not installed.\n"
              "Run: pip install supabase", file=sys.stderr)
        sys.exit(1)

    # Stream records in batches
    batch:   list[dict] = []
    total    = 0
    skipped  = 0
    by_lang: dict[str, int] = {}

    print("Starting import…\n")
    for rec in records_iter:
        # Skip records with no meaningful content
        if not rec["word"]:
            skipped += 1
            continue

        batch.append(rec)
        by_lang[rec["lang_code"]] = by_lang.get(rec["lang_code"], 0) + 1

        if len(batch) >= args.batch:
            n = upsert_batch(client, batch, args.dry_run)
            total += n
            if not args.dry_run:
                print(f"  Upserted {total:,} rows so far…", end="\r", flush=True)
            batch = []

    # Flush remainder
    if batch:
        n = upsert_batch(client, batch, args.dry_run)
        total += n

    # Cleanup temp decompressed file
    if tmp_file and tmp_file.exists():
        tmp_file.unlink()

    # Summary
    print(f"\n{'DRY-RUN ' if args.dry_run else ''}Import complete.")
    print(f"  Total rows upserted : {total:,}")
    print(f"  Skipped (blank word) : {skipped:,}")
    print(f"\n  Rows per language:")
    for lang, count in sorted(by_lang.items()):
        print(f"    {lang:5s}  {count:,}")


if __name__ == "__main__":
    main()
