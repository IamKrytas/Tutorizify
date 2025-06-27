import os
from flask_cors import CORS
from flask import Flask
from app.routes import register_routes
from dotenv import load_dotenv

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.config.from_pyfile('../config.py')

    register_routes(app)
    return app
