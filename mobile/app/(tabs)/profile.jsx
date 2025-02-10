import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import { useRouter } from 'expo-router';
import { fetchUserData, updateUserData, fetchMyTeacherProfile } from '../../api/profileApi';
import { deleteUser, changeUserEmail, logoutRequest, changePassword, updateUserAvatar } from '../../api/authApi';
import { updateMyTeacherProfile } from '../../api/teachersApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { fetchAllSubjects, fetchAllLevels } from '../../api/subjectsApi';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  // Dane użytkownika
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [username, setUsername] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState(null);


  // Dane nauczyciela
  const [teacherName, setTeacherName] = useState('');
  const [teacherBio, setTeacherBio] = useState('');
  const [teacherDescription, setTeacherDescription] = useState('');
  const [teacherPrice, setTeacherPrice] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherLevel, setTeacherLevel] = useState('');
  const [teacherRating, setTeacherRating] = useState('');
  const [teacherStatus, setTeacherStatus] = useState('');
  const [subjectsList, setSubjectsList] = useState('');
  const [levelsList, setLevelsList] = useState('');

  // Dialogi
  const [editProfile, setEditProfile] = useState(false);
  const [editTeacherProfile, setEditTeacherProfile] = useState(false);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isConfirmDialogProfileVisible, setIsConfirmProfileDialogVisible] = useState(false);
  const [isConfirmDialogProfileTeacherVisible, setIsConfirmProfileTeacherDialogVisible] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEmailDialogVisible, setIsEmailDialogVisible] = useState(false);
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  const router = useRouter();

  // Funkcja odświeżania ekranu
  const onRefresh = useCallback(() => {
    const now = new Date().getTime();
    if (lastRefreshTime && now - lastRefreshTime < 30000) {
      console.log("Odświeżanie jest zablokowane, musisz poczekać 30 sekund.");
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(now);

    getUserData();
    fetchRole();
    if (role === '1' || role === '2') {
      fetchTeacherProfile();
      loadSubjects();
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, [lastRefreshTime]);


  // Pobiera danych użytkownika
  const getUserData = async () => {
    try {
      const response = await fetchUserData();
      if (response.success) {
        setEmail(response.user.email);
        setUsername(response.user.username);
        setRegistrationDate(response.user.registration_date);
        setImageUrl(response.user.avatar);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  };

  // Pobieranie roli użytkownika
  const fetchRole = async () => {
    try {
      const role = await AsyncStorage.getItem('role');
      setRole(role);
    } catch (error) {
      console.error('Błąd podczas pobierania roli:', error);
    }
  };

  // Funkcja do pobierania poziomów nauczania
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      if (response.success) {
        setLevelsList(response.levels);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error("Błąd pobierania poziomów:", error);
    }
  };

  // Pobieranie danych nauczyciela
  const fetchTeacherProfile = async () => {
    try {
      const response = await fetchMyTeacherProfile();
      if (response.success) {
        setTeacherName(response.teacher.name);
        setTeacherBio(response.teacher.bio);
        setTeacherDescription(response.teacher.description);
        setTeacherPrice(response.teacher.price);
        setTeacherSubject(response.teacher.subject);
        setTeacherLevel(response.teacher.level);
        setTeacherRating(response.teacher.rating);
        setTeacherStatus(response.teacher.status);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych o twoim profilu nauczyciela:', error);
    }
  };

  useEffect(() => {
    fetchRole();
    getUserData();

    if (role === '1' || role === '2') {
      fetchTeacherProfile();
      loadSubjects();
      loadLevels();
    }
  }, [role]);


  // Funkcja do wylogowania
  const handleLogout = async () => {
    try {
      await logoutRequest();
      router.replace('/login');
      console.log('Wylogowano pomyślnie.');
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error);
    }
  };

  // Potwierdzenie wylogowania
  const handleConfirmLogout = () => {
    setIsDialogVisible(false);
    handleLogout();
  };

  // Funkcja do edycji danych użytkownika
  const handleEditProfile = () => {
    if (editProfile) {
      setIsConfirmProfileDialogVisible(true);
    } else {
      setEditProfile(true);
    }
  };

  // Funkcja do edycji danych nauczyciela
  const handleEditProfileTeacher = () => {
    if (editTeacherProfile) {
      setIsConfirmProfileTeacherDialogVisible(true);
    } else {
      setEditTeacherProfile(true);
    }
  };

  // Funkcja do anulowania zmian e-maila
  const handleCancelEmailChange = () => {
    setIsEmailDialogVisible(false);
    setPassword('');
    setNewEmail('');
  };

  // Funkcja do anulowania zmian hasła
  const handleCancelChangePassword = () => {
    setIsPasswordDialogVisible(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };


  // Funkcja do potwierdzenia zapisu zmian profilu
  const handleConfirmSaveProfile = async () => {
    const validUsername = username.trim();
    const regex = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
    if (validUsername.length === 0 || !validUsername.match(regex)) {
      Alert.alert('Błąd', 'Nazwa użytkownika nie może być pusta ani zawierać znaków specjalnych.');
      setIsConfirmProfileDialogVisible(false);
      return;
    }
    setIsConfirmProfileDialogVisible(false);
    try {
      const response = await updateUserData(validUsername);
      if (response.success) {
        setEditProfile(false);
        getUserData();
        Alert.alert('Sukces', response.message);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować profilu.');
    }
  };

  // Funkcja do potwierdzenia zapisu zmian profilu nauczyciela
  const handleConfirmSaveProfileTeacher = async () => {
    if (typeof teacherName !== 'string' || teacherName.trim().length < 6 || teacherPrice <= 0 || !teacherSubject || !teacherLevel) {
      console.log(teacherName, teacherPrice, teacherSubject);
      Alert.alert('Błąd', 'Imię i nazwisko musi mieć minimum 6 znaków, a cena i przedmiot nie mogą być puste.');
      setIsConfirmProfileTeacherDialogVisible(false);
      return;
    }

    const validName = teacherName.trim();
    const validBio = typeof teacherBio === 'string' ? teacherBio.trim() : "";
    const validDescription = typeof teacherDescription === 'string' ? teacherDescription.trim() : "";
    const validPrice = teacherPrice;

    setIsConfirmProfileTeacherDialogVisible(false);
    try {
      const response = await updateMyTeacherProfile(validName, validBio, validDescription, validPrice, teacherSubject, teacherLevel);
      if (response.success) {
        setEditTeacherProfile(false);
        fetchTeacherProfile();
        Alert.alert('Sukces', response.message);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu nauczyciela:', error);
    }
  };


  // Funkcja do anulowania zapisu zmian profilu
  const handleCancelProfileSave = () => {
    setIsConfirmProfileDialogVisible(false);
    setEditProfile(false);
    getUserData();
  };

  // Funkcja do anulowania zapisu zmian profilu nauczyciela
  const handleCancelProfileTeacherSave = () => {
    setIsConfirmProfileTeacherDialogVisible(false);
    setEditTeacherProfile(false);
    fetchTeacherProfile();
  };

  // Funkcja do zmiany e-maila
  const handleEmailChange = async () => {
    if (!newEmail.includes('@')) {
      Alert.alert('Błąd', 'Wprowadź prawidłowy adres e-mail.');
      return;
    }
    try {
      const response = await changeUserEmail(newEmail, password);
      if (response.success) {
        setEmail(newEmail);
        setIsEmailDialogVisible(false);
        setPassword('');
        setNewEmail('');
        handleLogout();
        Alert.alert('Sukces', 'E-mail został zmieniony pomyślnie.');
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas zmiany e-maila:', error);
      Alert.alert('Błąd', 'Nie udało się zmienić e-maila.');
    }
  };

  // Funkcja do usunięcia konta
  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser();
      if (response.success) {
        router.replace('/index');
        Alert.alert('Sukces', response.message);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas usuwania konta:', error);
    }
  };

  // Funkcja do zmiany hasła
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Błąd', 'Podane hasła nie są identyczne.');
      return;
    }
    try {
      const response = await changePassword(newPassword, password);
      if (response.success) {
        Alert.alert('Sukces', response.message);
        setIsPasswordDialogVisible(false);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas zmiany hasła:', error);
      Alert.alert('Błąd', 'Nie udało się zmienić hasła.');
    }
  }

  // Funkcja do zmiany zdjęcia profilowego
  const handlerChangeImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        console.log("Image selection was canceled.");
        return;
      }

      const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;

      if (!uri) {
        console.log("No URI found in the selected image.");
        return;
      }

      setImageUrl(uri);
      console.log("Selected image URI:", uri);

      const response = await updateUserAvatar(uri);
      if (response.success) {
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }

    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  // Funkcja do pobrania przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchAllSubjects();
      if (response.success) {
        setSubjectsList(response.subjects);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error("Błąd pobierania przedmiotów:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handlerChangeImage()}>
            <Image
              source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
              resizeMode='cover'
              onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>{username}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.title}>Panel Użytkownika</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name={editProfile ? 'checkmark-outline' : 'pencil-outline'} size={36} color="#6200ea" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditProfile(false)}>
              <Ionicons name={editProfile ? 'close-outline' : null} size={36} color="#ff3b30" />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoLabel}>Nazwa użytkownika:</Text>
          {editProfile ? (
            <TextInput
              style={styles.infoInput}
              value={username}
              onChangeText={setUsername}
            />
          ) : (
            <Text style={styles.infoText}>{username}</Text>
          )}
          <Text style={styles.infoLabel}>E-mail:</Text>
          <Text style={styles.infoText}>{email}</Text>
          <Text style={styles.infoLabel}>Data rejestracji:</Text>
          <Text style={styles.infoText}>{registrationDate}</Text>
        </View>

        {(role === '2' || role === '1') ? (
          <View style={styles.infoCard}>
            <Text style={styles.title}>Panel Nauczyciela</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfileTeacher}>
                <Ionicons name={editTeacherProfile ? 'checkmark-outline' : 'pencil-outline'} size={36} color="#6200ea" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setEditTeacherProfile(false)}>
                <Ionicons name={editTeacherProfile ? 'close-outline' : null} size={36} color="#ff3b30" />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoLabel}>Imię i nazwisko:</Text>
            {editTeacherProfile ? (
              <TextInput
                style={styles.infoInput}
                value={teacherName}
                placeholder="Wpisz imię i nazwisko"
                onChangeText={setTeacherName}
              />
            ) : (
              <Text style={styles.infoText}>{teacherName}</Text>
            )}
            <Text style={styles.infoLabel}>Bio:</Text>
            {editTeacherProfile ? (
              <TextInput
                style={styles.infoInput}
                value={teacherBio}
                placeholder="Wpisz swoje bio"
                onChangeText={setTeacherBio}
              />
            ) : (
              <Text style={styles.infoText}>{teacherBio}</Text>
            )}
            <Text style={styles.infoLabel}>Opis:</Text>
            {editTeacherProfile ? (
              <TextInput
                style={styles.infoInput}
                value={teacherDescription}
                placeholder="Wpisz opis"
                onChangeText={setTeacherDescription}
              />
            ) : (
              <Text style={styles.infoText}>{teacherDescription}</Text>
            )}
            <Text style={styles.infoLabel}>Cena za godzinę:</Text>
            {editTeacherProfile ? (
              <TextInput
                style={styles.infoInput}
                value={teacherPrice.toString()}
                placeholder="Wpisz cenę"
                keyboardType="numeric"
                onChangeText={setTeacherPrice}
              />
            ) : (
              <Text style={styles.infoText}>{teacherPrice.toString()}</Text>
            )}
            <Text style={styles.infoLabel}>Przedmiot:</Text>
            {editTeacherProfile ? (
              <Picker
                selectedValue={teacherSubject}
                style={styles.picker}
                onValueChange={(itemValue) => setTeacherSubject(itemValue)}
              >
                <Picker.Item label="Wybierz przedmiot" value="" />
                {subjectsList.map((subj) => (
                  <Picker.Item key={subj.id} label={subj.name} value={subj.name} />
                ))}
              </Picker>
            ) : (
              <Text style={styles.infoText}>{teacherSubject}</Text>
            )}
            <Text style={styles.infoLabel}>Poziom:</Text>
            {editTeacherProfile ? (
              <Picker
                selectedValue={teacherLevel}
                style={styles.picker}
                onValueChange={(itemValue) => setTeacherLevel(itemValue)}
              >
                <Picker.Item label="Wybierz poziom" value="" />
                {levelsList.map((level) => (
                  <Picker.Item key={level.id} label={level.name} value={level.name} />
                ))}
              </Picker>
            ) : (
              <Text style={styles.infoText}>{teacherLevel}</Text>
            )}
            <Text style={styles.infoLabel}>Ocena:</Text>
            <Text style={styles.infoText}>
              {teacherRating === '0' ? 'Brak ocen' : teacherRating}
            </Text>


            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoText}>
            {teacherStatus === 1 ? 'Aktywny' : 'Nieaktywny'}
            </Text>
          </View>
        ) : null}

        {role === '1' ? (
          <View style={styles.infoCard}>
            <Text style={styles.title}>Administrator Panel</Text>
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('admin/users')}
              >
                <Ionicons name="people-outline" size={22} color="#6200ea" />
                <Text style={styles.settingsButtonText}>Panel Użytkowników</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('admin/teachers')}
            >
              <Ionicons name="school-outline" size={22} color="#6200ea" />
              <Text style={styles.settingsButtonText}>Panel Nauczycieli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('admin/subjects')}
            >
              <Ionicons name="book-outline" size={22} color="#6200ea" />
              <Text style={styles.settingsButtonText}>Panel Przedmiotów</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('admin/bookings')}
            >
              <Ionicons name="calendar-outline" size={22} color="#6200ea" />
              <Text style={styles.settingsButtonText}>Panel Rezerwacji</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('admin/rates')}
            >
              <Ionicons name="person-circle-outline" size={22} color="#6200ea" />
              <Text style={styles.settingsButtonText}>Panel Ocen</Text>
            </TouchableOpacity>

          </View>
        ) : null}

        {role === '3' || role === '1' ? (
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('teachers/register')}>
              <Ionicons name="person-add-outline" size={22} color="#3c8c40" />
              <Text style={styles.settingsButtonText}>Zostań nauczycielem</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setIsEmailDialogVisible(true)}>
            <Ionicons name="mail-outline" size={22} color="#6200ea" />
            <Text style={styles.settingsButtonText}>Zmień e-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setIsPasswordDialogVisible(true)} >
            <Ionicons name="key-outline" size={22} color="#6200ea" />
            <Text style={styles.settingsButtonText}>Zmień hasło</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setIsDeleteDialogVisible(true)}>
            <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            <Text style={styles.settingsButtonText}>Usuń konto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setIsDialogVisible(true)}>
            <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
            <Text style={styles.settingsButtonText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>

        <Dialog.Container visible={isConfirmDialogProfileVisible}>
          <Dialog.Title style={{ color: '#333' }}>Potwierdź zmiany</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy chcesz zapisać wprowadzone zmiany?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={handleCancelProfileSave} />
          <Dialog.Button label="Zapisz" onPress={handleConfirmSaveProfile} />
        </Dialog.Container>

        <Dialog.Container visible={isConfirmDialogProfileTeacherVisible}>
          <Dialog.Title style={{ color: '#333' }}>Potwierdź zmiany</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy chcesz zapisać wprowadzone zmiany?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={handleCancelProfileTeacherSave} />
          <Dialog.Button label="Zapisz" onPress={handleConfirmSaveProfileTeacher} />
        </Dialog.Container>

        <Dialog.Container visible={isEmailDialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Zmień e-mail</Dialog.Title>
          <Dialog.Input
            placeholder="Nowy e-mail"
            value={newEmail}
            onChangeText={setNewEmail}
            style={{ color: '#333' }}
          />
          <Dialog.Input
            placeholder="Wprowadź hasło"
            secureTextEntry
            style={{ color: '#333' }}
            onChangeText={setPassword}
            value={password}
          />
          <Dialog.Button label="Anuluj" onPress={handleCancelEmailChange} />
          <Dialog.Button label="Zapisz" onPress={handleEmailChange} />
        </Dialog.Container>

        <Dialog.Container visible={isDeleteDialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Usuń konto</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={() => setIsDeleteDialogVisible(false)} />
          <Dialog.Button label="Usuń" onPress={handleDeleteAccount} />
        </Dialog.Container>

        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Wyloguj</Dialog.Title>
          <Dialog.Description style={{ color: '#333' }}>
            Czy na pewno chcesz się wylogować?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" onPress={() => setIsDialogVisible(false)} />
          <Dialog.Button label="Wyloguj" onPress={handleConfirmLogout} />
        </Dialog.Container>

        <Dialog.Container visible={isPasswordDialogVisible}>
          <Dialog.Title style={{ color: '#333' }}>Zmień hasło</Dialog.Title>
          <Dialog.Input
            placeholder="Nowe hasło"
            secureTextEntry
            style={{ color: '#333' }}
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <Dialog.Input
            placeholder="Powtórz hasło"
            secureTextEntry
            style={{ color: '#333' }}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <Dialog.Input
            placeholder="Stare hasło"
            secureTextEntry
            style={{ color: '#333' }}
            onChangeText={setPassword}
            value={password}
          />
          <Dialog.Button label="Anuluj" onPress={handleCancelChangePassword} />
          <Dialog.Button label="Zapisz" onPress={handleChangePassword} />
        </Dialog.Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#6200ea',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    marginTop: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});