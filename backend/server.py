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
    return jsonify({'teachers': [{'id': 1, 'name': 'Tadeusz Zieliński', 'subject': 'Chem', 'price': 73, 'rating': '4'}, {'id': 2, 'name': 'Klaudia Szymczak', 'subject': 'Chem', 'price': 151, 'rating': '4'}, {'id': 3, 'name': 'Karolina Wójcik', 'subject': 'Germ', 'price': 120, 'rating': '4'}, {'id': 4, 'name': 'Kamila Tomaszewski', 'subject': 'Chem', 'price': 148, 'rating': '3'}, {'id': 5, 'name': 'Klaudia Zalewska', 'subject': 'Germ', 'price': 65, 'rating': '5'}, {'id': 6, 'name': 'Kamil Sokołowski', 'subject': 'Chem', 'price': 139, 'rating': '2'}, {'id': 7, 'name': 'Marek Wojciechowski', 'subject': 'Biol', 'price': 87, 'rating': '3'}, 
{'id': 8, 'name': 'Janusz Nowicki', 'subject': 'Germ', 'price': 131, 'rating': '4'}, {'id': 9, 'name': 'Janusz Makowski', 'subject': 'Biol', 'price': 42, 'rating': '3'}, {'id': 10, 'name': 'Janusz Nowak', 'subject': 'Engl', 'price': 99, 'rating': '4'}, {'id': 11, 'name': 'Kuba Sobczak', 'subject': 'Geog', 'price': 122, 'rating': '5'}, {'id': 12, 'name': 'Adam Wiśniewski', 'subject': 'Math', 'price': 125, 'rating': '5'}, {'id': 13, 'name': 'Kamil Michalak', 'subject': 'Germ', 'price': 67, 'rating': '1'}, {'id': 14, 'name': 'Kasia Sobczak', 'subject': 'Phis', 'price': 151, 'rating': '4'}, {'id': 15, 'name': 'Piotr Michalak', 'subject': 'Math', 'price': 155, 'rating': '2'}, {'id': 16, 'name': 'Kacper Sikorski', 'subject': 'Math', 'price': 56, 'rating': '2'}, {'id': 17, 'name': 'Paweł Witkowski', 'subject': 'Geog', 'price': 135, 'rating': '2'}, {'id': 18, 'name': 'Klaudia Sikorska', 'subject': 'Math', 'price': 101, 'rating': '1'}, {'id': 19, 'name': 'Kamil Przybylski', 'subject': 'Math', 'price': 151, 'rating': '3'}, {'id': 20, 'name': 'Joanna Michalak', 'subject': 'Geog', 'price': 66, 'rating': '3'}, {'id': 21, 'name': 'Krzysiek Urbański', 'subject': 'Geog', 'price': 71, 'rating': '3'}, {'id': 22, 'name': 'Adam Borkowski', 'subject': 'Phis', 'price': 100, 'rating': '5'}, {'id': 23, 'name': 'Klaudia Kwiatkowski', 'subject': 'Germ', 'price': 76, 'rating': '4'}, {'id': 24, 'name': 'Krzysztof Sawicki', 'subject': 'Germ', 'price': 149, 'rating': '3'}, {'id': 25, 'name': 'Kacper Zieliński', 'subject': 'Math', 'price': 138, 'rating': '4'}, {'id': 26, 'name': 'Karolina Jasiński', 'subject': 'Phis', 'price': 49, 'rating': '5'}, {'id': 27, 'name': 'Kuba Piotrowski', 'subject': 'Biol', 'price': 89, 'rating': '2'}, {'id': 28, 'name': 'Juliusz Gajewski', 'subject': 'Engl', 'price': 65, 'rating': '5'}, {'id': 29, 'name': 
'Paweł Tomaszewski', 'subject': 'Engl', 'price': 94, 'rating': '2'}, {'id': 30, 'name': 'Juliusz Nowak', 'subject': 'Germ', 'price': 94, 'rating': '5'}]}), 200

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
    app.run(host="0.0.0.0", port=5000, debug=True)
    