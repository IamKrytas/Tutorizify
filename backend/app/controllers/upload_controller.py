from flask import Blueprint

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/uploads/<filename>', methods=['GET'])
def get_upload_controller(filename):
    pass