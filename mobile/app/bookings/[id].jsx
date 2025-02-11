import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Dialog from 'react-native-dialog';
import { sendBookingData } from '../../api/bookingsApi';

const BookingScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);


  // Dostępne czasy trwania (w minutach)
  const availableDurations = ['30', '60', '90'];

  // Dostępne godziny rozpoczęcia zajęć
  const availableTimes = [
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
  ];

  // Zapisanie daty w kalendarzu
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Wyświetlenie dialogu potwierdzającego
  const showDialog = () => {
    if (!selectedDate || !selectedTime || !selectedDuration) {
      alert('Proszę wypełnić wszystkie pola!');
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentDateTime = new Date();

    if (selectedDateTime < currentDateTime) {
      alert('Nie można zarezerwować terminu na dzień, który już minął.');
      return;
    }

    const hours24 = 24 * 60 * 60 * 1000;
    const timeDifference = selectedDateTime - currentDateTime;

    if (timeDifference < hours24) {
      alert('Nie można zarezerwować na mniej niż 24 godziny przed rozpoczęciem.');
      return;
    }

    setDialogVisible(true);
  };

  // Ukrycie dialogu potwierdzającego
  const hideDialog = () => {
    setDialogVisible(false);
  };

  // Wysłanie danych rezerwacji
  const handleConfirm = async () => {
    try {
      const response = await sendBookingData(selectedDate, selectedTime, selectedDuration, id);
      if (response.success) {
        Alert.alert(
          'Rezerwacja powiodła się!',
          'Twoje zajęcia zostały zarezerwowane.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/home'),
              style: 'cancel',
            }
          ]
        );
      } else {
        Alert.alert('Błąd', response.message);
      }
    }
    catch (error) {
      console.error('Błąd podczas wysyłania rezerwacji:', error);
    }
    finally {
      setDialogVisible(false);
      hideDialog();
    }
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Rezerwacja Zajęć</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: '#6200ea' },
            }}
            style={styles.calendar}
            theme={{
              selectedDayBackgroundColor: '#007bff',
              todayTextColor: '#6200ea',
              dayTextColor: '#2d4150',
              textMonthFontWeight: 'bold',
              monthTextColor: '#6200ea',
              arrowColor: '#6200ea',
            }}
          />
        </View>

        <Text style={styles.label}>Czas rozpoczęcia:</Text>
        <Picker
          selectedValue={selectedTime}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
        >
          <Picker.Item label="Wybierz godzinę" value="" />
          {availableTimes.map((time) => (
            <Picker.Item key={time} label={time} value={time} />
          ))}
        </Picker>

        <Text style={styles.label}>Czas trwania (w minutach):</Text>
        <Picker
          selectedValue={selectedDuration}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDuration(itemValue)}
        >
          <Picker.Item label="Wybierz czas trwania" value="" />
          {availableDurations.map((duration) => (
            <Picker.Item key={duration} label={`${duration} minut`} value={duration} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.confirmButton} onPress={showDialog}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.confirmText}>Potwierdź rezerwację</Text>
        </TouchableOpacity>

        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Potwierdź rezerwację</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy na pewno chcesz zarezerwować zajęcia na {selectedDate} o godzinie {selectedTime} na {selectedDuration} minut?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={hideDialog} />
          <Dialog.Button label="Potwierdź" onPress={handleConfirm} />
        </Dialog.Container>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Cofnij</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    maxWidth: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
    padding: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    marginBottom: 15,
  },
  confirmText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;