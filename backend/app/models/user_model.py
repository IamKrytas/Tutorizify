from app.utils.db import get_mysql_connection
import os
from app.utils.file import save_file
import bcrypt


def get_users_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
                users.id,
                users.username,
                users.email,
                users.registration_date,
                roles.name AS role
            FROM users
            JOIN roles ON users.role_id = roles.id
            ORDER BY users.id
    """
    cursor.execute(query)
    users = cursor.fetchall()

    if not users:
        raise ValueError("Nie znaleziono żadnych użytkowników")
    
    cursor.close()
    conn.close()
    return users


def get_user_info_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email, username, registration_date, avatar FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        raise ValueError("Użytkownik nie został znaleziony")

    cursor.close()
    conn.close()
    return user


def get_user_profile_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email, username, registration_date, avatar FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        raise ValueError("Użytkownik nie został znaleziony")
    
    cursor.close()
    conn.close()
    return user


def get_roles_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM roles")
    roles = cursor.fetchall()

    if not roles:
        raise ValueError("Nie znaleziono żadnych ról")
    
    cursor.close()
    conn.close()
    return roles


def update_profile_model(data, email):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    new_username = data['username']

    # Check if the old username is the same as the new one
    cursor.execute("SELECT username FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise ValueError("Użytkownik nie został znaleziony")
    
    old_username = result[0]
    if old_username == new_username:
        raise ValueError("Nowa nazwa użytkownika jest taka sama jak stara")
        
    cursor.execute("UPDATE users SET username = %s WHERE email = %s", (new_username, email))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zaktualizować profilu")
    
    cursor.close()
    conn.close()
    return "Profil został zaktualizowany pomyślnie"


def update_password_model(data, email):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    old_password = data['old_password']
    new_password = data['new_password']

    # Fetch user's current hashed password
    cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise ValueError("Użytkownik nie został znaleziony")
    hashed_old_password = result[0]

    # Verify old password
    if not bcrypt.checkpw(old_password.encode('utf-8'), hashed_old_password.encode('utf-8')):
        conn.close()
        raise ValueError("Stare hasło jest nieprawidłowe")
    
    # Hash the new password
    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Update the password in the database
    cursor.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new_password, email))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zmienić hasła")
    
    cursor.close()
    conn.close()
    return "Hasło zostało zmienione pomyślnie"


def update_avatar_model(avatar, email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch the user ID based on the email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user_id = cursor.fetchone()['id']

    # Change the avatar filename to a unique one
    if avatar:
        avatar_filename = save_file(avatar, user_id)
        # Update the user's avatar name in the database
        cursor.execute("UPDATE users SET avatar = %s WHERE email = %s", (avatar_filename, email))
        conn.commit()
    
    cursor.close()
    conn.close()
    return "Awatar został zaktualizowany pomyślnie"


def update_role_by_id_model(data, user_id):
    conn = get_mysql_connection()
    cursor = conn.cursor()

    # Fetch the role ID based on the role name
    cursor.execute("SELECT id FROM roles WHERE name = %s", (data['role'],))
    role_id = cursor.fetchone()[0]

    # Update the user's role
    cursor.execute("UPDATE users SET role_id = %s WHERE id = %s", (role_id, user_id))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zmienić roli użytkownika")
    
    cursor.close()
    conn.close()
    return "Rola użytkownika została zmieniona pomyślnie"


def delete_user_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor()

    # Delete bookings associated with the user
    cursor.execute("DELETE FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete teachers associated with the user
    cursor.execute("DELETE FROM teachers WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete ratings associated with the user
    cursor.execute("DELETE FROM ratings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete the user
    cursor.execute("DELETE FROM users WHERE email = %s", (email,))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się usunąć konta")

    cursor.close()
    conn.close()
    return "Konto zostało usunięte pomyślnie"