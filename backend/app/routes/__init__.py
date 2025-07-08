from app.controllers.auth_controller import auth_bp
from app.controllers.booking_controller import booking_bp
from app.controllers.rates_controller import rates_bp
from app.controllers.notification_controller import notification_bp
from app.controllers.stats_controller import stats_bp
from app.controllers.upload_controller import upload_bp
from app.controllers.user_controller import user_bp
from app.controllers.teacher_controller import teacher_bp
from app.controllers.subject_controller import subject_bp

def register_routes(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(rates_bp, url_prefix='/api/teachers/rates')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(upload_bp, url_prefix='/api/uploads')
    app.register_blueprint(teacher_bp, url_prefix='/api/teachers')
    app.register_blueprint(subject_bp, url_prefix='/api/subjects')