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
    return jsonify({'teachers': [{'id': 1, 'name': 'Pan Nowicki', 'subject': 'Germ', 'price': 63}, {'id': 2, 'name': 'Kacper Kubiak', 'subject': 'Phis', 'price': 44}, {'id': 3, 'name': 'Juliusz Lis', 'subject': 'Biol', 'price': 115}, {'id': 4, 'name': 'Joanna Woźniak', 'subject': 'Geog', 'price': 89}, {'id': 5, 'name': 'Kamil Bąk', 'subject': 'Engl', 'price': 92}, {'id': 6, 'name': 'Pan Chmielewski', 'subject': 'Chem', 'price': 104}, {'id': 7, 'name': 'Anna Dąbrowski', 'subject': 'Germ', 'price': 50}, {'id': 8, 'name': 'Juliusz Pietrzak', 'subject': 'Engl', 'price': 84}, {'id': 9, 'name': 'Karolina Jakubowski', 'subject': 'Math', 'price': 41}, {'id': 10, 'name': 'Pan Dąbrowski', 'subject': 'Math', 'price': 122}, {'id': 11, 'name': 'Kacper Kaźmierczak', 'subject': 'Math', 'price': 142}, {'id': 12, 'name': 'Krzysztof Jakubowski', 'subject': 'Germ', 'price': 105}, {'id': 13, 'name': 'Kuba Pietrzak', 'subject': 'Biol', 'price': 51}, {'id': 14, 'name': 'Klaudia Dąbrowski', 'subject': 'Geog', 'price': 149}, {'id': 15, 'name': 'Kamila Stępień', 'subject': 'Chem', 'price': 54}, {'id': 16, 'name': 'Anna Krajewski', 'subject': 'Chem', 'price': 113}, {'id': 17, 'name': 'Anna Kalinowski', 'subject': 'Germ', 'price': 134}, {'id': 18, 'name': 'Janusz Jakubowski', 'subject': 'Phis', 'price': 69}, {'id': 19, 'name': 'Tadeusz Grabowski', 'subject': 'Germ', 'price': 87}, {'id': 20, 'name': 'Janusz Sikora', 'subject': 'Engl', 'price': 102}, {'id': 21, 'name': 'Anna Sobczak', 'subject': 'Chem', 'price': 157}, {'id': 22, 'name': 'Pan Ostrowski', 'subject': 'Biol', 'price': 103}, {'id': 23, 'name': 'Janusz Gajewski', 'subject': 'Phis', 'price': 97}, {'id': 24, 'name': 'Karolina Nowicki', 'subject': 'Biol', 'price': 127}, {'id': 25, 'name': 'Paweł Zawadzki', 'subject': 'Math', 'price': 55}, {'id': 26, 'name': 'Kamila Dąbrowski', 'subject': 'Math', 'price': 52}, {'id': 27, 'name': 'Tadeusz Kamiński', 'subject': 'Germ', 'price': 105}, {'id': 28, 'name': 'Janusz Kamiński', 'subject': 'Math', 'price': 142}, {'id': 29, 'name': 'Karolina Tomaszewski', 'subject': 'Biol', 'price': 47}, {'id': 30, 'name': 'Piotr Zalewski', 'subject': 'Germ', 'price': 99}, {'id': 31, 'name': 'Karolina Rutkowski', 'subject': 'Germ', 'price': 150}, {'id': 32, 'name': 'Krzysiek Zając', 'subject': 'Math', 'price': 156}, {'id': 33, 'name': 'Kamil Sobczak', 'subject': 'Geog', 'price': 41}, {'id': 34, 'name': 'Kacper Szewczyk', 'subject': 'Engl', 'price': 81}, {'id': 35, 'name': 'Klaudia Szczepański', 'subject': 'Germ', 'price': 48}, {'id': 36, 'name': 'Karolina Głowacki', 'subject': 'Phis', 'price': 98}, {'id': 37, 'name': 'Piotr Krawczyk', 'subject': 'Geog', 'price': 99}, {'id': 38, 'name': 'Janusz Wilk', 'subject': 'Geog', 'price': 144}, {'id': 39, 'name': 'Krzysztof Górski', 'subject': 'Chem', 'price': 134}, {'id': 40, 'name': 'Tadeusz Szczepański', 'subject': 'Chem', 'price': 91}, {'id': 41, 'name': 'Kamil Wojciechowski', 'subject': 'Math', 'price': 41}, {'id': 42, 'name': 'Kamil Marciniak', 'subject': 'Germ', 'price': 154}, {'id': 43, 'name': 'Juliusz Sadowski', 'subject': 'Chem', 'price': 44}, {'id': 44, 'name': 'Juliusz Kubiak', 'subject': 'Geog', 'price': 91}, {'id': 45, 'name': 'Krzysztof Górski', 'subject': 'Biol', 'price': 44}, {'id': 46, 'name': 'Krzysiek Walczak', 'subject': 'Phis', 'price': 63}, {'id': 47, 'name': 'Krzysztof Laskowski', 'subject': 'Chem', 'price': 119}, {'id': 48, 'name': 'Kamil Sikorski', 'subject': 'Biol', 'price': 86}, {'id': 49, 'name': 'Marek Urbański', 'subject': 'Phis', 'price': 121}, {'id': 50, 'name': 'Adam Kaczmarek', 'subject': 'Phis', 'price': 46}]}), 200

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
    
        

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)