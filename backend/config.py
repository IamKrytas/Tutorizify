import os

# Konfiguracja aplikacji Flask
SESSION_TYPE = "filesystem"
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key")
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# Konfiguracja MySQL
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_DB = os.environ.get("MYSQL_DB", "mydb")