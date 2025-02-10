import AsyncStorage from '@react-native-async-storage/async-storage';

// Rezerwacja lekcji
export const sendBookingData = async (date, time, duration, id) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/booking';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                time,
                duration,
                teacherId: id,
            }),
        });
        const data = await response.json();

        if (response.status !== 201) {
            return { message: data.message || 'Nie udało się zarezerwować lekcji' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano dane' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Anulowanie rezerwacji
export const cancelBooking = async (bookingId) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/cancel_booking';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId,
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się anulować rezerwacji' };
        }

        return { success: true, message: data.message || 'Poprawnie anulowano rezerwację' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie rezerwacji użytkownika
export const fetchUserBookings = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const apiUrl = 'https://iamkrytas.smallhost.pl/get_my_bookings';

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać moich rezerwacji' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano moje rezerwacje', bookings: data.bookings };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie wszystkich rezerwacji
export const fetchAllBookings = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const apiUrl = 'https://iamkrytas.smallhost.pl/get_bookings';

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udalo sie pobrac rezerwacji' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano rezerwacje', bookings: data.bookings };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};
