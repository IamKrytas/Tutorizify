import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getMyBookingsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/bookings/get_my_bookings');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getMyBookingsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch booking details");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getAllBookingsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/bookings/get_all_bookings');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getAllBookingsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch booking details");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getCurrentBookingService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/bookings/get_current_bookings');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getCurrentBookingService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch current booking details");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getMyTeacherBookingsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/bookings/get_my_teacher_bookings');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getMyTeacherBookingsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch teacher bookings");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const addBookingService = async (bookingData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/bookings/add_booking');
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await addBookingService(bookingData);
        }

        if (response.status !== 201) {
            throw new Error(data.message || "Failed to add booking");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteBookingByIdService = async (bookingId) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/bookings/delete_booking/${bookingId}`);
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await deleteBookingByIdService(bookingId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to delete booking");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteMyTeacherBookingByIdService = async (bookingId) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/bookings/delete_my_teacher_booking/${bookingId}`);
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await deleteMyTeacherBookingByIdService(bookingId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to delete teacher booking");
        }

        return data;
    } catch (error) {
        throw error;
    }
}