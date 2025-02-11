import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { fetchUserBookings, cancelBooking } from '../../api/bookingsApi';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageBookingsScreen = () => {
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [role, setRole] = useState(null);

  const router = useRouter();

  // Pobieranie roli użytkownika
  const fetchRole = async () => {
    try {
      const role = await AsyncStorage.getItem('role');
      setRole(role);
    } catch (error) {
      console.error('Błąd podczas pobierania roli:', error);
    }
  };

  // Funkcja odświeżania ekranu
  const onRefresh = useCallback(() => {
    const now = new Date().getTime();
    if (lastRefreshTime && now - lastRefreshTime < 30000) {
      console.log("Odświeżanie jest zablokowane, musisz poczekać 30 sekund.");
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(now);

    fetchBookings();
    fetchRole();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, [lastRefreshTime]);


  useEffect(() => {
    fetchBookings();
    fetchRole();
  }, []);

  // Pobieranie rezerwacji użytkownika
  const fetchBookings = async () => {
    try {
      const response = await fetchUserBookings();
      if (response.success) {
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
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd pobierania rezerwacji:', error);
    }
  };

  // Funkcja informująca o zbyt późnym anulowaniu rezerwacji
  const handleInfoPress = () => {
    Alert.alert(
      'Informacja o anulowaniu',
      'Rezerwacje można anulować tylko do 24 godzin przed terminem rozpoczęcia.'
    );
  };

  // Funkcja wyświetlająca alert z pytaniem o anulowanie rezerwacji
  const handleCancelBooking = (bookingId, bookingDate) => {
    const bookingMoment = moment(bookingDate);
    const hoursUntilBooking = bookingMoment.diff(moment(), 'hours');

    if (hoursUntilBooking < 24) {
      Alert.alert(
        'Zbyt późno na anulowanie',
        'Rezerwacje można anulować tylko do 24 godzin przed terminem rozpoczęcia.'
      );
      return;
    }

    Alert.alert(
      'Anulowanie rezerwacji',
      'Czy na pewno chcesz anulować tę rezerwację?',
      [
        { text: 'Nie', style: 'cancel' },
        { text: 'Tak', onPress: () => cancelYourBooking(bookingId) },
      ]
    );
  };

  // Funkcja anulowania rezerwacji
  const cancelYourBooking = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId);
      if (response.success) {
        fetchBookings();
        Alert.alert('Sukces', response.message);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd anulowania rezerwacji:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Zarządzaj Rezerwacjami</Text>
          <Text style={styles.headerSubtitle}>Tutaj znajdziesz informacje o swoich rezerwacjach</Text>
        </View>

        {(role === '2' || role === '1') ? (
          <TouchableOpacity
            style={styles.manageBookingsContainer}
            onPress={() => router.push('bookings/manage')}
          >
            <Ionicons name="calendar" size={24} color="#6200ea" />
            <Text style={styles.cancelButtonText}>Zarządzaj rezerwacjami do mnie</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.sectionTitle}>Przyszłe rezerwacje</Text>
        {futureBookings.length > 0 ? (
          futureBookings.map((item) => {
            const bookingMoment = moment(`${item.date} ${item.start_time}`);
            const hoursUntilBooking = bookingMoment.diff(moment(), 'hours');
            const canCancel = hoursUntilBooking >= 24;

            return (
              <View style={styles.bookingCard} key={item.id}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>{item.subject} | {item.level}</Text>
                  <Text style={styles.bookingTeacher}>Nauczyciel: {item.teacher_name}</Text>
                  <Text style={styles.bookingTime}>
                    {item.date} | {item.start_time} - {item.end_time}
                  </Text>
                  <Text style={styles.bookingTime}>
                    Cena: {item.price} PLN/H
                  </Text>
                </View>

                {canCancel ? (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelBooking(item.id, `${item.date} ${item.start_time}`)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff1744" />
                    <Text style={styles.cancelButtonText}>Anuluj</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
                    <Ionicons name="information-circle" size={24} color="#6200ea" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyMessage}>Brak przyszłych rezerwacji</Text>
        )}

        <Text style={styles.sectionTitle}>Historyczne rezerwacje</Text>
        {pastBookings.length > 0 ? (
          pastBookings.map((item) => (
            <View style={styles.bookingCard} key={item.id}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{item.subject} | {item.level}</Text>
                <Text style={styles.bookingTeacher}>Nauczyciel: {item.teacher_name}</Text>
                <Text style={styles.bookingTime}>
                  {item.date} | {item.start_time} - {item.end_time}
                </Text>
                <Text style={styles.bookingTime}>
                  Cena: {item.price} PLN/H
                </Text>
                

                {item.has_rated ? (
                  <Text style={styles.ratedButtonText}>Oceniono</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.push(`/teachers/rates/${item.teacher_id}`)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="star" size={24} color="#FFD700" />
                      <Text style={styles.rateButtonText}>Oceń</Text>
                    </View>
                  </TouchableOpacity>
                )}

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
  rateButtonText: {
    marginLeft: 5,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  ratedButtonText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '800',
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
  manageBookingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconStyle: {
    marginRight: 10,
  },
  manageBookingsText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6200ea',
  },
});

export default ManageBookingsScreen;
