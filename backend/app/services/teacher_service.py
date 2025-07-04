from app.models.teacher_model import *

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
    raw_about = get_about_by_id_model(teacher_id)
    profile_picture_url = f"/api/uploads/{raw_about['avatar']}" if raw_about['avatar'] else None
    about_data = {
        "id": raw_about["id"],
        "name": raw_about["name"],
        "bio": raw_about["bio"],
        "email": raw_about["email"],
        "description": raw_about["description"],
        "image": profile_picture_url,
        "subject": raw_about["subject_name"],
        "level": raw_about["level"],
        "price": raw_about["price"],
        "rating": raw_about["rating"],
        "ratingCount": raw_about["rating_count"]
    }
    return about_data


def get_my_teacher_profile_service():
    raw_profile = get_my_teacher_profile_model()
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


def get_all_rates_service():
    raw_rates = get_all_rates_model()
    rates_data = []
    for rate in raw_rates:
        rates_data.append({
            "id": rate["id"],
            "teacher_name": rate["teacher_name"],
            "user_name": rate["user_name"],
            "rating": rate["rating"],
            "comment": rate["comment"],
            "date": rate["date"]
        })
    return rates_data


def rate_teacher_by_id_service(teacher_id, data):
    received_data = data
    result = rate_teacher_by_id_model(teacher_id, received_data)
    return result


def update_my_teacher_profile_service(data):
    received_data = data
    result = update_my_teacher_profile_model(received_data)
    return result
    

def update_status_teacher_by_id_service(teacher_id):
    result = update_status_teacher_by_id_model(teacher_id)
    return result


def delete_teacher_by_id_service(teacher_id):
    result = delete_teacher_by_id_model(teacher_id)
    return result


def delete_rate_by_id_service(rate_id):
    result = delete_rate_by_id_model(rate_id)
    return result