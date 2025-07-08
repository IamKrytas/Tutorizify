from app.models.notification_model import get_notifications_model
from app.utils.auth import get_current_user_email


def get_notifications_service():
    email = get_current_user_email()
    result = get_notifications_model(email)
    notifications = []
    for notification in result:
        notifications.append({
            "id": notification["id"],
            "message": notification["message"],
            "created_at": notification["created_at"]
        })
    return notifications