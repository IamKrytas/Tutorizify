from flask import Blueprint

teacher_bp = Blueprint('teacher_bp', __name__)

@teacher_bp.route('/get_teachers', methods=['GET'])
def get_teachers_controller():
    pass

@teacher_bp.route('/get_all_teachers', methods=['GET'])
def get_all_teachers_controller():
    pass

@teacher_bp.route('/get_about/<int:teacher_id>', methods=['GET'])
def get_about_by_id_controller(teacher_id):
    pass

@teacher_bp.route('/update_my_teacher_profile', methods=['POST'])
def update_my_teacher_profile_controller():
    pass

@teacher_bp.route('/change_status_teacher/<int:teacher_id>')
def change_status_teacher_by_id_controller(teacher_id):
    pass

@teacher_bp.route('/delete_teacher/<int:teacher_id>', methods=['DELETE'])
def delete_teacher_by_id_controller(teacher_id):
    pass

@teacher_bp.route('/rate_teacher/<int:teacher_id>', methods=['POST'])
def rate_teacher_by_id_controller(teacher_id):
    pass

@teacher_bp.route('/get_all_rates', methods=['GET'])
def get_all_rates_controller():
    pass

@teacher_bp.route('/delete_rate/<int:rate_id>', methods=['DELETE'])
def delete_rate_by_id_controller(rate_id):
    pass