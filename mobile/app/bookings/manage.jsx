import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyTeacherBookings, cancelMyTeacherBooking } from '../../api/teachersApi';

const BookingsManage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Funkcja pobierająca rezerwacje
  const fetchBookings = async () => {
    try {
      const response = await fetchMyTeacherBookings();
      if (response.message) {
        setBookings(response.bookings);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd przy pobieraniu rezerwacji: ', error);
    }
  };

  // Funkcja anulowania rezerwacji
  const handleCancelBooking = async (bookingId) => {
    Alert.alert('Anulowanie rezerwacji', 'Czy na pewno chcesz anulować rezerwację?', [
      {
        text: 'Anuluj',
        style: 'cancel',
      },
      {
        text: 'Anuluj rezerwację',
        onPress: () => cancelBooking(bookingId),
      },
    ]);
  };

  // Funkcja anulowania rezerwacji
  const cancelBooking = async (bookingId) => {
    try {
      const response = await cancelMyTeacherBooking(bookingId);

      if (response.message) {
        Alert.alert('Sukces', response.message);
        fetchBookings();
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd przy anulowaniu rezerwacji: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezerwacje uczniów na twoje zajęcia</Text>

      {bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>Brak rezerwacji</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const canCancel = new Date(item.date) > new Date();

            return (
              <View style={styles.bookingCard}>
                <Text style={styles.bookingDetails}>Użytkownik: {item.user_name}</Text>
                <Text style={styles.bookingDetails}>Przedmiot: {item.subject}</Text>
                <Text style={styles.bookingDetails}>Poziom: {item.level}</Text>
                <Text style={styles.bookingDetails}>Cena: {item.price} PLN/H</Text>
                <Text style={styles.bookingDetails}>Data: {item.date}</Text>
                <Text style={styles.bookingDetails}>{item.date} | {item.start_time} - {item.end_time}</Text>

                {canCancel ? (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelBooking(item.id)}
                  >
                    <Ionicons name="close-circle" size={24} color="red" />
                    <Text style={styles.cancelButtonText}>Anuluj</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  noBookingsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});

export default BookingsManage;
