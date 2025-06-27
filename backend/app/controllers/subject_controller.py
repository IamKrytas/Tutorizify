from flask import Blueprint

subject_bp = Blueprint('subject_bp', __name__)

@subject_bp.route('/subjects', methods=['GET'])
def subjects_controller():
    pass

@subject_bp.route('/get_all_subjects', methods=['GET'])
def get_all_subjects_controller():
    pass

@subject_bp.route('/add_subject', methods=['POST'])
def add_subject_controller():
    pass

@subject_bp.route('/update_subject', methods=['PUT'])
def update_subject_controller():
    pass

@subject_bp.route('/change_status_subject', methods=['PUT'])
def change_status_subject_controller():
    pass

@subject_bp.route('/get_all_levels', methods=['GET'])
def get_all_levels_controller():
    pass