import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllRates, deleteRate } from '../../api/teachersApi';
import RenderStars from '../../components/RenderStars';

const AdminManageRatesScreen = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRates();
    }, []);

    // funkcja pobierająca oceny
    const fetchRates = async () => {
        setLoading(true);
        try {
            const response = await fetchAllRates();
            if (response.success) {
                setRates(response.rates);
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error fetching rates: ", error);
            Alert.alert("Error", "There was an issue fetching the rates.");
        } finally {
            setLoading(false);
        }
    };

    // funkcja usuwająca ocenę
    const deleteComment = async (id) => {
        try {
            const response = await deleteRate(id);
            if (response.success) {
                fetchRates();
                Alert.alert("Success", response.message);
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error deleting rate: ", error);
        }
    };

    // funkcja wywołująca alert z pytaniem o potwierdzenie usunięcia oceny
    const handleDeleteComment = (id) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => deleteComment(id) },
            ]
        );
    };

    // Funkcja renderująca ocenę
    const renderRate = ({ item }) => (
        <View style={styles.rateCard}>
            <View style={styles.rateInfoContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.teacherName}>{item.teacher_name}</Text>
                    <Text style={styles.rateText}>Oceniający: {item.user_name}</Text>
                    <Text style={styles.rateText}>Data: {item.date}</Text>
                    <Text><RenderStars rating={item.rating} /></Text>
                    <Text style={styles.commentText}>Comment: {item.comment}</Text>
                </View>
                <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteComment(item.id)}
                >
                    <Ionicons name="trash" size={24} color="#ff1744" />
                </TouchableOpacity>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Teachers Ratings</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200ea" />
            ) : (
                rates.length > 0 ? (
                    <FlatList
                        data={rates}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRate}
                        contentContainerStyle={styles.rateList}
                    />
                ) : (
                    <Text>No rates found.</Text>
                )
            )}
        </View>
    );
};

export default AdminManageRatesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 30,

    },
    rateList: {
        paddingBottom: 10,
    },
    rateCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rateInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teacherName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    rateText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#777',
    },
    deleteIcon: {
        marginLeft: 10,
    },
});
