from app.models.rates_model import *
from app.utils.auth import get_current_user_email


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


def get_rates_by_id_service(teacher_id):
    rates = get_rates_by_id_model(teacher_id)
    rates_data = []
    for rate in rates:
        rates_data.append({
            "id": rate["id"],
            "rating": rate["rating"],
            "comment": rate["comment"],
            "createdAt": rate["created_at"],
            "username": rate["username"]
        })
    return rates_data


def add_rate_by_id_service(teacher_id, data):
    email = get_current_user_email()
    result = add_rate_by_id_model(teacher_id, data, email)
    return result


def delete_rate_by_id_service(rate_id):
    result = delete_rate_by_id_model(rate_id)
    return result