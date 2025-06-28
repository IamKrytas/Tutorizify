from flask import Blueprint, jsonify, request
from app.services.user_service import *
from app.utils.decorators import require_token, require_role

user_bp = Blueprint('user_bp', __name__)


# @require_token
# @require_role('admin')
@user_bp.route('/get_users', methods=['GET'])
def get_users_controller():
    users = get_users_service()
    return jsonify({'users': users}), 200


# @require_token
@user_bp.route('/get_user_info', methods=['GET'])
def get_user_info_controller():
    user = get_user_info_service()
    return jsonify({'user': user}), 200


# @require_token
@user_bp.route('/get_profile', methods=['GET'])
def get_profile_controller():
    user = get_profile_service()
    return jsonify({'user': user}), 200


# @require_token
@user_bp.route('/update_profile', methods=['PUT'])
def update_profile_controller():
    data = request.get_json()
    result = update_profile_service(data)
    return jsonify({'message': result}), 200


# @require_token
@user_bp.route('/change_email', methods=['PUT'])
def change_email_controller():
    data = request.get_json()
    result = change_email_service(data)
    return jsonify({'message': result}), 200


# @require_token
@user_bp.route('/change_password', methods=['PUT'])
def change_password_controller():
    data = request.get_json()
    result = change_password_service(data)
    return jsonify({'message': result}), 200


# @require_token
@user_bp.route('/delete_account', methods=['DELETE'])
def delete_account_controller():
    result = delete_account_service()
    return jsonify({'message': result}), 200


# @require_token
@user_bp.route('/update_avatar', methods=['PUT'])
def update_avatar_controller():
    avatar = request.files.get('avatar')
    if avatar == None:
            return jsonify({"message": "No file provided"}), 400
    result = update_avatar_service(avatar)
    return jsonify({'message': result}), 200
    


# @require_token
# @require_role('admin')
@user_bp.route('/get_roles', methods=['GET'])
def get_roles_controller():
    roles = get_roles_service()
    return jsonify({'roles': roles}), 200


# @require_token
# @require_role('admin')
@user_bp.route('/change_role', methods=['PUT'])
def change_role_controller():
    data = request.get_json()
    result = change_role_service(data)
    return jsonify({'message': result}), 200