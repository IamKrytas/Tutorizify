from flask import Blueprint, request, jsonify, session
from app.services.user_service import get_users_service
from app.utils.auth import require_token

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/get_users', methods=['GET'])
def get_users_controller():
    pass

@user_bp.route('/get_user_info', methods=['GET'])
def get_user_info_controller():
    pass

@user_bp.route('/get_profile', methods=['GET'])
def get_profile_controller():
    pass

@user_bp.route('/update_profile', methods=['PUT'])
def update_profile_controller():
    pass

@user_bp.route('/change_email', methods=['PUT'])
def change_email_controller():
    pass

@user_bp.route('/change_password', methods=['PUT'])
def change_password_controller():
    pass

@user_bp.route('/delete_account', methods=['DELETE'])
def delete_account_controller():
    pass

@user_bp.route('/update_avatar', methods=['PUT'])
def update_avatar_controller():
    pass

@user_bp.route('/get_roles', methods=['GET'])
def get_roles_controller():
    pass

@user_bp.route('/change_role', methods=['PUT'])
def change_role_controller():
    pass