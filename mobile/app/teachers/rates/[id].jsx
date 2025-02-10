// RateTeacherScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { rateTeacher } from '../../../api/teachersApi';

const RateTeacherScreen = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Funkcja do aktualizacji oceny
    const handleSetRating = (newRating) => setRating(newRating);

    // Funkcja do wysyłania oceny
    const handleSubmit = async () => {
        try {
            const result = await rateTeacher(id, rating, comment);
            if (result.success) {
                Alert.alert(
                    "Sukces",
                    result.message,
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/home'),
                            style: 'cancel',
                        },
                    ]
                );
            } else {
                Alert.alert('Błąd', result.message);
            }
        } catch (error) {
            console.error("Błąd:", error);
        }
    };

    // Funkcja wywołująca alert potwierdzający przed wysłaniem oceny
    const confirmAndSubmit = () => {
        if (rating === 0) {
            Alert.alert("Uwaga", "Proszę wybrać liczbę gwiazdek.");
            return;
        }

        Alert.alert(
            "Potwierdzenie oceny",
            `Czy na pewno chcesz ocenić tego nauczyciela na ${rating} gwiazdek?`,
            [
                { text: 'Anuluj', style: 'cancel' },
                {
                    text: 'Tak',
                    onPress: handleSubmit,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Oceń nauczyciela</Text>

            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => handleSetRating(i)}>
                        <Ionicons
                            name={i <= rating ? "star" : "star-outline"}
                            size={32}
                            color="#ffd700"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.commentLabel}>Komentarz (opcjonalnie):</Text>
            <TextInput
                style={styles.commentInput}
                placeholder="Napisz komentarz..."
                value={comment}
                onChangeText={setComment}
                multiline
            />

            <TouchableOpacity onPress={confirmAndSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Zatwierdź ocenę</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RateTeacherScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        marginTop: 30,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    commentLabel: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    commentInput: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        color: '#333',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});