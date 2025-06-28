from werkzeug.utils import secure_filename
import os
import app

def save_file(file, user_id):
    if file:
        file_extension = os.path.splitext(secure_filename(file.filename))[1]
        unique_filename = f"avatar_{user_id}{file_extension}"
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(save_path)
        return unique_filename
    else:
        default_filename = 'default_avatar.png'
        default_file_path = os.path.join(app.config['UPLOAD_FOLDER'], default_filename)
        if not os.path.exists(default_file_path):
            raise FileNotFoundError(f"Domyślne zdjęcie {default_filename} nie istnieje w katalogu {app.config['UPLOAD_FOLDER']}.")
        return default_filename