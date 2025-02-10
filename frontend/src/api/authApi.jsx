import { getBackendAddress } from '../app/getBackendAddress';

// Logowanie
export const loginRequest = async (email, password) => {
    try {
        const apiUrl = getBackendAddress('/login');
        console.log(apiUrl);
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
            return { success: false, message: data.message || 'Nie udało się zalogować' };
        }

        const role = data.role;
        const token = data.token;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', JSON.stringify(role));

        return { success: true, message: data.message || 'Poprawnie zalogowano' };

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Wystąpił błąd podczas wysyłania żądania' };
    }
};


// Rejestracja
export const registerRequest = async (username, email, password, confirmPassword, avatarFile) => {

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (avatarFile) {
        formData.append('avatar', avatarFile, 'avatar.jpg');
    }

    const apiUrl = getBackendAddress('/register');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { success: false, message: data.message || 'Nie udało się zarejestrować' };
        }

        const role = data.role;
        const token = data.token;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', JSON.stringify(role));

        return { success: true, message: data.message || 'Poprawnie zarejestrowano' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};



// Zmiana emaila użytkownika
export const changeUserEmail = async (newEmail, password) => {
    const apiUrl = getBackendAddress('/change_email');
    const token = sessionStorage.getItem('token');
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
    const apiUrl = getBackendAddress('/delete_account');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się usunąć konta' };
        }

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');

        return { success: true, message: data.message || 'Poprawnie usunięto konto' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Zmiana hasła użytkownika
export const changePassword = async (password, old_password) => {
    const apiUrl = getBackendAddress('/change_password');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się zmienić hasła' };
        }

        return { success: true, message: data.message || 'Poprawnie zmieniono hasło' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Wylogowanie użytkownika
export const logoutRequest = async () => {
    const apiUrl = getBackendAddress('/logout');
    const token = sessionStorage.getItem('token');
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

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        return { success: true, message: data.message || 'Poprawnie wylogowano' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobranie wszystkich dostępnych ról
export const fetchAllRoles = async () => {
    const apiUrl = getBackendAddress('/get_roles');
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
            return { success: false, message: data.message || 'Nie udało się pobrać ról' };
        }

        return { success: true, message: data.message || 'Poprawnie pobrano role', roles: data.roles };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

//  Aktualizacja avataru użytkownika
export const updateUserAvatar = async (avatarFile) => {

    const formData = new FormData();

    if (avatarFile) {
        formData.append('avatar', avatarFile, 'avatar.jpg');
    }
    
    const apiUrl = getBackendAddress('/update_avatar');
    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });


        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || 'Nie udało się zaktualizować zdjęcia profilowego' };
        }
        return { success: true, message: data.message || 'Poprawnie zaktualizowano zdjęcie profilowe' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};