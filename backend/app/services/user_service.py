from app.models.user_model import *
from app.utils.auth import get_current_user_email


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


def update_email_service(data):
    email = get_current_user_email()
    result = update_email_model(data, email)
    return result


def update_password_service(data):
    email = get_current_user_email()
    result = update_password_model(data, email)
    return result


def update_avatar_service(avatar):
    email = get_current_user_email()
    result = update_avatar_model(avatar, email)
    return result


def update_role_service(data):
    result = update_role_model(data)
    return result


def delete_user_service():
    email = get_current_user_email()
    result = delete_user_model(email)
    return result