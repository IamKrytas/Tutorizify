import AsyncStorage from '@react-native-async-storage/async-storage';

// Logowanie
export const loginRequest = async (email, password) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/login';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();


        if (response.status != 200) {
            console.log(data.message);
            return { message: data.message || 'Nie udało się zalogować' };
        }

        const role = data.role;
        const token = data.token;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', JSON.stringify(role));

        return { success: true, message: data.message || 'Poprawnie zalogowano' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};


// Rejestracja
export const registerRequest = async (username, email, password, confirmPassword, avatarUri) => {

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (avatarUri) {
        formData.append('avatar', {
            uri: avatarUri,
            type: 'image/jpeg',
            name: `avatar_${email}.jpg`,
        });
    }

    const apiUrl = 'https://iamkrytas.smallhost.pl/register';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { message: data.message || 'Nie udało się zarejestrować' };
        }

        const token = data.token;
        const role = data.role;

        if (token && role) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role');

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('role', JSON.stringify(role));

            return { success: true, message: data.message || 'Poprawnie zarejestrowano' };

        } else {
            return { message: 'Nie udało się zarejestrować' };
        }
    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};



// Zmiana emaila użytkownika
export const changeUserEmail = async (newEmail, password) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/change_email';
    const token = await AsyncStorage.getItem('token');
    console.log(newEmail, password);
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newEmail,
                password,
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zmienić adresu email' };
        }

        return { success: true, message: data.message || 'Poprawnie zmieniono adres email' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Usunięcie konta użytkownika
export const deleteUser = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/delete_account';
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
            return { message: data.message || 'Nie udało się usunąć konta' };
        }

        await AsyncStorage.removeItem('token');
        return { success: true, message: data.message || 'Poprawnie usunięto konto' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Zmiana hasła użytkownika
export const changePassword = async (password, old_password) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/change_password';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password,
                old_password
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zmienić hasła' };
        }

        return { success: true, message: data.message || 'Poprawnie zmieniono hasło' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Wylogowanie użytkownika
export const logoutRequest = async () => {
    const token = await AsyncStorage.getItem('token');
    const apiUrl = 'https://iamkrytas.smallhost.pl/logout';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się wylogować' };
        }

        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('role');
        return { success: true, message: data.message || 'Poprawnie wylogowano' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie wszystkich dostępnych ról
export const fetchAllRoles = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_roles';
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
            return { message: data.message || 'Nie udało się pobrać ról' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano role', roles: data.roles };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

//  Aktualizacja avataru użytkownika
export const updateUserAvatar = async (avatarUri) => {

    const formData = new FormData();

    if (avatarUri) {
        formData.append('avatar', {
            uri: avatarUri,
            type: 'image/jpeg',
            name: `avatar.jpg`,
        });
    }

    const apiUrl = 'https://iamkrytas.smallhost.pl/update_avatar';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zaktualizować zdjęcia profilowego' };
        }
        return { success: true, message: data.message || 'Poprawnie zaktualizowano zdjęcie profilowe' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};