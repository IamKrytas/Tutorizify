from app.utils.db import get_mysql_connection
from app.utils.file import save_file
from datetime import datetime
import bcrypt


def login_model(data):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    email = data.get('email')
    password = data.get('password')

    # Fetch hashed and role_id password from the database
    cursor.execute("SELECT id, password, role_id FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()

    if not result:
        raise ValueError("Niepoprawny email lub hasło")
    
    user_id = result['id']
    hashed_password = result['password']
    role_id = result = result['role_id']

    if not bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
        raise ValueError("Nieprawidłowy email lub hasło")
    
    cursor.close()
    conn.close()
    return {"id": user_id, "email": email, "role": role_id}


def register_model(data, avatar):
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    avatar_filename = 'default_avatar.png'
    registration_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    role_id = 3
    
    if password != confirm_password:
        raise ValueError("Hasła nie są takie same")

    conn = get_mysql_connection()
    cursor = conn.cursor()
    try:
        # Check if the username already exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = %s", (email,))
        if cursor.fetchone()[0] > 0:
            raise ValueError("Użytkownik o podanym emailu już istnieje")
        
        # hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Register the user
        cursor.execute(
            '''INSERT INTO users (username, email, password, registration_date, avatar, role_id)
               VALUES (%s, %s, %s, %s, %s, %s)''',
            (username, email, hashed_password, registration_date, avatar_filename, role_id)
        )
        conn.commit()

        # Fetch the user ID
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]

        # Save the avatar if provided
        if avatar:
            avatar_filename = save_file(avatar, user_id)
            cursor.execute("UPDATE users SET avatar = %s WHERE id = %s", (avatar_filename, user_id))
            conn.commit()

        cursor.close()
        conn.close()
        return {'id': user_id, 'email': email, 'role': role_id}
    
    except ValueError as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise e
    

def register_teacher_model(data, email):
    first_name = data['name']
    last_name = data['surname']
    subject_id = data['subject']
    price = data['price']
    level_id = data['level']
    status = 0
    rating = 0

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch the user ID
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user_id = cursor.fetchone()['id']
    if not user_id:
        raise ValueError("Użytkownik nie istnieje")

    # Check if the user is already a teacher
    cursor.execute("SELECT COUNT(*) FROM teachers WHERE user_id = %s", (user_id,))
    if cursor.fetchone()['COUNT(*)'] > 0:
        raise ValueError("Użytkownik jest już nauczycielem")
    
    # Register the teacher
    cursor.execute("INSERT INTO teachers (name, user_id, subject, level_id, price, rating, status) VALUES (%s, %s, %s, %s, %s, %s, %s)", (first_name + ' ' + last_name, user_id, subject_id, level_id, price, rating, status))

    # Change the user's role to teacher
    cursor.execute("UPDATE users SET role_id = 2 WHERE email = %s", (email,))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zarejestrować nauczyciela")

    cursor.close()
    conn.close()
    return {'id': user_id, 'email': email, 'role': 2}