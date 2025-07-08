import { getMyBookingsService, getAllBookingsService, getCurrentBookingService, getMyTeacherBookingsService, addBookingService, deleteBookingByIdService, deleteMyTeacherBookingByIdService } from "../services/bookingService";

export const getMyBookingsController = async () => {
    return await getMyBookingsService();
}

export const getAllBookingsController = async () => {
    return await getAllBookingsService();
}

export const getCurrentBookingController = async (bookingId) => {
    return await getCurrentBookingService(bookingId);
}

export const getMyTeacherBookingsController = async () => {
    return await getMyTeacherBookingsService();
}

export const addBookingController = async (bookingData) => {
    return await addBookingService(bookingData);
}

export const deleteBookingByIdController = async (bookingId) => {
    return await deleteBookingByIdService(bookingId);
}

export const deleteMyTeacherBookingByIdController = async (bookingId) => {
    return await deleteMyTeacherBookingByIdService(bookingId);
}