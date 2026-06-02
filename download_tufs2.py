import sys
import time

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

print("Downloading TUFS vocabulary data...")
print("Using requests library with timeout=60...")

url = "https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv"

# Try different approaches
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try:
    print(f"Attempt 1: Direct download from GitHub...")
    response = requests.get(url, headers=headers, timeout=60)
    response.raise_for_status()
    
    with open("tufs-vocab.tsv", "wb") as f:
        f.write(response.content)
    
    file_size = len(response.content)
    print(f"✅ Download successful! File size: {file_size:,} bytes")
    
except requests.exceptions.RequestException as e:
    print(f"❌ Attempt 1 failed: {e}")
    
    print("\nAttempt 2: Using alternative URL...")
    url2 = "https://github.com/omwn/tufs/raw/master/tufs-vocab.tsv"
    try:
        response = requests.get(url2, headers=headers, timeout=60)
        response.raise_for_status()
        
        with open("tufs-vocab.tsv", "wb") as f:
            f.write(response.content)
        
        file_size = len(response.content)
        print(f"✅ Download successful! File size: {file_size:,} bytes")
        
    except requests.exceptions.RequestException as e2:
        print(f"❌ Attempt 2 failed: {e2}")
        
        print("\nAttempt 3: Using HTTPS with verify=False...")
        try:
            response = requests.get(url, headers=headers, timeout=60, verify=False)
            response.raise_for_status()
            
            with open("tufs-vocab.tsv", "wb") as f:
                f.write(response.content)
            
            file_size = len(response.content)
            print(f"✅ Download successful! File size: {file_size:,} bytes")
            
        except requests.exceptions.RequestException as e3:
            print(f"❌ Attempt 3 failed: {e3}")
            
            print("\n❌ All download attempts failed.")
            print("Please try downloading manually from:")
            print("  https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv")
            sys.exit(1)