from flask import Blueprint, jsonify, request
from app.services.teacher_service import *
from app.utils.decorators import require_token, require_role

teacher_bp = Blueprint('teacher_bp', __name__)

# @require_token
@teacher_bp.route('/get_teachers', methods=['GET'])
def get_teachers_controller():
    teachers = get_teachers_service()
    return jsonify({'teachers': teachers}), 200


# @require_token
# @require_role('admin')
@teacher_bp.route('/get_all_teachers', methods=['GET'])
def get_all_teachers_controller():
    teachers = get_all_teachers_service()
    return jsonify({'teachers': teachers}), 200
    

# @require_token
@teacher_bp.route('/get_about/<int:teacher_id>', methods=['GET'])
def get_about_by_id_controller(teacher_id):
    about = get_about_by_id_service(teacher_id)
    return jsonify({'about': about}), 200
    

# @require_token
# @require_role('teacher', 'admin')
@teacher_bp.route('/get_my_teacher_profile', methods=['GET'])
def get_my_teacher_profile_controller():
    teacher_profile = get_my_teacher_profile_service()
    return jsonify({'teacher_profile': teacher_profile}), 200


# @require_token
# @require_role('teacher', 'admin')
@teacher_bp.route('/update_my_teacher_profile', methods=['PUT'])
def update_my_teacher_profile_controller():
    data = request.get_json()
    updated_profile = update_my_teacher_profile_service(data)
    return jsonify({'message ': updated_profile}), 200


# @require_token
# @require_role('admin')
@teacher_bp.route('/change_status_teacher/<int:teacher_id>', methods=['PUT'])
def change_status_teacher_by_id_controller(teacher_id):
    result = change_status_teacher_by_id_service(teacher_id)
    return jsonify({'message': result}), 200


# @require_token
# @require_role('admin')
@teacher_bp.route('/delete_teacher/<int:teacher_id>', methods=['DELETE'])
def delete_teacher_by_id_controller(teacher_id):
    result = delete_teacher_by_id_service(teacher_id)
    return jsonify({'message': result}), 200


# @require_token
@teacher_bp.route('/rate_teacher/<int:teacher_id>', methods=['POST'])
def rate_teacher_by_id_controller(teacher_id):
    data = request.get_json()
    result = rate_teacher_by_id_service(teacher_id, data)
    return jsonify({'message': result}), 201


# @require_token
# @require_role('admin')
@teacher_bp.route('/get_all_rates', methods=['GET'])
def get_all_rates_controller():
    rates = get_all_rates_service()
    return jsonify({'rates': rates}), 200


@teacher_bp.route('/delete_rate/<int:rate_id>', methods=['DELETE'])
def delete_rate_by_id_controller(rate_id):
    result = delete_rate_by_id_service(rate_id)
    return jsonify({'message': result}), 200