import AsyncStorage from '@react-native-async-storage/async-storage';

// Pobieranie wszystkich użytkowników
export const fetchAllUsers = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const apiUrl = 'https://iamkrytas.smallhost.pl/get_users';

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się pobrać użytkowników' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano użytkowników', users: data.users };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

//  Zmiana roli użytkownika
export const changeUserRole = async (user_id, role) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const apiUrl = 'https://iamkrytas.smallhost.pl/change_role';

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
            return { message: data.message || 'Nie udało się zmienić roli użytkownika' };
        }

        return { success: true, message: data.message || 'Rola użytkownika została pomyślnie zmieniona' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};