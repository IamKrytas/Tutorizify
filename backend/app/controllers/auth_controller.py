from flask import Blueprint, jsonify, request
from app.services.auth_service import *
from app.utils.decorators import require_token, require_role

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route('/login', methods=['POST'])
def login_controller():
    data = request.get_json()
    try: 
        token = login_service(data)
        return jsonify({'message': 'Zalogowano pomyślnie', 'token': token}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Logowanie: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@auth_bp.route('/register', methods=['POST'])
def register_controller():
    data = request.get_json()
    try:
        token = register_service(data)
        return jsonify({'message': 'Zarejestrowano pomyślnie', 'token': token}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Rejestracja: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@auth_bp.route('/register_teacher', methods=['POST'])
# @require_token
# @require_role("user")
def register_teacher_controller():
    data = request.get_json()
    try:
        result = register_teacher_service(data)
        return jsonify({'token': result, 'message': 'Nauczyciel został zarejestrowany pomyślnie'}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Rejestracja nauczyciela: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
       