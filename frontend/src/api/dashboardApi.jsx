import { getBackendAddress } from '../app/getBackendAddress';

// Pobieranie danych użytkownika
export const fetchUserData = async () => {
    try {
        const apiUrl = getBackendAddress('/get_user_info');
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się pobrać danych użytkownika' };
        }
        return { success: true, message: data.message || 'Poprawnie pobrałem dane użytkownika', user: data.user };
    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie danych dashboardu
export const fetchDashboardData = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const apiUrl = getBackendAddress('/get_total_info');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się pobrać danych dashboardu' };
        }

        return { success: true, message: data.message || 'Poprawnio pobrałem dane dashboardu', info: data.info };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie aktualnych rezerwacji użytkownika
export const fetchMyCurrentBookings = async () => {
    try {
        const apiUrl = getBackendAddress('/get_current_bookings');
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się pobrać moich aktualnych rezerwacji' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano mój profil nauczyciela', bookings: data.bookings };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie popularnych nauczycieli
export const fetchMostPopularTeachers = async () => {
    try {
        const apiUrl = getBackendAddress('/get_most_popular_teachers');
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się pobrać najpopularniejszych nauczycieli' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano najpopularniejszych nauczycieli', teachers: data.teachers };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie informacji o powiadomieniach
export const fetchNotifications = async () => {
    try {
        const apiUrl = getBackendAddress('/get_notifications');
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się pobrać powiadomień' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano powiadomienia', notifications: data.notifications };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};