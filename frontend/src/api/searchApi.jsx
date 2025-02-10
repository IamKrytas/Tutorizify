import { getBackendAddress } from '../app/getBackendAddress';

// Pobieranie listy nauczycieli
export const fetchTeachers = async () => {
  try {
    const apiUrl = getBackendAddress('/get_teachers');
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
      return { success: false, message: data.message || 'Nie udało się pobrać nauczycieli' };
    }

    return { success: true, message: data.message || 'Pomyślnie pobrano nauczycieli', teachers: data.teachers };

  } catch (error) {
    return { success: false, message: 'Wystąpił błąd po stronie serwera' };
  }
};