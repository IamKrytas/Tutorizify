import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { loginRequest } from '../api/authApi';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Funkcja do obsługi logowania
    const handleLogin = async () => {
        try {
            const response = await loginRequest(email, password);

            if (response.success) {
                router.push('/home');
            }
            else {
                Alert.alert('Błąd', response.message || 'Wystąpił problem z serwerem');
            }
        } catch (error) {
            Alert.alert('Błąd', error.message || 'Wystąpił problem z serwerem');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zaloguj się</Text>

            <TextInput
                style={styles.input}
                placeholder="Wpisz adres e-mail"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Wpisz hasło"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Zaloguj się</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Nie masz konta?</Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLink}>Zarejestruj się</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 16,
        color: '#000',
    },
    registerLink: {
        fontSize: 16,
        color: '#6200ea',
        marginLeft: 5,
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
});

export default Login;
