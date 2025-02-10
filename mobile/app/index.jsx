import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorizify</Text>
      <Text style={styles.subtitle}>Twój klucz do sukcesu!</Text>

      <View style={styles.buttonContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>Zaloguj się</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
            <Text style={styles.buttonText}>Zarejestruj się</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.footer}>
        <Text>© 2024-2025 Aleksander Kędzierski</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontStyle: 'italic',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '60%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#6200ea',
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#6200ea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
});

export default Index;
