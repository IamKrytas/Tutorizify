from app.models.interaction_model import get_reviews_model

def get_reviews_service(teacher_id):
    result = get_reviews_model(teacher_id)
    reviews = []
    for review in result:
        reviews.append({
            "id": review["id"],
            "rating": review["rating"],
            "comment": review["comment"],
            "createdAt": review["created_at"],
            "username": review["username"]
        })
    return reviews