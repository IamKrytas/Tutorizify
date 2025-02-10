import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderStars from '../../components/RenderStars';
import { fetchUserData, fetchDashboardData, fetchMyCurrentBookings, fetchMostPopularTeachers, fetchNotifications } from '../../api/dashboardApi';
import { logoutRequest } from '../../api/authApi';
import { useRouter } from 'expo-router';
import Dialog from 'react-native-dialog';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [mostPopularTeachers, setMostPopularTeachers] = useState([]);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Funkcja odświeżania ekranu
  const onRefresh = useCallback(() => {
    const now = new Date().getTime();
    if (lastRefreshTime && now - lastRefreshTime < 30000) {
      console.log("Odświeżanie jest zablokowane, musisz poczekać 30 sekund.");
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(now);

    getData();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, [lastRefreshTime]);

  useEffect(() => {
    getData();
  }, []);

  // Funkcja pobierająca informacje o użytkowniku
  const getData = async () => {
    try {
      const response = await fetchUserData();
      if (response.success) {
        setUserName(response.user.username);

        // Dashboard info
        const dashboardData = await fetchDashboardData();
        setTotalUsers(dashboardData.info.totalUsers);
        setTotalTeachers(dashboardData.info.totalTeachers);
        setTotalCourses(dashboardData.info.totalCourses);

        // Bookings info
        const myBookings = await fetchMyCurrentBookings();
        setMyBookings(myBookings);

        // Most popular teachers
        const mostPopularTeachers = await fetchMostPopularTeachers();
        setMostPopularTeachers(mostPopularTeachers);

      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie powiadomień
  const getNotifications = async () => {
    try {
      const response = await fetchNotifications();
      if (response.success) {
        setNotifications(response.notifications);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    }
  };

  // Funkcja wylogowująca użytkownika
  const handleLogout = async () => {
    try {
      await logoutRequest();
      router.replace('/login');
      console.log('Wylogowano pomyślnie');
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error);
    }
  };

  // Funkcje obsługujące dialog potwierdzający wylogowanie
  const handleConfirmLogout = () => {
    setIsDialogVisible(false);
    handleLogout();
  };

  // Funkcja anulująca wylogowanie
  const handleCancelLogout = () => {
    setIsDialogVisible(false);
  };

  // Funkcja wyświetlająca dialog potwierdzający wylogowanie
  const showLogoutDialog = () => {
    setIsDialogVisible(true);
  };

  // Funkcja do wyświetlania powiadomień
  const toggleModal = async () => {
    await getNotifications();
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Tutorizify</Text>
        <View style={styles.navIcons}>
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} onPress={toggleModal} />
          <Ionicons name="settings-outline" size={24} color="black" style={styles.icon} onPress={() => router.push('profile')} />
          <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} onPress={showLogoutDialog} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.dashboardContent} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Witaj {userName}!</Text>
          <Text style={styles.welcomeSubtitle}>Dobrze Cię widzieć ponownie!</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Użytkownicy</Text>
          <Text style={styles.cardValue}>{totalUsers}</Text>
          <Ionicons name="people-outline" size={40} color="#3c8c40" />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nauczyciele</Text>
          <Text style={styles.cardValue}>{totalTeachers}</Text>
          <Ionicons name="school-outline" size={40} color="#6200ea" />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Przedmioty</Text>
          <Text style={styles.cardValue}>{totalCourses}</Text>
          <Ionicons name="book-outline" size={40} color="#ff9800" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Twoje najbliższe rezerwacje</Text>
          {myBookings.bookings && myBookings.bookings.length > 0 ? (
            <>
              {myBookings.bookings.map((booking, index) => (
                <View key={index} style={styles.reservationCard}>
                  <Ionicons name="calendar-outline" size={30} color="#6200ea" />
                  <View style={styles.reservationInfo}>
                    <Text style={styles.reservationTitle}>{booking.subject}</Text>
                    <Text style={styles.reservationTeacher}>{booking.teacher_name}</Text>
                    <Text style={styles.reservationTime}>
                      {new Date(booking.date).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                      , {booking.start_time} - {booking.end_time}
                    </Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.searchButton} onPress={() => router.push('reservations')}>
                <Ionicons name="calendar-outline" size={30} color="white" />
                <Text style={styles.searchButtonText}>Zarządzaj rezerwacjami</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <Text>Brak rezerwacji do wyświetlenia</Text>
              {/* Przycisk do wyszukiwania zajęć */}
              <TouchableOpacity style={styles.searchButton} onPress={() => router.push('search')}>
                <Ionicons name="search-outline" size={18} color="white" />
                <Text style={styles.searchButtonText}>Znajdź zajęcia</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}> Proponowani nauczyciele </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {mostPopularTeachers.teachers && mostPopularTeachers.teachers.map((teacher, index) => (
              <TouchableOpacity key={index} style={styles.classCard} onPress={() => router.push('teachers/' + teacher.id)}>
                <Image
                  source={{ uri: teacher.image }}
                  style={styles.classImage}
                />
                <Text style={styles.classTitle}>{teacher.name}</Text>
                <Text style={styles.classTime}><RenderStars rating={teacher.rating} /></Text>
                <Text style={styles.classTime}>{teacher.subject}</Text>
                <Text style={styles.classTime}>{teacher.level}</Text>
                <Text style={styles.classTime}>{teacher.price} PLN/H</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Wyloguj</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy na pewno chcesz się wylogować?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={handleCancelLogout} />
          <Dialog.Button label="Wyloguj" onPress={handleConfirmLogout} />
        </Dialog.Container>
      </ScrollView>

      {/* Modal z powiadomieniami */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Powiadomienia</Text>

            {/* Lista powiadomień */}
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationDate}>{item.created_at}</Text>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              )}
              style={{ maxHeight: 400 }}
            />

            {/* Przycisk do zamknięcia modalu */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  welcomeSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  dashboardContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  cardTitle: {
    width: 150,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 150,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  classImage: {
    width: '100%',
    height: 100,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 6,
  },
  classTime: {
    fontSize: 14,
    color: '#777',
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    marginTop: 20,
  },
  reservationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  reservationInfo: {
    marginLeft: 15,
  },
  reservationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reservationTime: {
    fontSize: 14,
    color: '#777',
  },
  searchButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  accountButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  accountButtonText: {
    color: '#6200ea',
    marginLeft: 10,
    fontSize: 16,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // półprzezroczyste tło
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationDate: {
    fontSize: 14,
    color: '#777',
  },
  notificationText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  });