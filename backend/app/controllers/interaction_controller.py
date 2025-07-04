from flask import Blueprint, jsonify
from app.utils.decorators import require_token
from app.services.interaction_service import get_reviews_service

interaction_bp = Blueprint('interaction_bp', __name__)


@interaction_bp.route('/get_reviews/<int:teacher_id>', methods=['GET'])
# @require_token
def get_reviews_controller(teacher_id):
    try:
        reviews = get_reviews_service(teacher_id)
        return jsonify({'reviews': reviews }), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500
