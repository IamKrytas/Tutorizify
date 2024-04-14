import sqlite3

def fetch_all():
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        conn.close()
        return users
    except Exception as e:
        print(e)
        return "error"
    
print(fetch_all())