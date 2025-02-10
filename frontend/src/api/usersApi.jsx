import { getBackendAddress } from '../app/getBackendAddress';

// Pobieranie wszystkich użytkowników
export const fetchAllUsers = async () => {
    try {
        const apiUrl = getBackendAddress('/get_users');
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
            return { success: false, message: data.message || 'Nie udało się pobrać użytkowników' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano użytkowników', users: data.users };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

//  Zmiana roli użytkownika
export const changeUserRole = async (user_id, role) => {
    try {
        const apiUrl = getBackendAddress('/change_role');
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id,
                role
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się zmienić roli użytkownika' };
        }

        return { success: true, message: data.message || 'Rola użytkownika została pomyślnie zmieniona' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};