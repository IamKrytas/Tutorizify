from flask import Blueprint, jsonify, request
from app.services.auth_service import *
from app.utils.decorators import require_token, require_role

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route('/login', methods=['POST'])
def login_controller():
    data = request.get_json()
    try: 
        tokens = login_service(data)
        return jsonify({'message': 'Zalogowano pomyślnie',
                        'access_token': tokens['access_token'],
                        'refresh_token': tokens['refresh_token']}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Logowanie: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@auth_bp.route('/register', methods=['POST'])
def register_controller():
    data = request.form.to_dict()
    avatar = request.files.get('avatar')
    try:
        tokens = register_service(data, avatar)
        return jsonify({'message': 'Zarejestrowano pomyślnie',
                        'access_token': tokens['access_token'],
                        'refresh_token': tokens['refresh_token']}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Rejestracja: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@auth_bp.route('/refresh_token', methods=['POST'])
def refresh_token_controller():
    data = request.get_json()
    try:
        new_access_token = refresh_token_service(data)
        return jsonify({'message': 'Token odświeżony pomyślnie',
                        'access_token': new_access_token}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Odświeżanie tokena: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@auth_bp.route('/register_teacher', methods=['POST'])
@require_token
@require_role(1, 3)
def register_teacher_controller():
    data = request.get_json()
    try:
        new_tokens = register_teacher_service(data)
        return jsonify({'message': 'Pomyślnie zarejestrowano jako nauczyciel',
                        'access_token': new_tokens['access_token'], 
                        'refresh_token': new_tokens['refresh_token']}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Rejestracja nauczyciela: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500