from flask_cors import CORS
from flask import Flask
from app.routes import register_routes
from dotenv import load_dotenv

def create_app():
    load_dotenv()

    app = Flask(__name__, static_folder='dist', static_url_path='')
    CORS(app, supports_credentials=True)
    app.config.from_pyfile('../config.py')

    register_routes(app)
    return app
