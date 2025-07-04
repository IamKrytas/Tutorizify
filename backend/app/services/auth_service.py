from app.models.auth_model import *


def login_service(data):
    token = login_model(data)
    return token


def register_service(data):
    token = register_model(data)
    return token


def register_teacher_service(data):
    token = register_teacher_model(data)
    return token