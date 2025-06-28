from functools import wraps
from flask import request, jsonify
from app.utils.auth import decode_token
import jwt

def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token required"}), 401

        token = auth_header.replace("Bearer ", "")
        try:
            decoded = decode_token(token)
            request.user = decoded 
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated


def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, 'user', None)
            if not user or user.get("role") not in roles:
                return jsonify({"message": "Access denied"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator