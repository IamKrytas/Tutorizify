import AsyncStorage from '@react-native-async-storage/async-storage';

// Pobieranie informacji o nauczycielu po jego ID
export const fetchTeacherById = async (id) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/get_about/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać informacji o nauczycielu' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano informacje o nauczycielu', teacher: data.teacher };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};


// Pobieranie wszystkich ocen nauczyciela po jego ID
export const fetchTeacherReviewsById = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const apiUrl = `https://iamkrytas.smallhost.pl/get_reviews/${id}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać ocen nauczyciela' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano oceny nauczyciela', reviews: data.reviews };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Rejestaracja nowego nauczyciela
export const registerNewTeacher = async (firstName, lastName, subject, price) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/register_teacher';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                subject,
                price
            }),
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { message: data.message || 'Nie udało się zarejestrować nauczyciela' };
        }

        await AsyncStorage.removeItem('role');
        await AsyncStorage.setItem('role', JSON.stringify(data.role));

        return { success: true, message: data.message || 'Pomyślnie zarejestrowano nauczyciela' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie wszystkich nauczycieli
export const fetchAllTeachers = async () => {
    const apiUrl = `https://iamkrytas.smallhost.pl/get_all_teachers`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać nauczycieli' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano nauczycieli', teachers: data.teachers };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Ocena nauczyciela
export const rateTeacher = async (id, rating, comment) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/rate_teacher/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating,
                comment
            }),
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { message: data.message || 'Nie udalo się ocenić nauczyciela' };
        }

        return { success: true, message: data.message || 'Pomyślnie oceniono nauczyciela' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie wszystkich ocen nauczycieli
export const fetchAllRates = async () => {
    const apiUrl = `https://iamkrytas.smallhost.pl/get_all_rates`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać ocen' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano oceny', rates: data.rates };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Usuwanie oceny nauczyciela
export const deleteRate = async (id) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/delete_rate/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });


        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się usunąć oceny' };
        }

        return { success: true, message: data.message || 'Pomyślnie usunięto ocenę' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Aktualizaacja profilu nauczyciela
export const updateMyTeacherProfile = async (name, bio, description, price, subject, level) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/update_my_teacher_profile`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                bio,
                description,
                price,
                subject,
                level
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zaktualizować profilu' };
        }

        return { success: true, message: data.message || 'Pomyślnie zaktualizowano profil' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie wszystkich rezerwacji nauczyciela
export const fetchMyTeacherBookings = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_my_teacher_bookings';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać rezerwacji' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano rezerwacje', bookings: data.bookings };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Anulowanie rezerwacji nauczyciela
export const cancelMyTeacherBooking = async (id) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/cancel_my_teacher_booking/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się anulować rezerwacji' };
        }

        return { success: true, message: data.message || 'Pomyślnie anulowano rezerwację' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Zmiana statusu nauczyciela
export const changeStatusTeacher = async (id) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/change_status_teacher/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się zmienić statusu nauczyciela' };
        }

        return { success: true, message: data.message || 'Pomyślnie zmieniono status nauczyciela' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

//  Usunięcie nauczyciela
export const deleteTeacher = async (id) => {
    const apiUrl = `https://iamkrytas.smallhost.pl/delete_teacher/${id}`;
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się usunąć nauczyciela' };
        }

        return { success: true, message: data.message || 'Nauczyciel został pomyślnie usunięty' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};