from app.models.teacher_model import *
from app.utils.auth import get_current_user_email
import os

def get_teachers_service():
    raw_teachers = get_teachers_model()
    teachers_data = []
    for teacher in raw_teachers:
        teachers_data.append({
            "id": teacher["id"],
            "name": teacher["name"],
            "bio": teacher["bio"],
            "email": teacher["email"],
            "description": teacher["description"],
            "image": teacher["avatar"],
            "subject": teacher["subject_name"],
            "level": teacher["level"],
            "price": teacher["price"],
            "rating": teacher["rating"]
        })
    return teachers_data


def get_all_teachers_service():
    raw_teachers = get_all_teachers_model()
    teachers_data = []
    for teacher in raw_teachers:
        teachers_data.append({
            "id": teacher["id"],
            "name": teacher["name"],
            "email": teacher["email"],
            "bio": teacher["bio"],
            "description": teacher["description"],
            "image": teacher["avatar"],
            "subject": teacher["subject_name"],
            "level": teacher["level"],
            "price": teacher["price"],
            "rating": teacher["rating"],
            "status": teacher["status"]
        })
    return teachers_data


def get_about_by_id_service(teacher_id):
    teacher = get_about_by_id_model(teacher_id)
    localhost = os.getenv("LOCALHOST")
    image_url = f"{localhost}/api/uploads/{teacher['avatar']}" if teacher['avatar'] else None
    about_data = {
        "id": teacher["id"],
        "name": teacher["name"],
        "bio": teacher["bio"],
        "email": teacher["email"],
        "description": teacher["description"],
        "image": image_url,
        "subject": teacher["subject_name"],
        "level": teacher["level"],
        "price": teacher["price"],
        "rating": teacher["rating"],
        "ratingCount": teacher["rating_count"]
    }
    return about_data


def get_my_teacher_profile_service():
    email = get_current_user_email()
    raw_profile = get_my_teacher_profile_model(email)
    profile_data = {
        "id": raw_profile["id"],
        "name": raw_profile["name"],
        "bio": raw_profile["bio"],
        "email": raw_profile["email"],
        "description": raw_profile["description"],
        "subject": raw_profile["subject_name"],
        "level": raw_profile["level"],
        "price": raw_profile["price"],
        "rating": raw_profile["rating"],
        "status": raw_profile["status"]
    }
    return profile_data


def get_most_popular_teachers_service():
    raw_teachers = get_most_popular_teachers_model()
    teachers_data = []
    for teacher in raw_teachers:
        localhost = os.getenv("LOCALHOST")
        image_url = f"{localhost}/api/uploads/{teacher['avatar']}" if teacher['avatar'] else None
        teachers_data.append({
            "id": teacher["id"],
            "name": teacher["name"],
            "image": image_url,
            "subject": teacher["subject_name"],
            "level": teacher["level"],
            "price": teacher["price"],
            "rating": teacher["rating"]
        })
    return teachers_data


def update_my_teacher_profile_service(data):
    email = get_current_user_email()
    result = update_my_teacher_profile_model(data, email)
    return result
    

def update_status_teacher_by_id_service(teacher_id):
    result = update_status_teacher_by_id_model(teacher_id)
    return result