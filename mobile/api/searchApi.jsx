import AsyncStorage from '@react-native-async-storage/async-storage';

// Pobieranie listy nauczycieli
export const fetchTeachers = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const apiUrl = 'https://iamkrytas.smallhost.pl/get_teachers';

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