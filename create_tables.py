import requests
import os

SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

def execute_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
    }
    
    data = {
        'query': sql
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code in [200, 201]:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def main():
    print("🚀 Creating new database tables...")
    
    tables_sql = [
        """
        CREATE TABLE IF NOT EXISTS user_favorites (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, content_id)
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS user_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
            viewed_at TIMESTAMP DEFAULT NOW(),
            view_count INTEGER DEFAULT 1
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS game_records (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            game_type VARCHAR(50) NOT NULL,
            question_set TEXT NOT NULL,
            mode VARCHAR(20) DEFAULT 'infinite',
            completed BOOLEAN DEFAULT FALSE,
            score INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        """
    ]
    
    for i, sql in enumerate(tables_sql):
        print(f"\nCreating table {i+1}...")
        success, result = execute_sql(sql)
        if success:
            print(f"✅ Table {i+1} created successfully")
        else:
            print(f"❌ Failed to create table {i+1}: {result}")
    
    print("\n🎉 Database tables creation complete!")

if __name__ == '__main__':
    main()