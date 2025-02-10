import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { fetchAllBookings } from '../../api/booking';

const AdminManageBookingsScreen = () => {
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Funkcja pobierająca rezerwacje
  const fetchBookings = async () => {
    try {
      const response = await fetchAllBookings();
      const now = moment();

      // Podział i sortowanie rezerwacji według daty
      const upcoming = response.bookings
        .filter(booking =>
          moment(`${booking.date} ${booking.start_time}`).isAfter(now)
        )
        .sort((a, b) =>
          moment(`${a.date} ${a.start_time}`).diff(moment(`${b.date} ${b.start_time}`))
        );

      const past = response.bookings
        .filter(booking =>
          moment(`${booking.date} ${booking.start_time}`).isBefore(now)
        )
        .sort((a, b) =>
          moment(`${b.date} ${b.start_time}`).diff(moment(`${a.date} ${a.start_time}`))
        );

      setFutureBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error('Błąd pobierania rezerwacji:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Zarządzaj Rezerwacjami</Text>
          <Text style={styles.headerSubtitle}>Tutaj możesz zarządzać rezerwacjami użytkowników</Text>
        </View>

        <Text style={styles.sectionTitle}>Przyszłe rezerwacje</Text>
        {futureBookings.length > 0 ? (
          futureBookings.map((item) => (
            <View style={styles.bookingCard} key={item.id}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{item.subject} | {item.level}</Text>
                <Text style={styles.bookingTeacher}>Rezerwujący: {item.user_name}</Text>
                <Text style={styles.bookingTeacher}>Nauczyciel: {item.teacher_name}</Text>
                <Text style={styles.bookingTime}>
                  {item.date} | {item.start_time} - {item.end_time}
                </Text>
                <Text style={styles.bookingTeacher}>Cena: {item.price} PLN/H</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Brak przyszłych rezerwacji</Text>
        )}

        <Text style={styles.sectionTitle}>Historyczne rezerwacje</Text>
        {pastBookings.length > 0 ? (
          pastBookings.map((item) => (
            <View style={styles.bookingCard} key={item.id}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{item.subject} | {item.level}</Text>
                <Text style={styles.bookingTeacher}>Rezerwujący: {item.user_name}</Text>
                <Text style={styles.bookingTeacher}>Nauczyciel: {item.teacher_name}</Text>
                <Text style={styles.bookingTime}>
                  {item.date} | {item.start_time} - {item.end_time}
                </Text>
                <Text style={styles.bookingTeacher}>Cena: {item.price} PLN/H</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Brak historycznych rezerwacji</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    marginTop: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  bookingTeacher: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  bookingTime: {
    fontSize: 14,
    color: '#6200ea',
    marginTop: 5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    marginLeft: 5,
    color: '#ff1744',
    fontSize: 14,
    fontWeight: '600',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default AdminManageBookingsScreen;
