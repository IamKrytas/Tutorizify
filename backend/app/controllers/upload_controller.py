from flask import Blueprint, send_from_directory, current_app

upload_bp = Blueprint('upload_bp', __name__)


@upload_bp.route('/uploads/<filename>')
def upload_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)