from app.utils.db import get_mysql_connection


def get_all_rates_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            ratings.id,
            teachers.name AS teacher_name,
            users.username AS user_name,
            ratings.rating,
            ratings.comment,
            ratings.created_at as date
        FROM ratings
        JOIN teachers ON ratings.teacher_id = teachers.id
        JOIN users ON ratings.user_id = users.id
        """
    cursor.execute(query)
    result = cursor.fetchall()

    if not result:
        raise ValueError("Nie znaleziono żadnych ocen")
    
    cursor.close()
    conn.close()
    return result


def get_rates_by_id_model(teacher_id):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    #Fetch reviews for the given teacher_id
    cursor.execute("""
            SELECT 
                ratings.id, 
                ratings.rating, 
                ratings.comment,
                ratings.created_at,
                users.username AS username
            FROM ratings
            JOIN users ON ratings.user_id = users.id
            WHERE ratings.teacher_id = %s
        """, (teacher_id,))
    rates = cursor.fetchall()

    if not rates:
        raise ValueError("Nie znaleziono recenzji dla tego nauczyciela")
    
    cursor.close()
    conn.close()
    return rates


def add_rate_by_id_model(teacher_id, data, email):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch the user ID
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        raise ValueError("Nie znaleziono użytkownika o podanym emailu")
    
    user_id = user['id']

    # Check if the user has already rated the teacher
    cursor.execute("SELECT COUNT(*) FROM ratings WHERE teacher_id = %s AND user_id = %s", (teacher_id, user_id))
    rated = cursor.fetchone()["COUNT(*)"]

    if rated:
        raise ValueError("Nie możesz ocenić tego nauczyciela więcej niż raz")
    
    # Insert the rating
    cursor.execute("INSERT INTO ratings (teacher_id, user_id, rating, comment) VALUES (%s, %s, %s, %s)", (teacher_id, user_id, data['rating'], data['comment']))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się dodać oceny dla nauczyciela")

    # Count new teacher rating 
    cursor.execute("SELECT AVG(rating) FROM ratings WHERE teacher_id = %s", (teacher_id,))
    new_average_rating = cursor.fetchone()["AVG(rating)"]
    new_average_rating = round(new_average_rating, 2)

    # Update the teacher's rating
    cursor.execute("UPDATE teachers SET rating = %s WHERE id = %s", (new_average_rating, teacher_id))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zaktualizować oceny nauczyciela")
    
    cursor.close()
    conn.close()
    return "Ocena dodana pomyślnie"


def delete_rate_by_id_model(rate_id):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    
    # Fetch the teacher ID and rating value
    cursor.execute("SELECT teacher_id FROM ratings WHERE id = %s", (rate_id,))
    rate = cursor.fetchone()

    if not rate:
        raise ValueError("Nie znaleziono oceny o podanym ID")
    
    teacher_id = rate[0]

    # Delete the rate
    cursor.execute("DELETE FROM ratings WHERE id = %s", (rate_id,))

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się usunąć oceny")

    # Recalculate the average rating for the teacher
    cursor.execute("SELECT AVG(rating) FROM ratings WHERE teacher_id = %s", (teacher_id,))
    new_average_rating = cursor.fetchone()[0]
    if new_average_rating is None:
        new_average_rating = 0
    new_average_rating = round(new_average_rating, 2)

    # Update the teacher's rating
    cursor.execute("UPDATE teachers SET rating = %s WHERE id = %s", (new_average_rating, teacher_id))
    conn.commit()
    cursor.close()
    conn.close()
    return "Ocena usunięta pomyślnie"