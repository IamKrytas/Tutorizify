from flask import Blueprint

booking_bp = Blueprint('booking_bp', __name__)

@booking_bp.route('/booking', methods=['POST'])
def booking_controller():
    pass

@booking_bp.route('/get_my_bookings', methods=['GET'])
def get_my_bookings_controller():
    pass

@booking_bp.route('/get_current_bookings', methods=['GET'])
def get_current_bookings_controller():
    pass

@booking_bp.route('/cancel_booking', methods=['DELETE'])
def cancel_booking_controller():
    pass

@booking_bp.route('/get_my_teacher_bookings', methods=['GET'])
def get_my_teacher_bookings_controller():
    pass

@booking_bp.route('/cancel_my_teacher_booking/<int:booking_id>', methods=['DELETE'])
def cancel_my_teacher_booking_by_id_controller(booking_id):
    pass

@booking_bp.route('/get_bookings', methods=['GET'])
def get_bookings_controller():
    pass

@booking_bp.route('/get_total_info', methods=['GET'])
def get_total_info_controller():
    pass