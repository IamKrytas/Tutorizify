import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { registerRequest } from '../api/authApi';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();

  // Funkcja do obsługi rejestracji
  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Błąd', 'Wszystkie pola są wymagane');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie są takie same');
      return;
    }

    try {
      const response = await registerRequest(username, email, password, confirmPassword, avatar);

      if (response.success) {
        Alert.alert('Sukces', response.message);
        router.push('/home');
      }
      else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  }

  // Funkcja do obsługi wyboru awatara
  const handleSelectAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (result.canceled) {
      return;
    }

    const uri = result.assets ? result.assets[0].uri : result.uri;

    if (uri) {
      setAvatar(uri);
      console.log(uri);
    } else {
      console.log("No URI found in the selected image.");
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zarejestruj się</Text>

      <TextInput
        style={styles.input}
        placeholder="Wpisz nazwę użytkownika"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Wpisz adres e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Wpisz hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Potwierdź hasło"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSelectAvatar} style={styles.avatarContainer}>
        {avatar ? (
          <View>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </View>
        ) : (
          <Text style={styles.avatarPlaceholder}>Wybierz awatar</Text>
        )}
      </TouchableOpacity>



      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Masz już konto?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: '#6200ea',
    borderWidth: 2,
  },
  buttonText: {
    color: '#6200ea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#000',
  },
  loginLink: {
    fontSize: 16,
    color: '#6200ea',
    marginLeft: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    fontSize: 16,
    color: '#6200ea',
    textAlign: 'center',
  },
});
