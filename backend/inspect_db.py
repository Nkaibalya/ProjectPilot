import sqlite3

def inspect_db():
    try:
        conn = sqlite3.connect('project_pilot.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("\n=== DATABASE TABLES ===")
        for table in tables:
            print(f"- {table[0]}")
            
        for table in ['users', 'projects', 'issues', 'comments']:
            print(f"\n=== SCHEMA: {table.upper()} ===")
            cursor.execute(f"PRAGMA table_info({table});")
            cols = cursor.fetchall()
            print(f"{'ID':<4} | {'Name':<15} | {'Type':<10} | {'Null?':<6} | {'PK?':<3}")
            print("-" * 50)
            for col in cols:
                print(f"{col[0]:<4} | {col[1]:<15} | {col[2]:<10} | {'No' if col[3] else 'Yes':<6} | {'Yes' if col[5] else 'No':<3}")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_db()
