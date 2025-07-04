from app.models.booking_model import *
from datetime import datetime


def get_total_info_service():
    info = get_total_info_model()
    return info


def get_my_bookings_service():
    bookings = get_my_bookings_model()
    bookings_data  = []
    for booking in bookings:
        # Convert date to string format if it exists
        date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

        # Convert start_time and end_time to string format if they exist
        start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
        end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None
        
        # Convert reservation_time to string format if it exists
        reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None
        booking_data = {
            "id": booking["id"],
            "teacher_id": booking["teacher_id"],
            "teacher_name": booking["teacher_name"],
            "date": date_str,
            "start_time": start_time_str,
            "end_time": end_time_str,
            "duration": booking["duration"],
            "reservation_time": reservation_time_str,
            "subject": booking["subject"],
            "price": booking["price"],
            "level": booking["level"],
            "has_rated": booking["has_rated"]
        }
        bookings_data.append(booking_data)
    return bookings_data


def get_all_bookings_service():
    bookings = get_all_bookings_model()
    bookings_data = []
    for booking in bookings:
        # Convert date to string format if it exists
        date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

        # Convert start_time and end_time to string format if they exist
        start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
        end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None
        
        # Convert reservation_time to string format if it exists
        reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None
        
        booking_data = {
            "id": booking["id"],
            "teacher_name": booking["teacher_name"],
            "user_name": booking["user_name"],
            "date": date_str,
            "start_time": start_time_str,
            "end_time": end_time_str,
            "duration": booking["duration"],
            "price": booking["price"],
            "reservation_time": reservation_time_str,
            "subject": booking["subject"],
            "level": booking["level"]
        }
        bookings_data.append(booking_data)
    return bookings_data


def get_current_bookings_service():
    bookings = get_current_bookings_model()
    bookings_data = []
    for booking in bookings:
        # Convert date to string format if it exists
        date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

        # Convert start_time and end_time to string format if they exist
        start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
        end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None
        
        # Convert reservation_time to string format if it exists
        reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None
        
        booking_data = {
            "id": booking["id"],
            "teacher_name": booking["teacher_name"],
            "date": date_str,
            "start_time": start_time_str,
            "end_time": end_time_str,
            "duration": booking["duration"],  # Użyj jako liczby minut
            "reservation_time": reservation_time_str,
            "subject": booking["subject"],
            "level": booking["level"],
            "price": booking["price"],
        }
        bookings_data.append(booking_data)
    return bookings_data


def get_my_teacher_bookings_service():
    bookings = get_my_teacher_bookings_model()
    bookings_data = []
    for booking in bookings:
        # Convert date to string format if it exists
        date_str = booking["date"].strftime("%Y-%m-%d") if booking["date"] else None

        # Convert start_time and end_time to string format if they exist
        start_time_str = (datetime.min + booking["start_time"]).strftime("%H:%M") if booking["start_time"] else None
        end_time_str = (datetime.min + booking["end_time"]).strftime("%H:%M") if booking["end_time"] else None
        
        # Convert reservation_time to string format if it exists
        reservation_time_str = booking["reservation_time"].strftime("%Y-%m-%d %H:%M:%S") if booking["reservation_time"] else None
        
        booking_data = {
            "id": booking["id"],
            "user_name": booking["user_name"],
            "date": date_str,
            "start_time": start_time_str,
            "end_time": end_time_str,
            "duration": booking["duration"],
            "reservation_time": reservation_time_str,
            "price": booking["price"],
            "subject": booking["subject"],
            "level": booking["level"]
        }
        bookings_data.append(booking_data)
    return bookings_data


def booking_service(data):
    result = booking_model(data)
    return result


def cancel_booking_service(booking_id):
    result = cancel_booking_model(booking_id)
    return result


def cancel_my_teacher_booking_by_id_service(booking_id):
    result = cancel_my_teacher_booking_by_id_model(booking_id)
    return result