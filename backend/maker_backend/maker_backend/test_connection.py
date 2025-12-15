import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

print("Testing Supabase connection...")
print(f"Connection string: {DATABASE_URL[:50]}...")  # Print first 50 chars only

try:
    # Try to connect
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Connection successful!")
    
    # Try a simple query
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"✅ PostgreSQL version: {version[0][:50]}...")
    
    cursor.close()
    conn.close()
    print("✅ All tests passed!")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\nTroubleshooting tips:")
    print("1. Check your DATABASE_URL in .env file")
    print("2. Make sure you're using the connection pooler (port 6543)")
    print("3. Verify your database password is correct")
    print("4. Check your internet connection")