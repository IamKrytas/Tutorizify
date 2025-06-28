from flask import request, jsonify
from functools import wraps
from datetime import datetime
import os
import jwt


def generate_token(user):
    payload = {
        'user_id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(
            minutes=int(os.getenv("JWT_EXPIRATION_MINUTES", 60))
        )
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")


def decode_token(token):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
def get_current_user_email():
    token = request.headers.get('Authorization')
    if not token:
        return None
    try:
        payload = decode_token(token)
        if payload:
            return payload['email']
        return None
    except Exception as e:
        print(f"Error decoding token: {e}")
        return None