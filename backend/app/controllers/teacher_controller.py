from flask import Blueprint, jsonify, request
from app.services.teacher_service import *
from app.utils.decorators import require_token, require_role

teacher_bp = Blueprint('teacher_bp', __name__)


@teacher_bp.route('/get_teachers', methods=['GET'])
@require_token
def get_teachers_controller():
    try:
        teachers = get_teachers_service()
        return jsonify({'teachers': teachers}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@teacher_bp.route('/get_all_teachers', methods=['GET'])
@require_token
@require_role(1)
def get_all_teachers_controller():
    try:
        teachers = get_all_teachers_service()
        return jsonify({'teachers': teachers}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@teacher_bp.route('/get_about/<int:teacher_id>', methods=['GET'])
@require_token
def get_about_by_id_controller(teacher_id):
    try:
        about = get_about_by_id_service(teacher_id)
        return jsonify({'about': about}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500

    
@teacher_bp.route('/get_my_teacher_profile', methods=['GET'])
@require_token
@require_role(1, 2)
def get_my_teacher_profile_controller():
    try:
        teacher_profile = get_my_teacher_profile_service()
        return jsonify({'teacher_profile': teacher_profile}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@teacher_bp.route('/update_my_teacher_profile', methods=['PUT'])
@require_token
@require_role(1, 2)
def update_my_teacher_profile_controller():
    data = request.get_json()
    try:
        updated_profile = update_my_teacher_profile_service(data)
        return jsonify({'message ': updated_profile}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@teacher_bp.route('/update_status_teacher/<int:teacher_id>', methods=['PUT'])
@require_token
@require_role(1)
def update_status_teacher_by_id_controller(teacher_id):
    try:
        result = update_status_teacher_by_id_service(teacher_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@teacher_bp.route('/delete_teacher/<int:teacher_id>', methods=['DELETE'])
@require_token
@require_role(1)
def delete_teacher_by_id_controller(teacher_id):
    try:
        result = delete_teacher_by_id_service(teacher_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500