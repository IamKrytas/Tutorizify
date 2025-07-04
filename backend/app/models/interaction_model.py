from app.utils.db import get_mysql_connection

def get_reviews_model(teacher_id):
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
    reviews = cursor.fetchall()

    if not reviews:
        raise ValueError("Nie znaleziono recenzji dla tego nauczyciela")
    
    cursor.close()
    conn.close()
    return reviews