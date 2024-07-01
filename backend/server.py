from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_cors import CORS
import sqlite3
import jwt
from datetime import datetime, timedelta


app = Flask(__name__)
app.secret_key = '0123456789'
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app, supports_credentials=True)


@app.route('/check_login', methods=['GET'])
def check_login():
    if session.get('logged_in'):
        return jsonify({'logged_in': True, 'email': session['email']}), 200
    else:
        return jsonify({'logged_in': False}), 200
    

@app.route('/teachers', methods=['GET'])
def teachers():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teachers")
    teachers = cursor.fetchall()  # Pobranie wszystkich wierszy z wyniku zapytania
    teachers_data = []
    for teacher in teachers:
        teacher_dict = {
            "id": teacher[0],
            "name": teacher[1],
            "bio": teacher[2],
            "email": teacher[3],
            "description": teacher[4],
            "profilePicture": teacher[5],
            "subject": teacher[6],
            "price": teacher[7],
            "rating": teacher[8]
        }
        teachers_data.append(teacher_dict)
    conn.close()
    return jsonify({'teachers': teachers_data}), 200

        
@app.route('/availability', methods=['GET'])
def availability():
    return jsonify({'availability': [{'day': '01.01.2024', 'hours': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']}, {'day': '02.01.2024', 'hours': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']}, {'day': '03.01.2024', 'hours': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']}]}), 200


@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Brak autoryzacji'}), 401
    try:
        payload = jwt.decode(token.split()[1], app.secret_key, algorithms=['HS256'])
        email = payload['email']

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
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

def generate_token(email):
   payload = {
       'email': email,
       'exp': datetime.utcnow() + timedelta(days=1)  # Token wygasa po 1 dniu
   }
   return jwt.encode(payload, app.secret_key, algorithm='HS256')

@app.route("/login", methods=["POST"])
def login():
    response = request.get_json()
    email = response["email"]
    password = response["password"]

    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()[0]
        #print(user)
    
        if user == 1:
            token = generate_token(email)
            conn.close()
            return jsonify({'message': 'Zalogowano', 'token': token})
        else:
            conn.close()
            return jsonify({"message": "Niepoprawne dane logowania"}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "Wystąpił błąd podczas logowania"}) 


@app.route("/register", methods=["POST"])
def register():
    response = request.get_json()
    username = response["username"]
    email = response["email"]
    password = response["password"]
    confirmPassword = response["confirmPassword"]
    #print(f"username: {username}, email: {email}, password: {password}, confirmPassword: {confirmPassword}")
    
    if password == confirmPassword:
        try:
            conn = sqlite3.connect("database.db")
            cursor = conn.cursor()
            cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)")

            cursor.execute("SELECT COUNT(*) FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()[0]
            #print(user)
            if (user):
                result = jsonify({"message": "Użytkownik o podanym adresie email już istnieje"}), 400
            else:    
                cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
                conn.commit()
                result = jsonify({"message": "Zarejestrowano poprawnie"}), 200
            conn.close()
            return result
        
        except Exception as e:
            print(e)
            return jsonify({"message": "Wystąpił błąd podczas rejestracji"}), 500
    

# Dodaj nowy endpoint do wylogowywania
@app.route("/logout")
def logout():
    # Usuń sesję po wylogowaniu
    session.pop('email', None)
    return redirect(url_for('home'))  # Przekierowanie na stronę główną po wylogowaniu


@app.route("/about/<int:teacher_id>", methods=["GET"])
def about(teacher_id):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teachers WHERE id = ?", (teacher_id,))
    teacher = cursor.fetchone()
    teacher_dict = {
        "id": teacher[0],
        "name": teacher[1],
        "bio": teacher[2],
        "email": teacher[3],
        "description": teacher[4],
        "profilePicture": teacher[5],
        "subject": teacher[6],
        "price": teacher[7],
        "rating": teacher[8]
    }
    conn.close()
    return jsonify(teacher_dict), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    