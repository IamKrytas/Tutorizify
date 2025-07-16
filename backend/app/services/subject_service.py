from app.models.subject_model import *


def get_all_subjects_service():
    all_subjects = get_all_subjects_model()
    all_subjects_data = []
    for subject in all_subjects:
        subject_data = {
            "id": subject["id"],
            "name": subject["name"]
        }
        all_subjects_data.append(subject_data)
    return all_subjects_data


def get_all_levels_service():
    all_levels = get_all_levels_model()
    all_levels_data = []
    for level in all_levels:
        level_data = {
            "id": level["id"],
            "name": level["name"]
        }
        all_levels_data.append(level_data)
    return all_levels_data


def add_subject_service(data):
    result = add_subject_model(data)
    return result


def update_subject_by_id_service(data, subject_id):
    result = update_subject_by_id_model(data, subject_id)
    return result