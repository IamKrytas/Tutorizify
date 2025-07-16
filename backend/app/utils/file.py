from werkzeug.utils import secure_filename
import os
from flask import current_app as app

def save_file(file, user_id):
    upload_folder = app.config['UPLOAD_FOLDER']
    if file:
        file_extension = os.path.splitext(secure_filename(file.filename))[1]
        os.makedirs(upload_folder, exist_ok=True)
        unique_filename = f"avatar_{user_id}{file_extension}"
        save_path = os.path.join(upload_folder, unique_filename)
        file.save(save_path)
        return unique_filename
    else:
        default_filename = 'default_avatar.png'
        default_file_path = os.path.join(upload_folder, default_filename)
        if not os.path.exists(default_file_path):
            raise FileNotFoundError(f"Domyślne zdjęcie {default_filename} nie istnieje w katalogu {app.config['UPLOAD_FOLDER']}.")
        return default_filename