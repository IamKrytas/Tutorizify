from flask import request, jsonify
from functools import wraps

def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = request.user
            if user['role'] not in roles:
                return jsonify({"error": "Unauthorized"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Brak autoryzacji'}), 401
        return f(*args, **kwargs)
    return decorated_function
