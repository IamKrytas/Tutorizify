from app.models.notification_model import get_notifications_model

def get_notifications_service():
    result = get_notifications_model()
    notifications = []
    for notification in result:
        notifications.append({
            "id": notification["id"],
            "message": notification["message"],
            "created_at": notification["created_at"]
        })
    return notifications