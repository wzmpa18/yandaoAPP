"""
import_tufs_data.py — Download TUFS vocabulary and import into Supabase via REST API.

Downloads tufs-vocab.tsv from GitHub, parses it, and inserts into Supabase 
'vocabulary_items' table using the REST API with service_role key.

Usage:
    python import_tufs_data.py

Requirements:
    pip install requests
"""

import csv
import os
import re
import sys
import uuid
import json
import time
import requests
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────
SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

TUFS_URL = 'https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv'
TUFS_LOCAL = 'tufs-vocab.tsv'

TARGET_LANGS = {'ja', 'en', 'ko', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh'}
LANG_NAMES = {
    'ja': 'Japanese', 'en': 'English', 'ko': 'Korean',
    'fr': 'French', 'es': 'Spanish', 'de': 'German',
    'it': 'Italian', 'pt': 'Portuguese', 'ar': 'Arabic', 'zh': 'Chinese',
}

# Language code normalization (TUFS → ISO 639-1)
LANG_NORM = {
    'jpn': 'ja', 'ja': 'ja', 'ja-Hira': 'ja', 'ja-Kana': 'ja',
    'eng': 'en', 'en': 'en',
    'kor': 'ko', 'ko': 'ko',
    'fra': 'fr', 'fre': 'fr', 'fr': 'fr',
    'spa': 'es', 'es': 'es',
    'deu': 'de', 'ger': 'de', 'de': 'de',
    'ita': 'it', 'it': 'it',
    'por': 'pt', 'pt': 'pt',
    'ara': 'ar', 'ar': 'ar',
    'cmn': 'zh', 'zho': 'zh', 'zh': 'zh', 'zh-Hans': 'zh', 'zh-Hant': 'zh',
}

POS_MAP = {'n': 'noun', 'v': 'verb', 'a': 'adjective', 's': 'adjective', 'r': 'adverb', 'x': 'other'}

# ── Tag mapping ───────────────────────────────────────────────────
TAG_MAP = {
    '1': 'daily', '2': 'daily', '3': 'food', '4': 'clothing',
    '5': 'home', '6': 'family', '7': 'body', '8': 'health',
    '9': 'work', '10': 'study', '11': 'travel', '12': 'shopping',
    '13': 'weather', '14': 'nature', '15': 'emotion', '16': 'culture',
    '17': 'tech', '18': 'sports', '19': 'number', '20': 'time',
}

def normalise_lang(raw):
    raw = raw.strip()
    return LANG_NORM.get(raw) or LANG_NORM.get(raw.split('-')[0].lower())

def bunrui_to_level(bunrui):
    try:
        n = int(str(bunrui).split('.')[0])
        if n <= 2: return 'beginner'
        if n <= 6: return 'intermediate'
        return 'advanced'
    except: return 'beginner'

def bunrui_to_tag(bunrui):
    try:
        prefix = str(bunrui).split('.')[0]
        return TAG_MAP.get(prefix, 'daily')
    except: return 'daily'

def parse_examples(raw):
    if not raw or raw.strip() in ('', 'NULL', '\\N'):
        return ''
    first = re.split(r'[;；]', raw)[0]
    parts = re.split(r'[|｜]', first)
    return ' / '.join(p.strip() for p in parts if p.strip())[:500]

def parse_reading(comment):
    if not comment: return ''
    m = re.search(r'\(morph:[^\s)]+\s+([^)]+)\)', comment)
    if m: return m.group(1).strip()
    m = re.search(r'【読み】([^\s【】]+)', comment)
    if m: return m.group(1).strip()
    return ''

def parse_meaning(comment):
    if not comment: return ''
    m = re.search(r'【意味】(.+?)(?:【|$)', comment, re.DOTALL)
    if m: return m.group(1).strip()[:500]
    return ''

def download_file():
    if os.path.exists(TUFS_LOCAL):
        size = os.path.getsize(TUFS_LOCAL)
        if size > 100000:
            print(f'✅ Using cached {TUFS_LOCAL} ({size:,} bytes)')
            return True
    
    print(f'📥 Downloading TUFS vocabulary from {TUFS_URL}...')
    try:
        resp = requests.get(TUFS_URL, timeout=120)
        resp.raise_for_status()
        with open(TUFS_LOCAL, 'w', encoding='utf-8') as f:
            f.write(resp.text)
        size = len(resp.text.encode('utf-8'))
        print(f'✅ Downloaded {size:,} bytes → {TUFS_LOCAL}')
        return True
    except Exception as e:
        print(f'❌ Download failed: {e}')
        return False

def parse_tsv(path):
    entries_by_lang = {}
    with open(path, encoding='utf-8', newline='') as f:
        reader = csv.reader(f, delimiter='\t')
        header = None
        for row in reader:
            if not row or row[0].startswith('#'):
                continue
            if header is None:
                header = [h.lower().strip() for h in row]
                if 'lang' not in header:
                    header = ['cid', 'lang', 'wid', 'lemma', 'comment', 'iids', 'examples', 'is_basic', 'scenes', 'bunrui']
                continue
            
            row = row + [''] * (len(header) - len(row))
            rec = dict(zip(header, row))
            
            lang_raw = rec.get('lang', '')
            lang = normalise_lang(lang_raw)
            if not lang or lang not in TARGET_LANGS:
                continue
            
            lemma = rec.get('lemma', '').strip()
            if not lemma: continue
            
            comment = rec.get('comment', '')
            examples = rec.get('examples', '')
            bunrui = rec.get('bunrui', '')
            
            wid = rec.get('wid', '')
            pos = 'noun'
            m = re.search(r'\b([nvars])\b', wid)
            if m: pos = POS_MAP.get(m.group(1), 'noun')
            
            entry = {
                'id': str(uuid.uuid4()),
                'language_code': lang,
                'word': lemma,
                'meaning': parse_meaning(comment),
                'reading': parse_reading(comment),
                'part_of_speech': pos,
                'level': bunrui_to_level(bunrui),
                'tags': [bunrui_to_tag(bunrui)],
                'example_sentence': parse_examples(examples),
                'source': 'tufs',
            }
            
            if lang not in entries_by_lang:
                entries_by_lang[lang] = []
            entries_by_lang[lang].append(entry)
    
    return entries_by_lang

def upsert_batch(items, lang_code):
    """Insert via Supabase REST API with upsert."""
    url = f'{SUPABASE_URL}/rest/v1/vocabulary_items'
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
    }
    
    records = []
    for item in items:
        records.append({
            'id': item['id'],
            'language_code': item['language_code'],
            'word': item['word'],
            'meaning': item['meaning'],
            'reading': item['reading'],
            'part_of_speech': item['part_of_speech'],
            'level': item['level'],
            'tags': item['tags'],
            'example_sentence': item['example_sentence'],
            'source': item['source'],
        })
    
    try:
        resp = requests.post(url, headers=headers, json=records, timeout=30)
        if resp.status_code in (200, 201):
            return len(records)
        else:
            print(f'  ❌ Batch failed [{resp.status_code}]: {resp.text[:200]}')
            return 0
    except Exception as e:
        print(f'  ❌ Batch exception: {e}')
        return 0

