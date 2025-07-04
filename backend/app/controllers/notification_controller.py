from flask import Blueprint, jsonify, request
from app.utils.decorators import require_token
from app.services.notification_service import *

notification_bp = Blueprint('notification_bp', __name__)


@notification_bp.route('/get_notifications', methods=['GET'])
# @require_token
def get_notifications_controller():
    try:
        result = get_notifications_service()
        return jsonify({'notifications': result}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
