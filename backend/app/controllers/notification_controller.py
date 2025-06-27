from flask import Blueprint

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('/get_notifications', methods=['GET'])
def get_notifications_controller():
    pass