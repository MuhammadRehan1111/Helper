from typing import List, Dict

# Mock state for bookings and schedules
bookings: List[Dict] = []

def add_booking(booking_data: Dict):
    bookings.append(booking_data)
    return booking_data

def get_bookings():
    return bookings
