from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import mysql.connector
import jwt
from datetime import datetime, timedelta
import bcrypt
import static

app = Flask(__name__, static_folder='dist', static_url_path='')
app.secret_key = '0123456789'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['UPLOAD_FOLDER'] = 'uploads/'
CORS(app, supports_credentials=True)


@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/uploads/<filename>')
def upload_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Funkcja do uzyskania połączenia z bazą danych MySQL
def get_mysql_connection():
    return mysql.connector.connect(
        host=static.dbhost,
        user=static.dbuser,
        password=static.dbpassword,
        database=static.dbdatabase
    )


@app.route('/check_login', methods=['GET'])
def check_login():
    if session.get('logged_in'):
        return jsonify({'logged_in': True, 'email': session['email']}), 200
    else:
        return jsonify({'logged_in': False}), 200
     

@app.route('/get_teachers', methods=['GET'])
def teachers():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        # Zmodyfikowane zapytanie SQL, aby pobrać nazwę przedmiotu
        cursor.execute("""
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
        """)
        
        teachers = cursor.fetchall()  # Pobranie wszystkich wierszy z wyniku zapytania
        teachers_data = []
        
        for teacher in teachers:
            teacher_dict = {
                "id": teacher["id"],
                "name": teacher["name"],
                "bio": teacher["bio"],
                "email": teacher["email"],
                "description": teacher["description"],
                "image": teacher["avatar"],
                "subject": teacher["subject_name"],
                "level": teacher["level"],
                "price": teacher["price"],
                "rating": teacher["rating"]
            }
            teachers_data.append(teacher_dict)
        
        conn.close()
        return jsonify({'teachers': teachers_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
        

    
    
@app.route('/availability', methods=['GET'])
def availability():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            user_id = user['id']
            cursor.execute("SELECT * FROM availability WHERE user_id = %s", (user_id,))
            availability = cursor.fetchall()
            availability_data = {}
            for day in range(1, 8):
                availability_data[str(day)] = []
            for entry in availability:
                availability_data[str(entry['day'])].append(str(entry['hour']))
            conn.close()
            return jsonify({'availability': availability_data}), 200
        else:
            conn.close()
            return jsonify({'message': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401

@app.route('/update_availability', methods=['PUT'])
def update_availability():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        data = request.get_json()
        parsed_data = {}
        for entry in data['selected']:
            day, hour = entry.split('-')
            if day not in parsed_data:
                parsed_data[day] = []
            parsed_data[day].append(hour)

        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            user_id = user[0]
            #cursor.execute("DELETE FROM availability WHERE user_id = %s", (user_id,))
            for day, hours in parsed_data.items():
                for hour in hours:
                    cursor.execute(
                        "INSERT INTO availability (user_id, day, hour) VALUES (%s, %s, %s)",
                        (user_id, day, hour)
                    )
            conn.commit()
            conn.close()
            return jsonify({'message': 'Availability updated'}), 200
        else:
            conn.close()
            return jsonify({'message': 'User not found'}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401

@app.route('/delete_availability', methods=['DELETE'])
def delete_availability():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            user_id = user[0]
            cursor.execute("DELETE FROM availability WHERE user_id = %s", (user_id,))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Availability deleted'}), 200
        else:
            conn.close()
            return jsonify({'message': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401


@app.route('/get_profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()
        if user:
            return jsonify({'user': user}), 200
        else:
            return jsonify({'message': 'Brak użytkownika w bazie danych'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401


def generate_token(email,role):
   payload = {
       'email': email,
       'role': role,
       'exp': datetime.utcnow() + timedelta(days=1)
   }
   return jwt.encode(payload, app.secret_key, algorithm='HS256')

@app.route("/login", methods=["POST"])
def login():
    response = request.get_json()
    email = response.get("email")
    password = response.get("password")

    if not email or not password:
        return jsonify({"message": "Wymagane jest podanie emaila i hasła"}), 400

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Pobieranie hash hasła i roli użytkownika na podstawie emaila
        cursor.execute("SELECT password, role_id FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()

        if not result:
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400

        hashed_password, role = result

        # Sprawdzenie, czy konto jest zablokowane
        if role == 4:
            conn.close()
            return jsonify({"message": "Konto zablokowane"}), 400

        # Porównanie hasła z hashem
        if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
            token = generate_token(email, role)
            conn.close()
            return jsonify({'message': 'Zalogowano', 'token': token, 'role': role}), 200
        else:
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "Wystąpił błąd podczas logowania"}), 500
    

@app.route("/register", methods=["POST"])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    confirmPassword = request.form.get('confirmPassword')

    avatar = request.files.get('avatar')
    if avatar:
        avatar_filename = 'default_avatar.png'
    else:
        avatar_filename = 'default_avatar.png'

    registration_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    role_id = 3

    # Sprawdzamy, czy hasła są zgodne
    if password == confirmPassword:
        try:
            conn = get_mysql_connection()
            cursor = conn.cursor()

            # Sprawdzamy, czy użytkownik o podanym emailu już istnieje
            cursor.execute("SELECT COUNT(*) FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()[0]
            if user:
                result = jsonify({"message": "Użytkownik o podanym adresie email już istnieje"}), 400
            else:
                password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                cursor.execute(
                    '''INSERT INTO users (username, email, password, registration_date, avatar, role_id)
                    VALUES (%s, %s, %s, %s, %s, %s)''',
                    (username, email, password, registration_date, avatar_filename, role_id))
                conn.commit()

                # Pobieramy ID użytkownika, który właśnie został zapisany
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                user_id = cursor.fetchone()[0]

                # Jeśli użytkownik przesłał avatar, zapisujemy go z unikalną nazwą
                if avatar:
                    avatar_filename = save_file(avatar, user_id)
                    cursor.execute("UPDATE users SET avatar = %s WHERE id = %s", (avatar_filename, user_id))
                    conn.commit()

                # Generujemy token dla użytkownika
                token = generate_token(email, role_id)
                result = jsonify({"message": "Zarejestrowano poprawnie", "token": token, "role": role_id}), 201
            conn.close()
            return result
        except Exception as e:
            print(e)
            return jsonify({"message": "Wystąpił błąd podczas rejestracji"}), 500
    else:
        return jsonify({"message": "Hasła się nie zgadzają"}), 400

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401

    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        # Invalidate the token by removing the session
        session.pop('logged_in', None)
        session.pop('email', None)

        return jsonify({'message': 'Wylogowano'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401


@app.route("/get_about/<int:teacher_id>", methods=["GET"])
def about(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Zmodyfikowane zapytanie, aby pobrać nazwę przedmiotu
        cursor.execute("""
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
        """, (teacher_id,))
        
        teacher = cursor.fetchone()
        profile_picture_url = f'{static.localhost}/uploads/{teacher["avatar"]}' if teacher["avatar"] else None
        teacher_dict = {
            "id": teacher["id"],
            "name": teacher["name"],
            "bio": teacher["bio"],
            "email": teacher["email"],
            "description": teacher["description"],
            "image": profile_picture_url,
            "subject": teacher["subject_name"],
            "level": teacher["level"],
            "price": teacher["price"],
            "rating": teacher["rating"],
            "ratingCount": teacher["rating_count"]
        }
        conn.close()
        print(teacher_dict)
        return jsonify({'teacher': teacher_dict}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401


@app.route("/get_reviews/<int:teacher_id>", methods=["GET"])
def get_reviews(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
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
        conn.close()
        reviews_data = []
        for review in reviews:
            review_dict = {
                "id": review["id"],
                "rating": review["rating"],
                "comment": review["comment"],
                "createdAt": review["created_at"],
                "username": review["username"]
            }
            reviews_data.append(review_dict)

        return jsonify({'reviews': reviews_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    


@app.route("/favourite/<int:teacher_id>", methods=["PUT"])
def add_favourite(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM favourite WHERE teacher_id = %s AND user_id = (SELECT id FROM users WHERE email = %s)", (teacher_id, email))
        favourite = cursor.fetchone()[0]
        if favourite == 1:
            cursor.execute("DELETE FROM favourite WHERE teacher_id = %s AND user_id = (SELECT id FROM users WHERE email = %s)", (teacher_id, email))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Nauczyciel usunięty z ulubionych'}), 200
        else:
            cursor.execute("INSERT INTO favourite (teacher_id, user_id) VALUES (%s, (SELECT id FROM users WHERE email = %s))", (teacher_id, email))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Nauczyciel dodany do ulubionych'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401

@app.route('/subjects', methods=['GET'])
def get_subjects():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM subjects")
        subjects = cursor.fetchall()
        subjects_data = []
        for subject in subjects:
            subject_dict = {
                "id": subject["id"],
                "name": subject["name"]
            }
            subjects_data.append(subject_dict)
        conn.close()
        return jsonify({'subjects': subjects_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    
# Funkcja do zapisania przesłanego pliku z unikalną nazwą zawierającą ID użytkownika
def save_file(file, user_id):
    if file:
        # Pobranie rozszerzenia pliku
        file_extension = os.path.splitext(secure_filename(file.filename))[1]
        # Generowanie nazwy pliku na podstawie ID użytkownika
        unique_filename = f"avatar_{user_id}{file_extension}"

        # Ścieżka do zapisu
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

        # Zapis pliku
        file.save(save_path)
        return unique_filename
    else:
        # Brak pliku - użyj domyślnego zdjęcia
        default_filename = 'default_avatar.png'
        default_file_path = os.path.join(app.config['UPLOAD_FOLDER'], default_filename)
        if not os.path.exists(default_file_path):
            raise FileNotFoundError(f"Domyślne zdjęcie {default_filename} nie istnieje w katalogu {app.config['UPLOAD_FOLDER']}.")
        return default_filename


@app.route('/register_teacher', methods=['POST'])
def register_teacher():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        
        response = request.get_json()
        first_name = response['firstName']
        last_name = response['lastName']
        subject_id = response['subject']
        price = response['price']
        level_id = response['level']
        status = 0
        rating = 0
        
        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Pobierz ID użytkownika
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]

        # Sprawdzanie, czy nauczyciel jest już zarejestrowany
        cursor.execute("SELECT COUNT(*) FROM teachers WHERE user_id = %s", (user_id,))
        teacher = cursor.fetchone()[0]
        if teacher:
            conn.close()
            return jsonify({'message': 'Nauczyciel jest już zarejestrowany'}), 400

        cursor.execute("INSERT INTO teachers (name, user_id, subject, level_id, price, rating, status) VALUES (%s, %s, %s, %s, %s, %s, %s)", (first_name + ' ' + last_name, user_id, subject_id, level_id, price, rating, status))

        # Zmiana roli użytkownika na nauczyciela
        cursor.execute("UPDATE users SET role_id = 2 WHERE email = %s", (email,))

        # Zmiana roli w payloadzie
        payload['role'] = 2

        # Pobieranie roli
        role = payload['role']
        conn.commit()
        conn.close()

        return jsonify({'message': 'Nauczyciel zarejestrowany', 'role': role}), 201
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas rejestracji nauczyciela'}), 500
    



@app.route('/get_user_info', methods=['GET'])
def get_info_user():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        avatar = user['avatar']
        # Get user avatar
        if avatar:
            user['avatar'] = f'{static.localhost}/uploads/{avatar}?{datetime.now().timestamp()}'
        else:
            user['avatar'] = None

        conn.close()
        if user:
            return jsonify({'user': user}), 200
        else:
            return jsonify({'message': 'Brak użytkownika w bazie danych'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401


@app.route('/get_total_info', methods=['GET'])
def get_total_info():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) AS total_users FROM users;")
        total_users = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) AS total_teachers FROM teachers WHERE status = 1;")
        total_teachers = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) AS total_subjects FROM subjects;")
        total_subjects = cursor.fetchone()

        info = {
            "totalUsers": total_users['total_users'],
            "totalTeachers": total_teachers['total_teachers'],
            "totalCourses": total_subjects['total_subjects']
        }
        conn.close()
        return jsonify({'info': info}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500


@app.route('/booking', methods=['POST'])
def booking():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401

    try:
        # Dekodowanie tokena i pobranie adresu email
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        # Pobieranie danych z zapytania POST
        response = request.get_json()
        date = response['date']
        time = response['time']
        teacher_id = response["teacherId"]
        duration = int(response['duration'])

        # Obliczanie czasu zakończenia zajęć na podstawie czasu rozpoczęcia i długości
        start_time = datetime.strptime(time, '%H:%M')
        end_time = (start_time + timedelta(minutes=duration)).time()

        # Połączenie z bazą danych
        conn = get_mysql_connection()
        cursor = conn.cursor()

        #Pobranie subject na podstawie teacher_id
        cursor.execute("SELECT subject FROM teachers WHERE id = %s", (teacher_id,))
        subject_id = cursor.fetchone()[0]

        #Pobieranie subject_level na podstawie teacher_id
        cursor.execute("SELECT level_id FROM teachers WHERE id = %s", (teacher_id,))
        level_id = cursor.fetchone()[0]

        #Pobieranie price na podstawie teacher_id
        cursor.execute("SELECT price FROM teachers WHERE id = %s", (teacher_id,))
        price = cursor.fetchone()[0]

        # Pobranie user_id na podstawie adresu email
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'Użytkownik nie znaleziony'}), 404
        
        user_id = user[0]

        # Sprawdzenie, czy istnieje już rezerwacja w tym czasie dla danego nauczyciela
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
            return jsonify({'message': 'Nauczyciel jest już zarezerwowany w tym czasie'}), 400

        # Dodanie nowej rezerwacji, jeśli nauczyciel jest dostępny
        insert_query = """
        INSERT INTO bookings (teacher_id, user_id, date, start_time, end_time, duration,
        reservation_time, subject_id, level_id, price)
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s)
        """
        cursor.execute(insert_query, (teacher_id, user_id, date, start_time.time(),
                                      end_time, duration, subject_id, level_id, price))
        conn.commit()

        # Dodaj powiadomienie do bazy danych dla nauczyciela
        message = "Masz nową rezerwację!"
        cursor.execute("INSERT INTO notifications (user_id, message, created_at) VALUES ((SELECT user_id FROM teachers WHERE id = %s), %s, NOW())", (teacher_id, message))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Rezerwacja została pomyślnie dokonana'}), 201
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500

    

@app.route('/update_profile', methods=['PUT'])
def update_user_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        data = request.get_json()
        new_username = data['username']
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET username = %s WHERE email = %s", (new_username, email))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Profil użytkownika zaktualizowany'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401



@app.route('/change_email', methods=['PUT'])
def change_email():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        data = request.get_json()
        new_email = data['newEmail']
        password = data['password']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Sprawdzenie, czy użytkownik o podanym adresie email istnieje
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = %s", (new_email,))
        user = cursor.fetchone()[0]
        if user:
            conn.close()
            return jsonify({'message': 'Użytkownik o podanym adresie email już istnieje'}), 400

        # Sprawdzenie, czy podane hasło jest poprawne
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()[0]
        if user == 1:
            cursor.execute("UPDATE users SET email = %s WHERE email = %s", (new_email, email))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Adres email zaktualizowany'}), 200
        else:
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400
        
        
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas zmiany adresu email'}), 500
    

@app.route('/delete_account', methods=['DELETE'])
def delete_account():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Usunięcie rezerwacji użytkownika z bazy danych
        cursor.execute("DELETE FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

        # Usunięcie nauczyceiela
        cursor.execute("DELETE FROM teachers WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

        # Usuwanie opinii użytkownika
        cursor.execute("DELETE FROM ratings WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))

        # Usunięcie użytkownika z bazy danych
        cursor.execute("DELETE FROM users WHERE email = %s", (email,))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Konto usunięte'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania konta'}), 500


@app.route('/change_password', methods=['PUT'])
def change_password():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return jsonify({'message': 'Brak autoryzacji'}), 401
    
    try:
        # Dekodowanie tokena
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload.get('email')
        
        # Walidacja danych wejściowych
        data = request.get_json()
        if not data or 'old_password' not in data or 'password' not in data:
            return jsonify({'message': 'Niepoprawne dane wejściowe'}), 400
        
        old_password = data['old_password']
        new_password = data['password']
        
        conn = get_mysql_connection()
        cursor = conn.cursor()
        
        # Pobieranie zahashowanego hasła
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400
        
        hashed_old_password = result[0]
        
        # Sprawdzanie starego hasła
        if not bcrypt.checkpw(old_password.encode('utf-8'), hashed_old_password.encode('utf-8')):
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400
        
        # Hashowanie nowego hasła
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Aktualizacja hasła w bazie danych
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new_password, email))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Hasło zaktualizowane'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas zmiany hasła'}), 500
        

@app.route('/get_my_bookings', methods=['GET'])
def get_my_bookings():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
        SELECT 
            bookings.id,
            teachers.id AS teacher_id,
            teachers.name AS teacher_name,
            subjects.name AS subject,
            subject_level.name AS level,
            bookings.price,
            bookings.date,
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
        bookings_data = []

        for booking in bookings:
            # Konwersja `date` do stringa
            date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

            # Konwersja `start_time` i `end_time` do formatu HH:MM
            start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
            end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None

            # Konwersja `reservation_time` do pełnego formatu daty i czasu
            reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None

            booking_dict = {
                "id": booking["id"],
                "teacher_id": booking["teacher_id"],
                "teacher_name": booking["teacher_name"],
                "date": date_str,
                "start_time": start_time_str,
                "end_time": end_time_str,
                "duration": booking["duration"],
                "reservation_time": reservation_time_str,
                "subject": booking["subject"],
                "price": booking["price"],
                "level": booking["level"],
                "has_rated": booking["has_rated"]
            }
            bookings_data.append(booking_dict)

        conn.close()
        return jsonify({'bookings': bookings_data}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania rezerwacji'}), 500

@app.route('/get_current_bookings', methods=['GET'])
def get_current_bookings():
    # Pobierz przyszłe rez0erwacje na podstawie bieżącej daty
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        # Zmodyfikowane zapytanie z dodatkowym JOIN do tabeli subjects
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
        bookings_data = []

        for booking in bookings:
            # Konwersja `date` do stringa
            date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

            # Konwersja `start_time` i `end_time` do formatu HH:MM
            start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
            end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None

            # Konwersja `reservation_time` do pełnego formatu daty i czasu
            reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None

            booking_dict = {
                "id": booking["id"],
                "teacher_name": booking["teacher_name"],
                "date": date_str,
                "start_time": start_time_str,
                "end_time": end_time_str,
                "duration": booking["duration"],  # Użyj jako liczby minut
                "reservation_time": reservation_time_str,
                "subject": booking["subject"],
                "level": booking["level"],
                "price": booking["price"],
            }
            bookings_data.append(booking_dict)
        conn.close()
        return jsonify({'bookings': bookings_data}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania rezerwacji'}), 500
     

@app.route('/cancel_booking', methods=['DELETE'])
def cancel_booking():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        data = request.get_json()
        booking_id = data['bookingId']
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bookings WHERE id = %s", (booking_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rezerwacja usunięta'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania rezerwacji'}), 500




@app.route('/get_most_popular_teachers', methods=['GET'])
def get_most_popular_teachers():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
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
            ORDER BY teachers.rating DESC 
            LIMIT 5
        """)

        teachers = cursor.fetchall()
        teachers_data = []
        for teacher in teachers:
            # Tworzenie pełnego URL do avataru
            profile_picture_url = f'{static.localhost}/uploads/{teacher["avatar"]}' if teacher["avatar"] else None

            teacher_dict = {
                "id": teacher["id"],
                "name": teacher["name"],
                "bio": teacher["bio"],
                "email": teacher["email"],
                "description": teacher["description"],
                "image": profile_picture_url,
                "subject": teacher["subject_name"],
                "level": teacher["level"],
                "price": teacher["price"],
                "rating": teacher["rating"],
            }
            teachers_data.append(teacher_dict)
        conn.close()
        return jsonify({'teachers': teachers_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500


    

@app.route('/get_users', methods=['GET'])
def get_users():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                users.id,
                users.username,
                users.email,
                users.registration_date,
                roles.role_name AS role
            FROM users
            JOIN roles ON users.role_id = roles.id
            ORDER BY users.id
        """)
        users = cursor.fetchall()
        users_data = []
        for user in users:
            user_dict = {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "registrationDate": user["registration_date"],
                "role": user["role"]
            }
            users_data.append(user_dict)
        conn.close()
        return jsonify({'users': users_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    

@app.route('/get_all_teachers', methods=['GET'])
def get_all_teachers():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
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
        """)
        teachers = cursor.fetchall()
        teachers_data = []
        for teacher in teachers:
            teacher_dict = {
                "id": teacher["id"],
                "name": teacher["name"],
                "email": teacher["email"],
                "bio": teacher["bio"],
                "description": teacher["description"],
                "image": teacher["avatar"],
                "subject": teacher["subject_name"],
                "level": teacher["level"],
                "price": teacher["price"],
                "rating": teacher["rating"],
                "status": teacher["status"]
            }
            teachers_data.append(teacher_dict)
        conn.close()
        return jsonify({'teachers': teachers_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    

@app.route('/get_bookings', methods=['GET'])
def get_bookings():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
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
        bookings_data = []
        for booking in bookings:
            # Konwersja `date` do stringa
            date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

            # Konwersja `start_time` i `end_time` do formatu HH:MM
            start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
            end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None

            # Konwersja `reservation_time` do pełnego formatu daty i czasu
            reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None
            booking_dict = {
                "id": booking["id"],
                "teacher_name": booking["teacher_name"],
                "user_name": booking["user_name"],
                "date": date_str,
                "start_time": start_time_str,
                "end_time": end_time_str,
                "duration": booking["duration"],
                "price": booking["price"],
                "reservation_time": reservation_time_str,
                "subject": booking["subject"],
                "level": booking["level"]
            }
            bookings_data.append(booking_dict)
        conn.close()
        return jsonify({'bookings': bookings_data}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500


@app.route('/rate_teacher/<int:teacher_id>', methods=['POST']) 
def rate_teacher(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        data = request.get_json()
        rating = data['rating']
        comment = data['comment']

        if rating is None:
            return jsonify({'message': 'Rating jest wymagany'}), 400

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Znajdź użytkownika na podstawie emaila
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'Użytkownik nie znaleziony'}), 404
        user_id = user[0]

        # Sprawdzenie, czy użytkownik już ocenił nauczyciela
        cursor.execute("SELECT COUNT(*) FROM ratings WHERE teacher_id = %s AND user_id = %s", (teacher_id, user_id))
        rated = cursor.fetchone()[0]
        if rated:
            return jsonify({'message': 'Nauczyciel został już oceniony'}), 400

        # Dodanie nowej oceny do tabeli `ratings`
        cursor.execute("INSERT INTO ratings (teacher_id, user_id, rating, comment) VALUES (%s, %s, %s, %s)",
                       (teacher_id, user_id, rating, comment))

        # Obliczenie nowej średniej oceny nauczyciela
        cursor.execute("SELECT AVG(rating) FROM ratings WHERE teacher_id = %s", (teacher_id,))
        new_average_rating = cursor.fetchone()[0]
        new_average_rating = round(new_average_rating, 2)

        # Aktualizacja pola `rating` w tabeli `teachers`
        cursor.execute("UPDATE teachers SET rating = %s WHERE id = %s", (new_average_rating, teacher_id))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Ocena dodana'}), 201
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas dodawania oceny'}), 500

@app.route('/get_my_teacher_profile', methods=['GET'])
def get_my_teacher_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
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
        """, (email,))

        teacher_profile = cursor.fetchone()
        if not teacher_profile:
            return jsonify({'message': 'Nauczyciel nie znaleziony'}), 404
        

        teacher_profile_data = {
            "id": teacher_profile["id"],
            "name": teacher_profile["name"],
            "bio": teacher_profile["bio"],
            "email": teacher_profile["email"],
            "description": teacher_profile["description"],
            "subject": teacher_profile["subject_name"],
            "level": teacher_profile["level"],
            "price": teacher_profile["price"],
            "rating": teacher_profile["rating"],
            "status": teacher_profile["status"]
        }

        conn.close()
        return jsonify({'teacher': teacher_profile_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500

@app.route('/get_my_teacher_bookings', methods=['GET'])
def get_my_teacher_bookings():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        # Pobieranie user_id na podstawie adresu email
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'Użytkownik nie znaleziony'}), 404
        user_id = user["id"]


        # pobieranie id nauczyciela na podstawie adresu email
        cursor.execute("SELECT id FROM teachers WHERE user_id = %s", (user_id,))
        teacher = cursor.fetchone()
        if not teacher:
            return jsonify({'message': 'Nauczyciel nie znaleziony'}), 404
        teacher_id = teacher["id"]

        # Pobieranie rezerwacji nauczyciela
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
        bookings_data = []
        for booking in bookings:
            # Konwersja `date` do stringa
            date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

            # Konwersja `start_time` i `end_time` do formatu HH:MM
            start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
            end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None

            # Konwersja `reservation_time` do pełnego formatu daty i czasu
            reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None

            booking_dict = {
                "id": booking["id"],
                "user_name": booking["user_name"],
                "date": date_str,
                "start_time": start_time_str,
                "end_time": end_time_str,
                "duration": booking["duration"],
                "reservation_time": reservation_time_str,
                "price": booking["price"],
                "subject": booking["subject"],
                "level": booking["level"]
            }
            bookings_data.append(booking_dict)
        conn.close()
        return jsonify({'bookings': bookings_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    
@app.route('/cancel_my_teacher_booking/<int:booking_id>', methods=['DELETE'])
def cancel_my_teacher_booking(booking_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        conn = get_mysql_connection()
        cursor = conn.cursor()
    
        #Pobieranie user_id na podstawie email
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'Użytkownik nie znaleziony'}), 404
        user_id = user[0]

        # Pobieranie id nauczyciela na podstawie user_id
        cursor.execute("SELECT id FROM teachers WHERE user_id= %s", (user_id,))
        teacher = cursor.fetchone()
        if not teacher:
            return jsonify({'message': 'Nauczyciel nie znaleziony'}), 404
        teacher_id = teacher[0]

        # Usuwanie rezerwacji nauczyciela
        cursor.execute("DELETE FROM bookings WHERE id = %s AND teacher_id = %s", (booking_id, teacher_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rezerwacja usunięta'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania rezerwacji'}), 500


@app.route('/update_my_teacher_profile', methods=['PUT'])
def update_my_teacher_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1 and role != 2:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        email = payload['email']
        data = request.get_json()
        name = data['name']
        new_bio = data['bio']
        new_description = data['description']
        new_price = data['price']
        subject_name = data['subject']
        level = data['level']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Pobieranie id dla subject
        cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject_name,))
        subject_id = cursor.fetchone()[0]

        # Pobieranie id dla level
        cursor.execute("SELECT id FROM subject_level WHERE name = %s", (level,))
        level_id = cursor.fetchone()[0]

        # Pobieranie id usera
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'Nauczyciel nie znaleziony'}), 404
        user_id = user[0]
        
        cursor.execute("UPDATE teachers SET name = %s, bio = %s, description = %s, price = %s, subject = %s, level_id = %s WHERE user_id = %s",
                       (name, new_bio, new_description, new_price, subject_id, level_id, user_id))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Profil nauczyciela zaktualizowany'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas aktualizacji profilu nauczyciela'}), 500


@app.route('/get_roles', methods=['GET'])
def get_roles():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM roles")
        roles = cursor.fetchall()
        roles_data = []
        for role in roles:
            role_dict = {
                "id": role["id"],
                "name": role["role_name"]
            }
            roles_data.append(role_dict)
        conn.close()
        return jsonify({'roles': roles_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas aktualizacji profilu nauczyciela'}), 500


@app.route('/change_role', methods=['PUT'])
def change_role():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
    
        data = request.get_json()
        user_id = data['user_id']
        role_name = data['role']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM roles WHERE role_name = %s", (role_name,))
        new_role = cursor.fetchone()[0]


        cursor.execute("UPDATE users SET role_id = %s WHERE id = %s", (new_role, user_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rola użytkownika zaktualizowana'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas aktualizacji roli użytkownika'}), 500
        
@app.route('/change_status_teacher/<int:teacher_id>', methods=['PUT'])
def change_status_teacher(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403

        conn = get_mysql_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE teachers SET status = NOT status WHERE id = %s", (teacher_id,))
        conn.commit()

        # Dodaj powiadomienie dla nauczyciela
        cursor.execute("SELECT user_id FROM teachers WHERE id = %s", (teacher_id,))
        user_id = cursor.fetchone()[0]
        cursor.execute("SELECT status FROM teachers WHERE id = %s", (teacher_id,))
        status = cursor.fetchone()[0]
        if status == 1:
            cursor.execute("INSERT INTO notifications (user_id, message) VALUES (%s, 'Twoje konto nauczycielskie zostało aktywowane')", (user_id,))
        else:
            cursor.execute("INSERT INTO notifications (user_id, message) VALUES (%s, 'Twoje konto nauczycielskie zostało zdezaktywowane')", (user_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Pomyślnie zmieniono status nauczyciela'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas akceptacji nauczyciela'}), 500



@app.route('/delete_teacher/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Usunięcie wszystkich rezerwacji nauczyciela
        cursor.execute("DELETE FROM bookings WHERE teacher_id = %s", (teacher_id,))

        # Usunięcie wszystkich ocen nauczyciela
        cursor.execute("DELETE FROM ratings WHERE teacher_id = %s", (teacher_id,))

        # Dodaj powiadomienie dla nauczyciela
        cursor.execute("INSERT INTO notifications (user_id, message) VALUES ((SELECT user_id FROM teachers WHERE id = %s), 'Twoje konto nauczycielskie zostało usunięte')", (teacher_id ,))
        
        # Ustawienie roli użytkownika jako user
        cursor.execute("UPDATE users SET role_id = 3 WHERE email = (SELECT email FROM teachers WHERE id = %s)", (teacher_id,))
        
        # Usunięcie nauczyciela
        cursor.execute("DELETE FROM teachers WHERE id = %s", (teacher_id,))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Nauczyciel usunięty'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania nauczyciela'}), 500


@app.route('/get_all_subjects', methods=['GET'])
def get_all_subjects():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM subjects")
        subjects = cursor.fetchall()
        subjects_data = []
        for subject in subjects:
            subject_dict = {
                "id": subject["id"],
                "name": subject["name"]
            }
            subjects_data.append(subject_dict)
        conn.close()
        return jsonify({'subjects': subjects_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas pobierania danych'}), 500
    

@app.route('/add_subject', methods=['POST'])
def add_subject():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403

        data = request.get_json()
        subject_name = data['subject']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        cursor.execute("INSERT INTO subjects (name) VALUES (%s)", (subject_name,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Przedmiot dodany'}), 201
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas dodawania przedmiotu'}), 500


@app.route('/update_subject', methods=['PUT'])
def update_subject():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403

        data = request.get_json()
        subject_id = data['id']
        new_name = data['subject']

        conn = get_mysql_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE subjects SET name = %s WHERE id = %s", (new_name, subject_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Przedmiot zaktualizowany'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas aktualizacji przedmiotu'}), 500


# @app.route('/change_status_subject', methods=['PUT'])
# def change_status_subject():
#     token = request.headers.get('Authorization')
#     if not token:
#         return jsonify({'message': 'Brak autoryzacji'}), 401
#     try:
#         payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
#         role = payload['role']
#         if role != 1:
#             return jsonify({'message': 'Brak uprawnień'}), 403

#         data = request.get_json()
#         subject_id = data['subject_id']

#         conn = get_mysql_connection()
#         cursor = conn.cursor()

#         # Zmień przedmiot jeśli jest przypisany do nauczyciela
#         cursor.execute("SELECT COUNT(*) FROM teachers WHERE subject = %s", (subject_id,))
#         teacher = cursor.fetchone()[0]
#         if teacher:
#             cursor.execute("UPDATE teachers SET subject = NULL WHERE subject = %s", (subject_id,))

#         # Zmiana statusu przedmiotu
#         cursor.execute("UPDATE subjects SET status = NOT status WHERE id = %s", (subject_id,))
#         conn.commit()
#         conn.close()
#         return jsonify({'message': 'Status przedmiotu zmieniony'}), 200
#     except jwt.ExpiredSignatureError:
#         return jsonify({'message': 'Token wygasł'}), 401
#     except jwt.InvalidTokenError:
#         return jsonify({'message': 'Nieprawidłowy token'}), 401
#     except Exception as e:
#         print(e)
#         return jsonify({'message': 'Wystąpił błąd podczas zmiany statusu przedmiotu'}), 500


@app.route('/get_all_rates', methods=['GET'])
def get_all_rates():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
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
        """)
        rates = cursor.fetchall()
        rates_data = []
        for rate in rates:
            rate_dict = {
                "id": rate["id"],
                "teacher_name": rate["teacher_name"],
                "user_name": rate["user_name"],
                "rating": rate["rating"],
                "comment": rate["comment"],
                "date": rate["date"]
            }
            rates_data.append(rate_dict)
        conn.close()
        return jsonify({'rates': rates_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania przedmiotu'}), 500
    

@app.route('/delete_rate/<int:rate_id>', methods=['DELETE'])
def delete_rate(rate_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        role = payload['role']
        if role != 1:
            return jsonify({'message': 'Brak uprawnień'}), 403
        
        conn = get_mysql_connection()
        cursor = conn.cursor()
        
        # Pobierz aktualną ocene nauczyciela
        cursor.execute("SELECT teacher_id, rating FROM ratings WHERE id = %s", (rate_id,))
        rate = cursor.fetchone()
        teacher_id = rate[0]
        rating = rate[1]

        # Usuń ocene
        cursor.execute("DELETE FROM ratings WHERE id = %s", (rate_id,))
        

        # Zaktualizuj ocene nauczyciela
        cursor.execute("SELECT AVG(rating) FROM ratings WHERE teacher_id = %s", (teacher_id,))
        new_average_rating = cursor.fetchone()[0]
        if new_average_rating is None:
            new_average_rating = 0
        new_average_rating = round(new_average_rating, 2)
        cursor.execute("UPDATE teachers SET rating = %s WHERE id = %s", (new_average_rating, teacher_id))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Ocena usunięta'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token wygasł'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Nieprawidłowy token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Wystąpił błąd podczas usuwania oceny'}), 500


@app.route("/update_avatar", methods=["PUT"])
def update_avatar():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Brak autoryzacji"}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=["HS256"])
        email = payload["email"]
        avatar = request.files.get('avatar')
        if avatar == None:
            return jsonify({"message": "Brak pliku"}), 400

        conn = get_mysql_connection()
        cursor = conn.cursor()

        # Pobierz id użytkownika na podstawie emaila
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]

        if not user_id:
            return jsonify({"message": "Użytkownik nie znaleziony"}), 404
    
        # Zmiana nazwy avatara na unikalną
        if avatar:
            avatar_filename = save_file(avatar, user_id)
        else:
            avatar_filename = 'default_avatar.png'
        

        cursor.execute("UPDATE users SET avatar = %s WHERE email = %s", (avatar_filename, email))
        conn.commit()
        conn.close()
        return jsonify({"message": "Avatar zaktualizowany"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Nieprawidłowy token"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "Wystąpił błąd podczas aktualizacji avatara"}), 500


@app.route("/get_all_levels", methods=["GET"])
def get_all_levels():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Brak autoryzacji"}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=["HS256"])
        role = payload["role"]

        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM subject_level")
        levels = cursor.fetchall()
        levels_data = []
        for level in levels:
            level_dict = {
                "id": level["id"],
                "name": level["name"]
            }
            levels_data.append(level_dict)
        conn.close()
        return jsonify({"levels": levels_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Nieprawidłowy token"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "Wystąpił błąd podczas pobierania danych"}), 500


@app.route("/get_notifications", methods=["GET"])
def get_notifications():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Brak autoryzacji"}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=["HS256"])
        email = payload["email"]

        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "Użytkownik nie znaleziony"}), 404
        user_id = user["id"]

        cursor.execute("SELECT * FROM notifications WHERE user_id = %s", (user_id,))
        notifications = cursor.fetchall()
        notifications_data = []
        for notification in notifications:
            notification_dict = {
                "id": notification["id"],
                "message": notification["message"],
                "created_at": notification["created_at"]
            }
            notifications_data.append(notification_dict)
        conn.close()
        return jsonify({"notifications": notifications_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Nieprawidłowy token"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "Wystąpił błąd podczas pobierania danych"}), 500
        

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    