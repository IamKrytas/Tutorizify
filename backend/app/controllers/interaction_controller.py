from flask import Blueprint

interaction_bp = Blueprint('interaction_bp', __name__)

@interaction_bp.route('/favourite/<int:teacher_id>', methods=['PUT'])
def favourite_teacher_controller(teacher_id):
    pass

@interaction_bp.route('/get_reviews/<int:teacher_id>', methods=['GET'])
def get_reviews_controller(teacher_id):
    pass