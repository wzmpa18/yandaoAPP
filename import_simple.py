import csv
import json
import requests
import sys
import os
from pathlib import Path

SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

TARGET_LANGS = {'ja', 'en', 'ko', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh'}

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
    'cmn': 'zh', 'zho': 'zh', 'zh': 'zh',
}

def normalise_lang(raw):
    raw = raw.strip()
    return LANG_NORM.get(raw) or LANG_NORM.get(raw.split('-')[0].lower())

def parse_tsv(path):
    rows = []
    with open(path, encoding='utf-8', newline='') as f:
        reader = csv.reader(f, delimiter='\t')
        header = None
        for row in reader:
            if not row or row[0].startswith('#'):
                continue
            if header is None:
                header = [h.lower().strip() for h in row]
                if not {'lang', 'lemma'}.issubset(set(header)):
                    header = ['cid', 'lang', 'wid', 'lemma', 'comment', 'iids', 'examples', 'is_basic', 'scenes', 'bunrui']
                continue
            row = row + [''] * (len(header) - len(row))
            rec = dict(zip(header, row))
            rows.append(rec)
    return rows

def extract_meaning(comment):
    if not comment:
        return ''
    import re
    clean = comment.replace(r'<[^>]*>', '')
    clean = clean.replace(r'［[^］]*］', '')
    clean = clean.replace('\r', '')
    match = re.search(r'【意味】(.+?)(?:【|$)', clean, re.DOTALL)
    if match:
        return match.group(1).strip()[:500]
    match = re.search(r'^([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af\w\s,，。、\-]+)', clean)
    return match.group(1).strip() if match else clean.strip()[:500]

def upsert_batch(items):
    if not items:
        return 0
    
    url = f"{SUPABASE_URL}/rest/v1/contents"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(items))
        if response.status_code in [200, 201]:
            return len(items)
        else:
            print(f"  ❌ Error: {response.status_code} - {response.text[:200]}")
            return 0
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return 0

def main():
    print('🚀 Starting TUFS vocabulary import...\n')
    
    src = Path('tufs-vocab.tsv')
    if not src.exists():
        print(f"❌ ERROR: Source file not found: {src}")
        sys.exit(1)
    
    print('📖 Reading TSV file...')
    rows = parse_tsv(src)
    print(f"✅ Read {len(rows)} total rows")
    
    print('\n📤 Preparing data...')
    items = []
    lang_counts = {}
    
    for row in rows:
        lang_raw = row.get('lang', '')
        lang = normalise_lang(lang_raw)
        
        if lang is None or lang not in TARGET_LANGS:
            continue
        
        lemma = row.get('lemma', '').strip()
        if not lemma:
            continue
        
        comment = row.get('comment', '')
        is_basic = row.get('is_basic', '')
        
        item = {
            'type': 'vocab',
            'language': lang,
            'title': lemma,
            'content': lemma,
            'translation': extract_meaning(comment),
            'level': '1' if is_basic == '1' else '2',
            'source': 'tufs',
            'usage_count': 0,
        }
        
        items.append(item)
        lang_counts[lang] = lang_counts.get(lang, 0) + 1
    
    print(f"✅ Prepared {len(items)} items for import")
    print("   Language distribution:")
    for lang, count in sorted(lang_counts.items()):
        print(f"     {lang}: {count}")
    
    print('\n📥 Importing to Supabase...')
    batch_size = 50
    total_imported = 0
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i+batch_size]
        imported = upsert_batch(batch)
        total_imported += imported
        print(f"  Batch {i//batch_size + 1}: Imported {imported} items (total: {total_imported})")
    
    print(f'\n🎉 Import complete! Total imported: {total_imported}')
    print("\n📊 Final Language Distribution:")
    for lang, count in sorted(lang_counts.items()):
        print(f"   {lang}: {count}")

if __name__ == '__main__':
    main()