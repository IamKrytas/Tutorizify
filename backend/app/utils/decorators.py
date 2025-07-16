from functools import wraps
from flask import request, jsonify, g
import jwt
import os

def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.lower().startswith("bearer "):
            return jsonify({"message": "Brak tokenu autoryzacyjnego"}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            g.user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token wygasł"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Nieprawidłowy token"}), 401

        return f(*args, **kwargs)
    return decorated


def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(g, 'user', None)
            if not user or user.get("role") not in roles:
                return jsonify({"message": "Brak uprawnień"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator