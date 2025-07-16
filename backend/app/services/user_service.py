from app.models.user_model import *
from app.utils.auth import get_current_user_email
import os


def get_users_service():
    raw_users = get_users_model()
    users = []
    for user in raw_users:
        users.append({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "registrationDate": user["registration_date"],
            "role": user["role"]
        })
    return users


def get_user_info_service():
    email = get_current_user_email()
    user = get_user_info_model(email)
    avatar = user['avatar']

    if avatar:
        localhost = os.getenv("LOCALHOST")
        user['avatar'] = f"{localhost}/api/uploads/{user['avatar']}" if user['avatar'] else None
    else:
        user['avatar'] = None
    return user


def get_user_profile_service():
    email = get_current_user_email()
    user = get_user_profile_model(email)
    return user

  
def get_roles_service():
    roles = get_roles_model()
    return roles


def update_profile_service(data):
    email = get_current_user_email()
    result = update_profile_model(data, email)
    return result


def update_password_service(data):
    email = get_current_user_email()
    result = update_password_model(data, email)
    return result


def update_avatar_service(avatar):
    email = get_current_user_email()
    result = update_avatar_model(avatar, email)
    return result


def update_role_by_id_service(data, user_id):
    result = update_role_by_id_model(data, user_id)
    return result


def delete_user_service():
    email = get_current_user_email()
    result = delete_user_model(email)
    return result