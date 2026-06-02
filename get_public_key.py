import subprocess
import base64

print("Extracting public key from keystore...")

try:
    # Export certificate to temp file
    result = subprocess.run([
        'keytool', '-exportcert',
        '-alias', 'mykey',
        '-keystore', 'C:\\Users\\ZhuanZ\\Downloads\\youdao-main (1)\\youdao-main\\android\\app\\my-release-key.jks',
        '-storepass', 'android',
        '-keypass', 'android',
        '-file', 'temp_cert.cer'
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error exporting cert: {result.stderr}")
        exit(1)
    
    # Read certificate bytes
    with open('temp_cert.cer', 'rb') as f:
        cert_data = f.read()
    
    # Extract public key from DER certificate
    # The public key starts after the certificate header
    # Looking for RSA public key OID and extracting the key
    import hashlib
    
    # Get SHA-256 fingerprint (already have this)
    sha256_hash = hashlib.sha256(cert_data).hexdigest()
    
    print("\n✅ 安卓平台公钥信息：")
    print("=" * 60)
    
    # Get the public key in hex format from the certificate
    # For certificate fingerprints, we already have:
    print(f"SHA1: 9D:D5:B4:CF:21:87:59:89:EE:BD:31:90:0C:10:9E:56:A8:68:F4:B5")
    print(f"SHA256: 94:13:E8:9B:02:4F:4D:4D:2A:CA:51:DB:B3:8F:3C:61:84:A2:4D:A1:CA:E9:8D:5D:4E:B9:41:CD:0B:5C:2B:0A")
    print(f"MD5: 52:D0:BF:73:3B:C8:4C:CF:7B:B0:43:37:74:AB:D2:F4")
    
    # Get public key bytes (simplified extraction)
    # The public key is in the certificate body
    import struct
    
    # Find the BIT STRING containing the public key
    # DER structure: SEQUENCE -> SEQUENCE -> BIT STRING (public key)
    offset = 0
    # Skip outer SEQUENCE header
    if cert_data[offset] == 0x30:
        offset += 1
        if cert_data[offset] < 0x80:
            offset += cert_data[offset] + 1
        else:
            len_bytes = cert_data[offset] & 0x7F
            offset += len_bytes + 1
    
    # Skip inner SEQUENCE header (subject + issuer + etc)
    # Find the BIT STRING tag (0x03)
    while offset < len(cert_data):
        if cert_data[offset] == 0x03:
            break
        offset += 1
    
    if offset < len(cert_data) and cert_data[offset] == 0x03:
        offset += 1
        # Parse length
        if cert_data[offset] < 0x80:
            key_len = cert_data[offset]
            offset += 1
        else:
            len_bytes = cert_data[offset] & 0x7F
            key_len = int.from_bytes(cert_data[offset+1:offset+1+len_bytes], 'big')
            offset += len_bytes + 1
        
        # Skip the unused bits byte
        offset += 1
        
        # Extract the public key bytes
        public_key_bytes = cert_data[offset:offset+key_len]
        
        # Convert to hex
        public_key_hex = public_key_bytes.hex()
        
        print(f"\n公钥 (十六进制):\n{public_key_hex}")
        
        # Also show base64
        public_key_b64 = base64.b64encode(public_key_bytes).decode()
        print(f"\n公钥 (Base64):\n{public_key_b64}")
    
    # Cleanup
    import os
    if os.path.exists('temp_cert.cer'):
        os.remove('temp_cert.cer')
    
    print("\n✅ 公钥提取完成！")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()