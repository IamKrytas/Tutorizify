import AsyncStorage from '@react-native-async-storage/async-storage';

// Pobieranie listy przedmiotów
export const fetchAllSubjects = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/subjects';
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
            return { message: data.message || 'Nie udało się pobrać przedmiotów' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano przedmioty', subjects: data.subjects };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie listy poziomów
export const fetchAllLevels = async () => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_all_levels';
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
            return { success: false, message: data.message || 'Nie udało się pobrać listy poziomów' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano poziomy przedmiotów', levels: data.levels };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Dodawanie nowego przedmiotu
export const addSubject = async (subject) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/add_subject';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject,
            }),
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { message: data.message || 'Nie udało się dodać przedmiotu' };
        }

        return { success: true, message: data.message || 'Przedmiot został pomyślnie dodany' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Aktualizacja przedmiotu
export const updateSubject = async (id, subject) => {
    const apiUrl = 'https://iamkrytas.smallhost.pl/update_subject';
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                subject,
            }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { message: data.message || 'Nie udało się zaktualizować przedmiotu' };
        }

        return { success: true, message: data.message || 'Przedmiot został pomyślnie zaktualizowany' };

    } catch (error) {
        return { message: 'Wystąpił błąd po stronie serwera' };
    }
};