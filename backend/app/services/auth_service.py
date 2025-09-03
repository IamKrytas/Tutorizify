from app.models.auth_model import *
from app.utils.auth import generate_access_token, generate_refresh_token
from app.utils.auth import decode_token, get_current_user_email


def login_service(data):
    user_data = login_model(data)
    access_token = generate_access_token(user_data)
    refresh_token = generate_refresh_token(user_data)
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }


def register_service(data, avatar):
    user_data = register_model(data, avatar)
    access_token = generate_access_token(user_data)
    refresh_token = generate_refresh_token(user_data)
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }


def refresh_token_service(data):
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        raise ValueError("Brak tokena odświeżającego")
    
    payload = decode_token(refresh_token)

    user = {
        'id': payload.get('user_id'),
        'email': payload.get('email'),
        'role': payload.get('role')
    }

    new_access_token = generate_access_token(user)
    return new_access_token


def register_teacher_service(data):
    email = get_current_user_email()
    user_data = register_teacher_model(data, email)
    access_token = generate_access_token(user_data)
    refresh_token = generate_refresh_token(user_data)
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }