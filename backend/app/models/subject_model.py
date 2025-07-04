from app.utils.db import get_mysql_connection


def get_all_subjects_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all subjects from the database
    cursor.execute("SELECT * FROM subjects")
    all_subjects = cursor.fetchall()

    if not all_subjects:
        raise ValueError("Nie znaleziono żadnych przedmiotów")
    
    cursor.close()
    conn.close()
    return all_subjects


def get_all_levels_model():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all levels from the database
    cursor.execute("SELECT * FROM subject_level")
    all_levels = cursor.fetchall()

    if not all_levels:
        raise ValueError("Nie znaleziono żadnych poziomów")

    cursor.close()
    conn.close()
    return all_levels


def add_subject_model(data):
    subject_name = data['subject']
    conn = get_mysql_connection()
    cursor = conn.cursor()

    # Insert the new subject into the database
    cursor.execute("INSERT INTO subjects (name, status) VALUES (%s, 'active')", (subject_name,))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się dodać przedmiotu")

    cursor.close()
    conn.close()
    return "Przedmiot dodany pomyślnie"


def update_subject_model(data):
    subject_id = data['id']
    new_name = data['subject']
    conn = get_mysql_connection()
    cursor = conn.cursor()

    #Update the subject in the database
    cursor.execute("UPDATE subjects SET name = %s WHERE id = %s", (new_name, subject_id))
    conn.commit()

    if cursor.rowcount == 0:
        raise ValueError("Nie udało się zaktualizować przedmiotu")

    cursor.close()
    conn.close()
    return "Przedmiot zaktualizowany pomyślnie"