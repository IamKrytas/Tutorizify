from flask import Blueprint, jsonify
from app.services.stat_services import *
from app.utils.decorators import require_token

stats_bp = Blueprint('stats_bp', __name__)


@stats_bp.route('/get_total_stats', methods=['GET'])
@require_token
def get_total_info_controller():
    try:
        stats = get_total_info_service()
        return jsonify({'stats': stats}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Login: {e}")
        return jsonify({'message': 'Wystąpił błąd wewnętrzny serwera'}), 500