def main():
    print('🚀 TUFS Vocabulary Import Tool')
    print(f'   Target: {SUPABASE_URL}')
    print(f'   Languages: {", ".join(sorted(TARGET_LANGS))}')
    print()
    
    if not download_file():
        sys.exit(1)
    
    print('\n📖 Parsing TSV file...')
    entries_by_lang = parse_tsv(TUFS_LOCAL)
    
    total = sum(len(v) for v in entries_by_lang.values())
    print(f'   Found {total:,} entries across {len(entries_by_lang)} languages')
    for lang, entries in sorted(entries_by_lang.items()):
        print(f'     {LANG_NAMES.get(lang, lang):15s} ({lang}): {len(entries):,} words')
    
    if SUPABASE_KEY == 'your_supabase_service_key_here':
        print('\n⚠️  SUPABASE_SERVICE_KEY not set. Set it via environment variable:')
        print('   $env:SUPABASE_SERVICE_KEY="your-key"  (PowerShell)')
        print('   export SUPABASE_SERVICE_KEY="your-key" (bash)')
        print('\n📝 Generating SQL file instead...')
        generate_sql(entries_by_lang)
        return
    
    print(f'\n📤 Uploading to Supabase...')
    total_imported = 0
    for lang in sorted(TARGET_LANGS):
        entries = entries_by_lang.get(lang, [])
        if not entries:
            print(f'  {lang}: No entries to import')
            continue
        
        # Limit to 500 per language for performance
        entries = entries[:500]
        name = LANG_NAMES.get(lang, lang)
        print(f'  {name} ({lang}): {len(entries)} words...', end=' ', flush=True)
        
        batch_size = 100
        imported = 0
        for i in range(0, len(entries), batch_size):
            batch = entries[i:i+batch_size]
            n = upsert_batch(batch, lang)
            imported += n
            time.sleep(0.3)  # Rate limiting
        
        total_imported += imported
        print(f'✅ {imported} imported')
    
    print(f'\n🎉 Done! Total imported: {total_imported:,} rows')

def generate_sql(entries_by_lang):
    """Generate SQL for manual import when API key is not available."""
    lines = []
    lines.append('-- TUFS Vocabulary Import SQL')
    lines.append('-- Generated by import_tufs_data.py')
    lines.append('-- Run this in Supabase SQL Editor')
    lines.append('')
    
    for lang in sorted(TARGET_LANGS):
        entries = entries_by_lang.get(lang, [])[:500]
        if not entries:
            continue
        name = LANG_NAMES.get(lang, lang)
        lines.append(f'-- {name} ({lang}): {len(entries)} words')
        
        for i in range(0, len(entries), 50):
            batch = entries[i:i+50]
            lines.append('INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, example_sentence, source) VALUES')
            values = []
            for e in batch:
                w = e['word'].replace("'", "''")
                m = e['meaning'].replace("'", "''")
                r = e['reading'].replace("'", "''")
                ex = e['example_sentence'].replace("'", "''")
                tags = '{' + ','.join(e['tags']) + '}'
                values.append(f"  ('{e['id']}', '{e['language_code']}', '{w}', '{m}', '{r}', '{e['part_of_speech']}', '{e['level']}', '{tags}', '{ex}', '{e['source']}')")
            lines.append(',\n'.join(values))
            lines.append('ON CONFLICT (language_code, word) DO UPDATE SET')
            lines.append('  meaning = EXCLUDED.meaning,')
            lines.append('  reading = EXCLUDED.reading,')
            lines.append('  part_of_speech = EXCLUDED.part_of_speech,')
            lines.append('  level = EXCLUDED.level,')
            lines.append('  tags = EXCLUDED.tags,')
            lines.append('  example_sentence = EXCLUDED.example_sentence,')
            lines.append('  source = EXCLUDED.source;')
            lines.append('')
    
    path = 'tufs_import.sql'
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    total = sum(len(v) for v in entries_by_lang.values())
    print(f'\n✅ Generated {path}')
    print(f'   {total:,} total vocabulary entries')
    print(f'   Open Supabase SQL Editor and run this file.')

if __name__ == '__main__':
    main()
