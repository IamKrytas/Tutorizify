from flask import Blueprint, jsonify, request
from app.utils.decorators import require_token, require_role
from app.services.rates_service import *

rates_bp = Blueprint('rates_bp', __name__)


@rates_bp.route('/get_all_rates', methods=['GET'])
@require_token
@require_role(1)
def get_all_rates_controller():
    try:
        rates = get_all_rates_service()
        return jsonify({'rates': rates}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get All Rates: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@rates_bp.route('/get_rates/<int:teacher_id>', methods=['GET'])
@require_token
def get_rates_by_id_controller(teacher_id):
    try:
        rates = get_rates_by_id_service(teacher_id)
        return jsonify({'rates': rates }), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get Rates by ID: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
    

@rates_bp.route('/add_rate/<int:teacher_id>', methods=['POST'])
@require_token
def add_rate_by_id_controller(teacher_id):
    data = request.get_json()
    try:
        result = add_rate_by_id_service(teacher_id, data)
        return jsonify({'message': result}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Add Rate: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
    

@rates_bp.route('/delete_rate/<int:rate_id>', methods=['DELETE'])
@require_token
@require_role(1)
def delete_rate_by_id_controller(rate_id):
    try:
        result = delete_rate_by_id_service(rate_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Delete Rate: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500