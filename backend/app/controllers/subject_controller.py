from flask import Blueprint, request, jsonify
from app.services.subject_service import *
from app.utils.decorators import require_role, require_token

subject_bp = Blueprint('subject_bp', __name__)


@subject_bp.route('/get_all_subjects', methods=['GET'])
@require_token
def get_all_subjects_controller():
    try:
        subjects = get_all_subjects_service()
        return jsonify({'subjects': subjects}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Internal server error'}), 500


@subject_bp.route('/get_all_levels', methods=['GET'])
@require_token
def get_all_levels_controller():
    try:
        levels = get_all_levels_service()
        return jsonify({'levels': levels}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Internal server error'}), 500


@subject_bp.route('/add_subject', methods=['POST'])
@require_token
@require_role(1)
def add_subject_controller():
    data = request.get_json()
    try:
        result = add_subject_service(data)
        return jsonify({'message': result}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Internal server error'}), 500


@subject_bp.route('/update_subject', methods=['PUT'])
@require_token
@require_role(1)
def update_subject_controller():
    data = request.get_json()
    try:
        result = update_subject_service(data)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500