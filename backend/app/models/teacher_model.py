from app.utils.db import get_mysql_connection


def get_teachers_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            teachers.id, 
            teachers.name, 
            teachers.bio, 
            users.email AS email,
            teachers.description, 
            users.avatar AS avatar, 
            subjects.name AS subject_name,
            subject_level.name AS level,
            teachers.price, 
            teachers.rating
        FROM teachers
        JOIN subject_level ON teachers.level_id = subject_level.id
        JOIN subjects ON teachers.subject = subjects.id
        JOIN users ON teachers.user_id = users.id
        WHERE teachers.status = 1
    """
    cursor.execute(query)
    result = cursor.fetchall()
    if not result:
        raise ValueError("Nie znaleziono żadnych aktywnych nauczycieli")
    cursor.close()
    conn.close()
    return result


def get_all_teachers_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            teachers.id,
            teachers.name,
            teachers.bio,
            users.email AS email,
            teachers.description,
            users.avatar AS avatar,
            teachers.status,
            subjects.name AS subject_name,
            subject_level.name AS level,
            teachers.price,
            teachers.rating
        FROM teachers
        JOIN subjects ON teachers.subject = subjects.id
        JOIN users ON teachers.user_id = users.id
        JOIN subject_level ON teachers.level_id = subject_level.id
        ORDER BY teachers.id
        """
    cursor.execute(query)
    result = cursor.fetchall()

    if not result:
        raise ValueError("Nie znaleziono żadnych nauczycieli")
    
    cursor.close()
    conn.close()
    return result


def get_about_by_id_model(teacher_id):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT
            teachers.id,
            teachers.name,
            teachers.bio,
            teachers.description,
            users.email AS email,
            users.avatar AS avatar,
            subjects.name AS subject_name,
            subject_level.name AS level,
            teachers.price,
            teachers.rating,
            COUNT(ratings.rating) AS rating_count
        FROM teachers
        LEFT JOIN ratings ON teachers.id = ratings.teacher_id
        LEFT JOIN subject_level ON teachers.level_id = subject_level.id
        LEFT JOIN subjects ON teachers.subject = subjects.id
        LEFT JOIN users ON teachers.user_id = users.id
        WHERE teachers.id = %s
        GROUP BY teachers.id, users.email, users.avatar, subjects.name, subject_level.name;
        """
    cursor.execute(query, (teacher_id,))
    result = cursor.fetchone()

    if not result:
        raise ValueError("Nie znaleziono nauczyciela o podanym ID")
    
    cursor.close()
    conn.close()
    return result
    

def get_my_teacher_profile_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            teachers.id,
            teachers.name,
            users.email AS email,
            teachers.bio,
            teachers.description,
            subjects.name AS subject_name,
            subject_level.name AS level,
            teachers.price,
            teachers.rating,
            teachers.status
        FROM teachers
        JOIN subjects ON teachers.subject = subjects.id
        JOIN users ON teachers.user_id = users.id 
        JOIN subject_level ON teachers.level_id = subject_level.id
        WHERE teachers.user_id = (SELECT id FROM users WHERE email = %s)
        """
    cursor.execute(query, (email,))
    result = cursor.fetchone()

    if not result:
        raise ValueError("Nie znaleziono profilu nauczyciela dla tego użytkownika")
    
    cursor.close()
    conn.close()
    return result


def get_most_popular_teachers_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            teachers.id,
            teachers.name,
            users.avatar AS avatar,
            subjects.name AS subject_name,
            subject_level.name AS level,
            teachers.price,
            teachers.rating
        FROM teachers
        JOIN subject_level ON teachers.level_id = subject_level.id
        JOIN subjects ON teachers.subject = subjects.id
        JOIN users ON teachers.user_id = users.id
        ORDER BY teachers.rating DESC 
        LIMIT 5
    """
    cursor.execute(query)
    result = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return result


def update_my_teacher_profile_model(data, email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch the ID for the subject
    cursor.execute("SELECT id FROM subjects WHERE name = %s", (data['subject'],))
    subject_id = cursor.fetchone()
    if not subject_id:
        raise ValueError("Nie znaleziono przedmiotu o podanej nazwie")

    # Fetch the ID for the level
    cursor.execute("SELECT id FROM subject_level WHERE name = %s", (data['level'],))
    level_id = cursor.fetchone()

    if not level_id:
        raise ValueError("Nie znaleziono poziomu o podanej nazwie")

    # Fetch the user ID
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        raise ValueError("Nie znaleziono użytkownika o podanym emailu")
    
    cursor.execute(
        """
        UPDATE teachers
        SET 
            name = %s,
            bio = %s,
            description = %s,
            price = %s,
            subject = %s,
            level_id = %s
        WHERE user_id = %s
    """, (
        data['name'],
        data['bio'],
        data['description'],
        data['price'],
        subject_id['id'] if subject_id else None,
        level_id['id'] if level_id else None,
        user['id'] if user else None
    ))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zaktualizować profilu nauczyciela. Sprawdź, czy dane są poprawne")
    
    cursor.close()
    conn.close()
    return "Profil nauczyciela zaktualizowany pomyślnie"


def update_status_teacher_by_id_model(teacher_id):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Update the status of the teacher
    cursor.execute("UPDATE teachers SET status = NOT status WHERE id = %s", (teacher_id,))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zmienić statusu nauczyciela")

    # Add notification for the teacher
    cursor.execute("SELECT user_id FROM teachers WHERE id = %s", (teacher_id,))
    user_id = cursor.fetchone()['user_id']

    if not user_id:
        raise ValueError("Nie znaleziono użytkownika dla tego nauczyciela")

    # Get the status of the teacher
    cursor.execute("SELECT status FROM teachers WHERE id = %s", (teacher_id,))
    status = cursor.fetchone()['status']

    if status is None:
        raise ValueError("Nie udało się pobrać statusu nauczyciela")

    if status == 1:
        cursor.execute("INSERT INTO notifications (user_id, message) VALUES (%s, 'Twoje konto nauczycielskie zostało aktywowane')", (user_id,))
    else:
        cursor.execute("INSERT INTO notifications (user_id, message) VALUES (%s, 'Twoje konto nauczycielskie zostało zdezaktywowane')", (user_id,))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się dodać powiadomienia dla nauczyciela")
    
    cursor.close()
    conn.close()
    return "Status nauczyciela zmieniony pomyślnie"