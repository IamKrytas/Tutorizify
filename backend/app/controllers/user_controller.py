from flask import Blueprint, jsonify, request
from app.services.user_service import *
from app.utils.decorators import require_token, require_role

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/', methods=['GET'])
@require_token
@require_role(1)
def get_users_controller():
    try:
        users = get_users_service()
        return jsonify({'users': users}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get Users: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/user_info', methods=['GET'])
@require_token
def get_user_info_controller():
    try: 
        user = get_user_info_service()
        return jsonify({'user': user}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get User Info: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/user_profile', methods=['GET'])
@require_token
def get_user_profile_controller():
    try:
        user = get_user_profile_service()
        return jsonify({'user': user}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get User Profile: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
    

@user_bp.route('/roles', methods=['GET'])
@require_token
@require_role(1)
def get_roles_controller():
    try:
        roles = get_roles_service()
        return jsonify({'roles': roles}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get Roles: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/update_profile', methods=['PUT'])
@require_token
def update_profile_controller():
    data = request.get_json()
    try:
        result = update_profile_service(data)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Update Profile: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/update_password', methods=['PUT'])
@require_token
def update_password_controller():
    data = request.get_json()
    try: 
        result = update_password_service(data)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Update Password: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/update_avatar', methods=['PUT'])
@require_token
def update_avatar_controller():
    avatar = request.files.get('avatar')
    try:
        result = update_avatar_service(avatar)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Update Avatar: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/update_role/<user_id>', methods=['PUT'])
@require_token
@require_role(1)
def update_role_by_id_controller(user_id):
    data = request.get_json()
    try:
        result = update_role_by_id_service(data, user_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Update Role: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@user_bp.route('/delete_user', methods=['DELETE'])
@require_token
def delete_user_controller():
    try:
        result = delete_user_service()
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Delete User: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500