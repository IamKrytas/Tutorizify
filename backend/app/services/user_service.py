from app.models.user_model import *

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
    user = get_user_info_model()
    return user


def get_user_profile_service():
    user = get_user_profile_model()
    return user

def get_roles_service():
    roles = get_roles_model()
    return roles


def update_profile_service(data):
    result = update_profile_model(data)
    return result


def update_email_service(data):
    result = update_email_model(data)
    return result


def update_password_service(data):
    result = update_password_model(data)
    return result


def update_avatar_service(avatar):
    result = update_avatar_model(avatar)
    return result


def update_role_service(data):
    result = update_role_model(data)
    return result


def delete_account_service():
    result = delete_account_model()
    return result