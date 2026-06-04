import requests, json

TOKEN = 'cfat_2qR6wMpm2NB5AGuaF9QKpbEpbvVHs1VoDV2LYBe459ae2fb'
ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
BUCKET = 'youdao-app'
headers = {'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'}
BASE = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}'

print('=== Step 1: Verify Token ===')
r = requests.get('https://api.cloudflare.com/client/v4/user/tokens/verify', headers=headers)
j = r.json()
status = j.get('result', {}).get('status', '?')
print(f'Token status: {r.status_code} -> {status}')

if r.status_code != 200:
    print('Token invalid! Stopping.')
    exit(1)

print('\n=== Step 2: List Buckets ===')
r = requests.get(f'{BASE}/r2/buckets', headers=headers)
data = r.json()
for b in data.get('result', []):
    print(f'  Bucket: {b["name"]}')

print('\n=== Step 3: Enable R2 Public Access (managed domain) ===')
url = f'{BASE}/r2/buckets/{BUCKET}/domains/managed'
r = requests.put(url, headers=headers, json={'enabled': True})
result = r.json()
print(f'Status: {r.status_code}')
print(json.dumps(result, indent=2))

# Also try the public access endpoint
print('\n=== Step 3b: Try public_access endpoint ===')
url2 = f'{BASE}/r2/buckets/{BUCKET}/public-access'
r2 = requests.post(url2, headers=headers, json={'enabled': True})
print(f'Status: {r2.status_code} -> {json.dumps(r2.json(), indent=2)[:300]}')

# Try GET to check current state
r3 = requests.get(url2, headers=headers)
print(f'GET Status: {r3.status_code} -> {json.dumps(r3.json(), indent=2)[:300]}')

print('\n=== Step 4: Test Public Access ===')
import time
time.sleep(5)  # Wait for propagation
urls = [
    f'https://{BUCKET}.{ACCOUNT_ID}.r2.dev/download.html',
    f'https://{BUCKET}.{ACCOUNT_ID}.r2.dev/android/yandao-latest.apk',
]
for u in urls:
    try:
        r = requests.head(u, timeout=15, allow_redirects=True)
        ok = 'OK' if r.status_code == 200 else f'FAIL({r.status_code})'
        print(f'  {u.split("/")[-1]} -> {ok}')
    except Exception as e:
        print(f'  {u.split("/")[-1]} -> ERROR: {e}')

print('\n=== Step 5: List Files in R2 Bucket ===')
try:
    import boto3
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id='cce8d892e901a381f099071ef3721e38',
        aws_secret_access_key='869f7613f7c9958252266f6c157f410703141133a595c876de575636290d28a3'
    )
    resp = s3.list_objects_v2(Bucket=BUCKET)
    files = resp.get('Contents', [])
    total_size = sum(f['Size'] for f in files)
    print(f'  Total files: {len(files)}')
    print(f'  Total size: {total_size / 1024 / 1024:.1f} MB')
    
    # Show APK files
    apk_files = [f for f in files if '.apk' in f['Key']]
    ipa_files = [f for f in files if '.ipa' in f['Key']]
    
    print(f'\n  APK files ({len(apk_files)}):')
    for f in apk_files:
        print(f'    {f["Key"]} ({f["Size"]/1024/1024:.1f}MB)')
    
    print(f'\n  IPA files ({len(ipa_files)}):')
    for f in ipa_files:
        print(f'    {f["Key"]} ({f["Size"]/1024/1024:.1f}MB)')
        
except Exception as e:
    print(f'  Error listing files: {e}')

print('\nDone!')
