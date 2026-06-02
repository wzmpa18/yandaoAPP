import requests
import time

print("Downloading TUFS vocabulary data...")

# Try multiple mirrors
urls = [
    "https://github.com/omwn/tufs/raw/master/tufs-vocab.tsv",
    "https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv",
    "https://cdn.jsdelivr.net/gh/omwn/tufs/tufs-vocab.tsv",
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/plain'
}

success = False
for i, url in enumerate(urls, 1):
    print(f"\nAttempt {i}: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=120, verify=False)
        response.raise_for_status()
        
        with open("tufs-vocab.tsv", "wb") as f:
            f.write(response.content)
        
        file_size = len(response.content)
        print(f"✅ Download successful! File size: {file_size:,} bytes")
        success = True
        break
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed: {e}")
        time.sleep(2)

if success:
    print("\n🎉 TUFS vocabulary data downloaded successfully!")
    print("Next step: Run import_tufs.py to import data to Supabase")
else:
    print("\n❌ All download attempts failed.")
    print("Please try downloading manually from:")
    print("  https://github.com/omwn/tufs/blob/master/tufs-vocab.tsv")