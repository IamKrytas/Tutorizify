import { getBackendAddress } from '../app/getBackendAddress';

// Pobieranie listy dostępnych przedmiotów
export const fetchActiveSubjects = async () => {
    const apiUrl = getBackendAddress('/subjects');
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
            return { success: false, message: data.message || 'Nie udało się pobrać przedmiotów' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano przedmioty', subjects: data.subjects };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie listy poziomów
export const fetchAllLevels = async () => {
    const apiUrl = getBackendAddress('/get_all_levels');
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
            return { success: false, message: data.message || 'Nie udało się pobrać listy poziomów' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano poziomy przedmiotów', levels: data.levels };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Pobieranie listy wszystkich przedmiotów
export const fetchAllSubjects = async () => {
    const apiUrl = getBackendAddress('/get_all_subjects');
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
            return { success: false, message: data.message || 'Nie udało się pobrać przedmiotów' };
        }

        return { success: true, message: data.message || 'Pomyślnie pobrano przedmioty', subjects: data.subjects };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Dodawanie nowego przedmiotu
export const addSubject = async (subject) => {
    const apiUrl = getBackendAddress('/add_subject');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się dodać przedmiotu' };
        }

        return { success: true, message: data.message || 'Przedmiot został pomyślnie dodany' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Aktualizacja przedmiotu
export const updateSubject = async (id, subject) => {
    const apiUrl = getBackendAddress('/update_subject');
    const token = sessionStorage.getItem('token');
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
            return { success: false, message: data.message || 'Nie udało się zaktualizować przedmiotu' };
        }

        return { success: true, message: data.message || 'Przedmiot został pomyślnie zaktualizowany' };

    } catch (error) {
        return { success: false, message: 'Wystąpił błąd po stronie serwera' };
    }
};

// Zmiana statusu przedmiotu
// export const changeStatusSubject = async (subjectId) => {
//     const apiUrl = getBackendAddress('/change_status_subject');
//     const token = sessionStorage.getItem('token');
//     try {
//         const response = await fetch(apiUrl, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 subject_id: subjectId,
//             }),
//         });

//         const data = await response.json();

//         if (response.status !== 200) {
//             return { success: false, message: data.message || 'Nie udało się zaktualizować statusu przedmiotu' };
//         }

//         return { success: true, message: data.message || 'Przedmiot został pomyślnie zaktualizowany' };

//     } catch (error) {
//         return { success: false, message: 'Wystąpił błąd po stronie serwera' };
//     }
// };