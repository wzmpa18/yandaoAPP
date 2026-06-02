import requests
import zipfile
import os
import json
from pathlib import Path

BASE_URL = 'http://www.coelang.tufs.ac.jp/mt/vmod/'

TARGET_LANGS = {
    'ja': 'Japanese',
    'en': 'English',
    'ko': 'Korean',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese [European]',
    'ar': 'Arabic [Standard]',
    'zh': 'Mandarin Chinese',
}

LANG_FILE_MAP = {
    'ja': 'vmod_ja.zip',
    'en': 'vmod_en.zip',
    'ko': 'vmod_ko.zip',
    'fr': 'vmod_fr.zip',
    'es': 'vmod_es.zip',
    'de': 'vmod_de.zip',
    'it': 'vmod_it.zip',
    'pt': 'vmod_pt.zip',
    'ar': 'vmod_ar.zip',
    'zh': 'vmod_zh.zip',
}

def download_file(url, filename):
    print(f"Downloading {filename}...")
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"✅ Downloaded {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return False

def extract_zip(zip_path, extract_dir):
    print(f"Extracting {zip_path}...")
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print(f"✅ Extracted to {extract_dir}")
        return True
    except Exception as e:
        print(f"❌ Failed to extract {zip_path}: {e}")
        return False

def parse_vmod_file(filepath, lang_code):
    entries = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()
        
        current_entry = {}
        for line in lines:
            line = line.strip()
            if line.startswith(';') or line == '':
                if current_entry:
                    entries.append(current_entry)
                    current_entry = {}
                continue
            
            if line.startswith('HEADWORD:'):
                current_entry['lemma'] = line.replace('HEADWORD:', '').strip()
            elif line.startswith('PRONUNCIATION:'):
                current_entry['pronunciation'] = line.replace('PRONUNCIATION:', '').strip()
            elif line.startswith('PART_OF_SPEECH:'):
                current_entry['pos'] = line.replace('PART_OF_SPEECH:', '').strip()
            elif line.startswith('MEANING:'):
                current_entry['meaning'] = line.replace('MEANING:', '').strip()
            elif line.startswith('EXAMPLE:'):
                current_entry['example'] = line.replace('EXAMPLE:', '').strip()
            elif line.startswith('EXAMPLE_TRANSLATION:'):
                current_entry['example_translation'] = line.replace('EXAMPLE_TRANSLATION:', '').strip()
        
        if current_entry:
            entries.append(current_entry)
        
        print(f"Parsed {len(entries)} entries for {lang_code}")
        return entries
    
    except Exception as e:
        print(f"❌ Failed to parse {filepath}: {e}")
        return []

def import_to_supabase(items, lang_code):
    import os
    SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
    SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')
    
    url = f"{SUPABASE_URL}/rest/v1/contents"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    total_imported = 0
    batch_size = 50
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i+batch_size]
        entries_to_insert = []
        
        for item in batch:
            entry = {
                'type': 'vocab',
                'language': lang_code,
                'title': item.get('lemma', ''),
                'content': item.get('lemma', ''),
                'translation': item.get('meaning', ''),
                'level': '1',
                'source': 'tufs_vmod',
                'usage_count': 0,
                'extra_data': json.dumps({
                    'pronunciation': item.get('pronunciation', ''),
                    'pos': item.get('pos', ''),
                    'example': item.get('example', ''),
                    'example_translation': item.get('example_translation', ''),
                })
            }
            entries_to_insert.append(entry)
        
        try:
            response = requests.post(url, headers=headers, data=json.dumps(entries_to_insert))
            if response.status_code in [200, 201]:
                total_imported += len(entries_to_insert)
                print(f"  Batch {i//batch_size + 1}: Imported {len(entries_to_insert)} items (total: {total_imported})")
            else:
                print(f"  ❌ Batch {i//batch_size + 1} failed: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"  ❌ Batch {i//batch_size + 1} exception: {e}")
    
    return total_imported

def main():
    print("🚀 Starting TUFS vocabulary download and import...\n")
    
    download_dir = Path('tufs_data')
    download_dir.mkdir(exist_ok=True)
    
    total_imported = {}
    
    for lang_code, lang_name in TARGET_LANGS.items():
        print(f"\n=== Processing {lang_name} ({lang_code}) ===")
        
        zip_file = LANG_FILE_MAP.get(lang_code)
        if not zip_file:
            print(f"  ⚠️ No file mapping for {lang_code}, skipping")
            continue
        
        zip_url = BASE_URL + zip_file
        zip_path = download_dir / zip_file
        extract_dir = download_dir / lang_code
        
        if not download_file(zip_url, zip_path):
            print(f"  ⚠️ Skipping {lang_code} due to download failure")
            continue
        
        if not extract_zip(zip_path, extract_dir):
            print(f"  ⚠️ Skipping {lang_code} due to extract failure")
            continue
        
        vmod_files = list(extract_dir.glob('*.vmod'))
        if not vmod_files:
            print(f"  ⚠️ No .vmod files found in {extract_dir}")
            continue
        
        all_entries = []
        for vmod_file in vmod_files:
            entries = parse_vmod_file(vmod_file, lang_code)
            all_entries.extend(entries)
        
        print(f"\n📥 Importing {len(all_entries)} entries for {lang_code}...")
        imported = import_to_supabase(all_entries, lang_code)
        total_imported[lang_code] = imported
        print(f"✅ Imported {imported} entries for {lang_code}")
    
    print("\n🎉 Download and import complete!")
    print("\n📊 Summary:")
    for lang_code, count in sorted(total_imported.items()):
        print(f"  {lang_code}: {count} entries")
    print(f"  Total: {sum(total_imported.values())} entries")

if __name__ == '__main__':
    main()