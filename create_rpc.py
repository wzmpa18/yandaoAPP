import requests
import os

SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

def create_rpc():
    url = f"{SUPABASE_URL}/rest/v1/"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
    }
    
    rpc_sql = """
    CREATE OR REPLACE FUNCTION execute_sql(query TEXT) 
    RETURNS TEXT 
    AS $$
    DECLARE
        result TEXT;
    BEGIN
        EXECUTE query;
        RETURN 'Success';
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 'Error: ' || SQLERRM;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """
    
    # 使用API直接执行SQL创建存储过程
    data = {
        'query': rpc_sql
    }
    
    try:
        # 使用pg_catalog.pg_stat_user_tables来执行DDL
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/_execute_sql",
            headers=headers,
            json=data
        )
        if response.status_code in [200, 201]:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def direct_execute(sql):
    """直接通过REST API执行SQL（绕过存储过程）"""
    url = f"{SUPABASE_URL}/rest/v1/"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    # 使用PostgREST的rpc端点或直接执行
    try:
        # 创建一个简单的存储过程来执行SQL
        rpc_create_sql = f"""
        DO $$ BEGIN EXECUTE '{sql.replace("'", "''")}'; END $$;
        """
        
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/_pg_execute",
            headers=headers,
            json={'query': sql}
        )
        return response.status_code == 200, response.text
    except Exception as e:
        return False, str(e)

def main():
    print("🚀 Creating execute_sql function...")
    
    # 直接使用URL参数方式执行SQL
    import urllib.parse
    
    tables = [
        {
            'name': 'user_favorites',
            'sql': """CREATE TABLE IF NOT EXISTS user_favorites (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, content_id UUID REFERENCES contents(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(user_id, content_id))"""
        },
        {
            'name': 'user_history',
            'sql': """CREATE TABLE IF NOT EXISTS user_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, content_id UUID REFERENCES contents(id) ON DELETE CASCADE, viewed_at TIMESTAMP DEFAULT NOW(), view_count INTEGER DEFAULT 1)"""
        },
        {
            'name': 'game_records',
            'sql': """CREATE TABLE IF NOT EXISTS game_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, game_type VARCHAR(50) NOT NULL, question_set TEXT NOT NULL, mode VARCHAR(20) DEFAULT 'infinite', completed BOOLEAN DEFAULT FALSE, score INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())"""
        }
    ]
    
    for table in tables:
        print(f"\nCreating table: {table['name']}")
        url_encoded_sql = urllib.parse.quote(table['sql'])
        url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql?query={url_encoded_sql}"
        
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
        }
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                print(f"✅ Table {table['name']} created successfully")
            else:
                # 尝试使用PostgREST的特殊端点
                print(f"Status: {response.status_code}, Response: {response.text[:200]}")
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    print("\n🎉 Table creation attempt complete!")

if __name__ == '__main__':
    main()