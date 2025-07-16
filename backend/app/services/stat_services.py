from app.models.stats_model import get_total_info_model

def get_total_info_service():
    stats = get_total_info_model()
    return stats