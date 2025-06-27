from flask import Blueprint

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login_controller():
    pass

@auth_bp.route('/logout', methods=['POST'])
def logout_controller():
    pass

@auth_bp.route('/register', methods=['POST'])
def register_controller():
    pass

@auth_bp.route('/register_teacher', methods=['POST'])
def register_teacher_controller():
    pass

@auth_bp.route('/check_login', methods=['GET'])
def check_login_controller():
    pass