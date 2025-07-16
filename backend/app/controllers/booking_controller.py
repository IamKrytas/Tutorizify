from flask import Blueprint,request, jsonify
from app.services.booking_service import *
from app.utils.decorators import require_role, require_token

booking_bp = Blueprint('booking_bp', __name__)


@booking_bp.route('/get_my_bookings', methods=['GET'])
@require_token
def get_my_bookings_controller():
    try:
        bookings = get_my_bookings_service()
        return jsonify({'bookings': bookings}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get My Bookings: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/get_all_bookings', methods=['GET'])
@require_token
@require_role(1)
def get_all_bookings_controller():
    try:
        bookings = get_all_bookings_service()
        return jsonify({'bookings': bookings}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get All Bookings: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/get_current_bookings', methods=['GET'])
@require_token
def get_current_bookings_controller():
    try:
        bookings = get_current_bookings_service()
        return jsonify({'bookings': bookings}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get Current Bookings: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/get_my_teacher_bookings', methods=['GET'])
@require_token
@require_role(1, 2)
def get_my_teacher_bookings_controller():
    try:
        bookings = get_my_teacher_bookings_service()
        return jsonify({'bookings': bookings}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Get My Teacher Bookings: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/add_booking', methods=['POST'])
@require_token
def add_booking_controller():
    data = request.get_json()
    try:
        result = add_booking_service(data)
        return jsonify({'message': result}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Add Booking: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/delete_booking/<int:booking_id>', methods=['DELETE'])
@require_token
def delete_booking_by_id_controller(booking_id):
    try:
        result = delete_booking_by_id_service(booking_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Delete Booking: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500


@booking_bp.route('/delete_my_teacher_booking/<int:booking_id>', methods=['DELETE'])
@require_token
@require_role(2)
def delete_my_teacher_booking_by_id_controller(booking_id):
    try:
        result = delete_my_teacher_booking_by_id_service(booking_id)
        return jsonify({'message': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Delete My Teacher Booking: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500