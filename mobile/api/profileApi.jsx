import AsyncStorage from '@react-native-async-storage/async-storage';

// Pobieranie danych profilu użytkownika
export const fetchUserData = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_user_info';
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
            return { message: data.message || 'Nie udało się pobrać danych użytkownika' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrałem dane użytkownika', user: data.user };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};


// Aktualizacja danych użytkownika
export const updateUserData = async (username) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/update_profile';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zaktualizować danych użytkownika' };
        }

        return { success: true, message: data.message || 'Poprawnie zaktualizowano dane użytkownika' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie moich danych jako nauczyciel
export const fetchMyTeacherProfile = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_my_teacher_profile';
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
            return { message: data.message || 'Nie udało się pobrać mojego profilu nauczyciela' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano mój profil nauczyciela', teacher: data.teacher };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};