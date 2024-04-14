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
    return jsonify({'teachers': [
        {'name': 'Kasia Wróbel', 'subject': 'Engl', 'price': 123}, {'name': 'Janusz Krawczyk', 'subject': 'Math', 'price': 157}, {'name': 'Jan Jakubowski', 'subject': 'Chem', 'price': 88}, {'name': 'Piotr Lis', 'subject': 'Engl', 'price': 144}, {'name': 'Krzysztof Włodarczyk', 'subject': 'Chem', 'price': 66}, {'name': 'Paweł Wróbel', 'subject': 'Phis', 'price': 78}, {'name': 'Karolina Kowalski', 'subject': 'Geog', 'price': 100}, {'name': 'Adam Grabowski', 'subject': 'Biol', 'price': 80}, {'name': 'Kacper Bąk', 'subject': 'Math', 'price': 149}, {'name': 'Karolina Górski', 'subject': 'Chem', 'price': 54}, {'name': 'Krzysztof Andrzejewski', 'subject': 'Chem', 'price': 52}, {'name': 'Kamil Baran', 'subject': 'Germ', 'price': 69}, {'name': 'Anna Jakubowski', 'subject': 'Engl', 'price': 74}, {'name': 'Kamil Szewczyk', 'subject': 'Chem', 'price': 102}, {'name': 'Klaudia Zakrzewski', 'subject': 'Geog', 'price': 139}, {'name': 'Kamila Maciejewski', 'subject': 'Engl', 'price': 128}, {'name': 'Marek Sikora', 'subject': 'Math', 'price': 71}, {'name': 'Krzysiek Jakubowski', 'subject': 'Chem', 'price': 66}, {'name': 'Anna Woźniak', 'subject': 'Engl', 'price': 155}, {'name': 'Kamil Sikorski', 'subject': 'Biol', 'price': 158}, {'name': 'Tadeusz Lis', 'subject': 'Chem', 'price': 116}, {'name': 'Piotr Nowicki', 'subject': 'Biol', 'price': 142}, {'name': 'Karolina Jankowski', 'subject': 'Biol', 'price': 119}, {'name': 'Anna Sawicki', 'subject': 'Phis', 'price': 125}, {'name': 'Kamila Makowski', 'subject': 'Math', 'price': 45}, {'name': 'Kacper Kołodziej', 'subject': 'Phis', 'price': 55}, {'name': 'Adam Nowakowski', 'subject': 'Germ', 'price': 101}, {'name': 'Anna Nowicki', 'subject': 'Geog', 'price': 135}, {'name': 'Adam Przybylski', 'subject': 'Phis', 'price': 90}, {'name': 'Krzysztof Baranowski', 'subject': 'Math', 'price': 73}, {'name': 'Juliusz Maciejewski', 'subject': 'Engl', 'price': 115}, {'name': 'Piotr Lis', 'subject': 'Math', 'price': 91}, {'name': 'Krzysiek Kubiak', 'subject': 'Geog', 'price': 48}, {'name': 'Piotr Sikora', 'subject': 'Phis', 'price': 142}, {'name': 'Marek Sadowski', 'subject': 'Biol', 'price': 108}, {'name': 'Adam Mazur', 'subject': 'Chem', 'price': 102}, {'name': 'Klaudia Wójcik', 'subject': 'Math', 'price': 95}, {'name': 'Piotr Makowski', 'subject': 'Math', 'price': 114}, {'name': 'Paweł Zakrzewski', 'subject': 'Engl', 'price': 123}, {'name': 'Marek Zając', 'subject': 'Biol', 'price': 49}, {'name': 'Joanna Makowski', 'subject': 'Chem', 'price': 109}, {'name': 'Krzysiek Kaźmierczak', 'subject': 'Geog', 'price': 53}, {'name': 'Karolina Szewczyk', 'subject': 'Chem', 'price': 98}, {'name': 'Krzysztof Kowalczyk', 'subject': 'Germ', 'price': 88}, {'name': 'Jan Bąk', 'subject': 'Engl', 'price': 119}, {'name': 'Karolina Andrzejewski', 'subject': 'Germ', 'price': 144}, {'name': 'Janusz Jakubowski', 'subject': 'Math', 'price': 111}, {'name': 'Krzysztof Sikora', 'subject': 'Germ', 'price': 63}, {'name': 'Piotr Wójcik', 'subject': 'Engl', 'price': 139}, {'name': 'Kuba Sawicki', 'subject': 'Germ', 'price': 72}]}), 200

@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    print(token)
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