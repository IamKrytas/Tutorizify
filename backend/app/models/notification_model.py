from app.utils.db import get_mysql_connection


def get_notifications_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user ID based on email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    user_id = user['id']

    # Fetch all notifications for the user
    cursor.execute("SELECT * FROM notifications WHERE user_id = %s", (user_id,))
    notifications = cursor.fetchall()

    if not notifications:
        raise ValueError("Nie znaleziono powiadomień dla tego użytkownika")

    cursor.close()
    conn.close()
    return notifications
