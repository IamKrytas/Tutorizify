from app.utils.db import get_mysql_connection
from datetime import datetime, timedelta


def get_my_bookings_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            bookings.id,
            teachers.id AS teacher_id,
            teachers.name AS teacher_name,
            subjects.name AS subject,
            subject_level.name AS level,
            bookings.price AS price,
            bookings.date AS date,
            bookings.start_time,
            bookings.end_time,
            bookings.duration,
            bookings.reservation_time,
            EXISTS(
                SELECT 1 
                FROM ratings 
                WHERE ratings.teacher_id = teachers.id 
                AND ratings.user_id = (SELECT id FROM users WHERE email = %s)
            ) AS has_rated
        FROM bookings
        JOIN subjects ON bookings.subject_id = subjects.id
        JOIN teachers ON bookings.teacher_id = teachers.id
        JOIN subject_level ON teachers.level_id = subject_level.id
        WHERE bookings.user_id = (SELECT id FROM users WHERE email = %s)
        """, (email, email))

    bookings = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return bookings


def get_all_bookings_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
            SELECT 
                bookings.id,
                teachers.name AS teacher_name,
                users.username AS user_name,
                bookings.date,
                bookings.start_time,
                bookings.end_time,
                bookings.duration,
                bookings.reservation_time,
                subjects.name AS subject,
                subject_level.name AS level,
                bookings.price
            FROM bookings
            JOIN teachers ON bookings.teacher_id = teachers.id
            JOIN users ON bookings.user_id = users.id
            JOIN subjects ON bookings.subject_id = subjects.id
            JOIN subject_level ON bookings.level_id = subject_level.id
        """)
    bookings = cursor.fetchall()
    if not bookings:
        raise ValueError("Nie ma żadnych rezerwacji")
    
    cursor.close()
    conn.close()
    return bookings


def get_current_bookings_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch current bookings for the user
    cursor.execute("""
            SELECT
                bookings.id,
                teachers.name AS teacher_name,
                bookings.date,
                bookings.start_time,
                bookings.end_time,
                bookings.duration,
                bookings.price,
                bookings.reservation_time,
                subjects.name AS subject,
                subject_level.name AS level
            FROM bookings
            JOIN teachers ON bookings.teacher_id = teachers.id
            JOIN subjects ON bookings.subject_id = subjects.id
            JOIN subject_level ON teachers.level_id = subject_level.id
            WHERE bookings.user_id = (SELECT id FROM users WHERE email = %s) 
            AND CONCAT(bookings.date, ' ', bookings.start_time) >= NOW()
        """, (email,))
    bookings = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return bookings


def get_my_teacher_bookings_model(email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user_id based on email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    user_id = user["id"]

    # Fetch teacher's ID based on email
    cursor.execute("SELECT id FROM teachers WHERE user_id = %s", (user_id,))
    teacher = cursor.fetchone()
    teacher_id = teacher["id"]

    # Fetch bookings for the teacher
    cursor.execute("""
            SELECT
                bookings.id,
                users.username AS user_name,
                bookings.date,
                bookings.start_time,
                bookings.end_time,
                bookings.duration,
                bookings.reservation_time,
                bookings.price,
                subjects.name AS subject,
                subject_level.name AS level
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN subjects ON bookings.subject_id = subjects.id
            JOIN subject_level ON bookings.level_id = subject_level.id
            WHERE bookings.teacher_id = %s
        """, (teacher_id,))
    bookings = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return bookings


def add_booking_model(data, email):
    date = data['date']
    time = data['time']
    teacher_id = data["teacherId"]
    duration = int(data['duration'])

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Calculate end time based on start time and duration
    start_time = datetime.strptime(time, '%H:%M')
    end_time = (start_time + timedelta(minutes=duration)).time()

    # Fetch teacher's information
    cursor.execute("SELECT subject, level_id, price FROM teachers WHERE id = %s", (teacher_id,))
    teacher_info = cursor.fetchone()
    if not teacher_info:
        raise ValueError("Nauczyciel nie istnieje lub jest nieaktywny")
    
    subject_id = teacher_info["subject"]
    level_id = teacher_info["level_id"]
    price = teacher_info["price"]

    # Fetch user_id based on email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    user_id = user["id"]

    # Check if the booking already exists
    query = """
        SELECT * FROM bookings
        WHERE teacher_id = %s AND date = %s
        AND (
            (start_time <= %s AND end_time > %s) OR
            (start_time < %s AND end_time >= %s) OR
            (start_time >= %s AND start_time < %s)
        )
        """
    cursor.execute(query, (teacher_id, date, start_time.time(), start_time.time(),
                               end_time, end_time, start_time.time(), end_time))
    existing_bookings = cursor.fetchall()
    if existing_bookings:
        raise ValueError("Nauczyciel jest już zajęty w tym czasie. Wybierz inny termin")

    # Add new booking if no conflicts
    insert_query = """
        INSERT INTO bookings (teacher_id, user_id, date, start_time, end_time, duration,
        reservation_time, subject_id, level_id, price)
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s)
        """
    cursor.execute(insert_query, (teacher_id, user_id, date, start_time.time(),
                                      end_time, duration, subject_id, level_id, price))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się dodać rezerwacji. Spróbuj ponownie później.")

    # Add notification for the teacher
    message = "Masz nową rezerwację!"
    cursor.execute("INSERT INTO notifications (user_id, message, created_at) VALUES ((SELECT user_id FROM teachers WHERE id = %s), %s, NOW())", (teacher_id, message))
    conn.commit()

    cursor.close()
    conn.close()
    return "Rezerwacja została dodana pomyślnie!"


def delete_booking_by_id_model(booking_id, email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user_id based on email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    user_id = user["id"]

    # Delete the booking if it belongs to the user
    cursor.execute("DELETE FROM bookings WHERE id = %s AND user_id = %s", (booking_id, user_id))
    conn.commit()
    if cursor.rowcount == 0:
        raise ValueError("Nie można anulować rezerwacji, ponieważ nie istnieje lub nie należy do Ciebie")

    cursor.close()
    conn.close()
    return "Rezerwacja została anulowana pomyślnie!"


def delete_my_teacher_booking_by_id_model(booking_id, email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user_id based on email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
            return "Nie znaleziono użytkownika"
    user_id = user["id"]

    # Fetch teacher's ID based on user_id
    cursor.execute("SELECT id FROM teachers WHERE user_id= %s", (user_id,))
    teacher = cursor.fetchone()
    if not teacher:
        raise ValueError("Nie jesteś nauczycielem lub nie masz uprawnień do anulowania rezerwacji")
    teacher_id = teacher["id"]

    # Delete the booking if it belongs to the teacher
    cursor.execute("DELETE FROM bookings WHERE id = %s AND teacher_id = %s", (booking_id, teacher_id))
    conn.commit()
    if cursor.rowcount == 0:
        raise ValueError("Nie można anulować rezerwacji, ponieważ nie istnieje lub nie należy do Ciebie")

    cursor.close()
    conn.close()
    return "Rezerwacja została anulowana pomyślnie!" 