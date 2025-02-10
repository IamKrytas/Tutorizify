import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchAllSubjects, fetchAllLevels } from '../../api/subjectsApi';
import { registerNewTeacher } from '../../api/teachersApi';
import { useRouter } from 'expo-router';

const RegisterTeacherScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subject, setSubject] = useState('');
  const [price, setPrice] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [level, setLevel] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadSubjects();
    loadLevels();
  }, []);

  // Funkcja pobierająca listę przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchAllSubjects();
      setSubjectsList(response.subjects);
    } catch (error) {
      console.error("Błąd pobierania przedmiotów:", error);
    }
  };

  // Funkcja pobierająca listę poziomów
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      setLevelsList(response.levels);
    } catch (error) {
      console.error("Błąd pobierania poziomów:", error);
    }
  };

  // Funkcja wywołująca alert potwierdzający przed wysłaniem danych
  const handleConfirmRegisterTeacher = () => {
    Alert.alert("Potwierdzenie",
      "Czy na pewno chcesz zarejestrować nauczyciela?",
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Zarejestruj",
          onPress: handleRegister,
        }
      ]
    );
  };

  // Funkcja do rejestracji nauczyciela
  const handleRegister = async () => {
    if (!firstName || !lastName || !subject || !price) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane.");
      return;
    }
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      const response = await registerNewTeacher(trimmedFirstName, trimmedLastName, subject, price);
      if (response.success) {
        Alert.alert("Sukces", "Nauczyciel został zarejestrowany.");
        router.push('profile');
      } else {
        Alert.alert("Błąd", response.message);
      }
    }
    catch (error) {
      console.error("Błąd rejestracji nauczyciela:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rejestracja Nowego Nauczyciela</Text>

      <Text style={styles.label}>Imię</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź imię"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Nazwisko</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź nazwisko"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Przedmiot</Text>
      <Picker
        selectedValue={subject}
        style={styles.picker}
        onValueChange={(itemValue) => setSubject(itemValue)}
      >
        <Picker.Item label="Wybierz przedmiot" value="" />
        {subjectsList.map((subj) => (
          <Picker.Item key={subj.id} label={subj.name} value={subj.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Poziom nauczania</Text>
      <Picker
        selectedValue={level}
        style={styles.picker}
        onValueChange={(itemValue) => setLevel(itemValue)}
      >
        <Picker.Item label="Wybierz poziom" value="" />
        {levelsList.map((lvl) => (
          <Picker.Item key={lvl.id} label={lvl.name} value={lvl.id} />
        ))}
      </Picker>
      <Text style={styles.label}>Cena (PLN/H)</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź cenę"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleConfirmRegisterTeacher}>
        <Text style={styles.submitButtonText}>Zarejestruj</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RegisterTeacherScreen;
