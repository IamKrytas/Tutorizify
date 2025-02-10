import { getBackendAddress } from '../app/getBackendAddress';

// Pobieranie danych profilu użytkownika
export const fetchUserData = async () => {
    const apiUrl = getBackendAddress('/get_user_info');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się pobrać danych użytkownika' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrałem dane użytkownika', user: data.user };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};


// Aktualizacja danych użytkownika
export const updateUserData = async (username) => {
    const apiUrl = getBackendAddress('/update_profile');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się zaktualizować danych użytkownika' };
        }

        return { success: true, message: data.message || 'Poprawnie zaktualizowano dane użytkownika' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie moich danych jako nauczyciel
export const fetchMyTeacherProfile = async () => {
    const apiUrl = getBackendAddress('/get_my_teacher_profile');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się pobrać mojego profilu nauczyciela' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano mój profil nauczyciela', teacher: data.teacher };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};