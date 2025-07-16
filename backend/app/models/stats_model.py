from app.utils.db import get_mysql_connection


def get_total_info_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    stats = []

    # Fetch total number of users
    cursor.execute("SELECT COUNT(*) AS total_users FROM users")
    total_users = cursor.fetchone()

    # Fetch total number of teachers
    cursor.execute("SELECT COUNT(*) AS total_teachers FROM teachers WHERE status = 1;")
    total_teachers = cursor.fetchone()

    # Fetch total number of subjects
    cursor.execute("SELECT COUNT(*) AS total_subjects FROM subjects;")
    total_subjects = cursor.fetchone()

    stats = {
        "totalUsers": total_users['total_users'],
        "totalTeachers": total_teachers['total_teachers'],
        "totalCourses": total_subjects['total_subjects']
    }

    cursor.close()
    conn.close()
    return stats