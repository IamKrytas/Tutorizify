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
                roles.role_name AS role
            FROM users
            JOIN roles ON users.role_id = roles.id
            ORDER BY users.id
    """
    cursor.execute(query)
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users


def get_user_info_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    email = 'admin' # It will be replaced
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    avatar = user['avatar']
    if avatar:
        user['avatar'] = f"{os.getenv('LOCALHOST')}/static/avatars/{avatar}"
    else:
        user['avatar'] = None
    conn.close()
    return user


def get_profile_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    email = 'admin'  # It will be replaced
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()
    return user


def update_profile_model(data):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    email = 'admin'  # It will be replaced
    cursor.execute("UPDATE users SET username = %s WHERE email = %s", (data['username'], email))
    conn.commit()
    conn.close()
    return "Profile updated successfully"


def change_email_model(data):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    email = 'admin' # It will be replaced

    # Check if the new email already exists
    cursor.execute("SELECT COUNT(*) FROM users WHERE email = %s", (data['email'],))
    if cursor.fetchone()[0] > 0:
        return "Email already exists"

    # Fetch user's current hashed password
    cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    if not result:
        return "User not found"

    hashed_password = result[0]

        # Verify password
    if not bcrypt.checkpw(data['password'].encode('utf-8'), hashed_password.encode('utf-8')):
        return "Incorrect password"

    # Zmień email
    cursor.execute("UPDATE users SET email = %s WHERE email = %s", (data['email'], email))
    conn.commit()
    return "Email changed successfully"


def change_password_model(data):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    email = 'admin'  # It will be replaced
    old_password = data['old_password']
    new_password = data['password']

    # Fetch user's current hashed password
    cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        return "User not found"
    hashed_old_password = result[0]

    # Verify old password
    if not bcrypt.checkpw(old_password.encode('utf-8'), hashed_old_password.encode('utf-8')):
        conn.close()
        return "Incorrect old password"
    
    # Hash the new password
    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Update the password in the database
    cursor.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new_password, email))
    conn.commit()
    conn.close()
    return "Password changed successfully"


def delete_account_model():
    conn = get_mysql_connection()
    cursor = conn.cursor()
    email = 'admin'  # It will be replaced

    # Delete bookings associated with the user
    cursor.execute("DELETE FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete teachers associated with the user
    cursor.execute("DELETE FROM teachers WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete ratings associated with the user
    cursor.execute("DELETE FROM ratings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

    # Delete the user
    cursor.execute("DELETE FROM users WHERE email = %s", (email,))

    conn.commit()
    conn.close()
    return "Account deleted successfully"


def update_avatar_model(avatar):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    email = 'admin'  # It will be replaced

    # Fetch the user ID based on the email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user_id = cursor.fetchone()[0]

    # Change the avatar filename to a unique one
    if avatar:
        avatar_filename = save_file(avatar, user_id)
    else:
        avatar_filename = 'default_avatar.png'

    # Update the user's avatar name in the database
    cursor.execute("UPDATE users SET avatar = %s WHERE email = %s", (avatar_filename, email))
    conn.commit()
    conn.close()
    return "Avatar updated successfully"


def get_roles_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM roles")
    roles = cursor.fetchall()
    cursor.close()
    conn.close()
    return roles


def change_role_model(data):
    conn = get_mysql_connection()
    cursor = conn.cursor()

    # Fetch the role ID based on the role name
    cursor.execute("SELECT id FROM roles WHERE role_name = %s", (data['role'],))
    role_id = cursor.fetchone()[0]

    # Update the user's role
    cursor.execute("UPDATE users SET role_id = %s WHERE id = %s", (role_id, data['user_id']))
    conn.commit()
    cursor.close()
    return "Role changed successfully"