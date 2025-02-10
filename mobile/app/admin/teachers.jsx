import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, StyleSheet, SectionList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchAllTeachers, changeStatusTeacher, deleteTeacher } from '../../api/teachersApi';
import RenderStars from '../../components/RenderStars';

const AdminManageTeachersScreen = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Rozdzielenie nauczycieli na zaakceptowanych i oczekujących
    const acceptedTeachers = teachers.filter((teacher) => teacher.status === 1);
    const waitingTeachers = teachers.filter((teacher) => teacher.status === 0);

    // funkcja pobierająca nauczycieli
    const fetchTeachers = async () => {
        try {
            const response = await fetchAllTeachers();
            setTeachers(response.teachers);
        } catch (error) {
            console.error("Error fetching teachers: ", error);
        }
    };

    // funkcja zmieniająca status nauczyciela
    const confirmChangeStatusTeacher = async (teacherId) => {
        try{
            const response = await changeStatusTeacher(teacherId);
            if(response.success){
                Alert.alert("Success", response.message);
                fetchTeachers();
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error changing teacher status: ", error);
        }
    };

    // funkcja usuwająca nauczyciela
    const confirmDeleteTeacher = async (teacherId) => {
        try{
            const response = await deleteTeacher(teacherId);
            if(response.success){
                Alert.alert("Success", response.message);
                fetchTeachers();
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error deleting teacher: ", error);
        }
    };

    // funkcja wywołująca alert z pytaniem o potwierdzenie zmiany statusu nauczyciela
    const handleChangeStatusTeacher = (teacherId) => {
        Alert.alert(
            "Potwierdzenie zmiany statusu",
            "Czy na pewno chcesz zmienić status teo nauczyciela?",
            [
                {
                    text: "ANULUJ",
                    style: "cancel" },
                {
                    text: "ZATWIERDŹ",
                    style: "destructive",
                    onPress: () => confirmChangeStatusTeacher(teacherId)
                }
            ]
        );
    }

    // funkcja wywołująca alert z pytaniem o potwierdzenie usunięcia nauczyciela
    const handleDeleteTeacher = (teacherId) => {
        Alert.alert(
            "Potwierdzenie usunięcia",
            "Czy na pewno chcesz usunąć tego nauczyciela?",
            [
                {
                    text: "ANULUJ",
                    style: "cancel"
                },
                {
                    text: "USUŃ",
                    style: "destructive",
                    onPress: () => confirmDeleteTeacher(teacherId)
                }
            ]
        );
    };

    // funkcja wyświetlająca szczegóły nauczyciela
    const handleSelectTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    // funkcja renderująca nauczycieli
    const renderTeachers = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectTeacher(item)} style={styles.teacherCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.teacherName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {waitingTeachers.includes(item) ? (
                        <>
                            <TouchableOpacity onPress={() => handleChangeStatusTeacher(item.id)} style={{ marginHorizontal: 6 }}>
                                <Ionicons name="checkmark" size={28} color="#28a745" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteTeacher(item.id)} style={{ marginHorizontal: 6 }}>
                                <Ionicons name="trash-outline" size={28} color="#ff3d00" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => handleChangeStatusTeacher(item.id)} style={{ marginHorizontal: 6 }}>
                            <Ionicons name="ban-outline" size={28} color="#ff3d00" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
    


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zarządzaj nauczycielami</Text>
            <SectionList
                sections={[
                    { title: 'Oczekujący na akceptację', data: waitingTeachers },
                    { title: 'Zaakceptowani', data: acceptedTeachers },
                ]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTeachers}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                contentContainerStyle={styles.teacherList}
            />
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {selectedTeacher && (
                            <>
                                <Text style={styles.modalTitle}>{selectedTeacher.name}</Text>
                                <Text style={styles.modalText}>{selectedTeacher.email}</Text>
                                <Text style={styles.modalText}>{selectedTeacher.subject}</Text>
                                <Text style={styles.modalText}>{selectedTeacher.price} PLN/H</Text>

                                <RenderStars rating={selectedTeacher.rating} />
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                    <Ionicons name="close-circle" size={28} color="#007bff" />
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminManageTeachersScreen;

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
        marginTop: 30,
        marginBottom: 20,
    },
    teacherList: {
        paddingBottom: 10,
    },
    teacherCard: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    teacherName: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    iconContainer: {
        flexDirection: 'row',
        flexShrink: 1,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 5,
    },
});
