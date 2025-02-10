import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchAllUsers, changeUserRole } from '../../api/usersApi';
import { fetchAllRoles } from '../../api/authApi';
import { Picker } from '@react-native-picker/picker';

const AdminManageUsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRole, setNewRole] = useState(null);
    const [roles, setRoles] = useState([]);

    const defaultRole = newRole || selectedUser?.role || (roles[0] ? roles[0].name : null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // funkcja pobierająca użytkowników
    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsers();
            if (response.success) {
                setUsers(response.users);
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    // funkcja pobierająca role
    const fetchRoles = async () => {
        try {
            const response = await fetchAllRoles();
            if (response.success) {
                setRoles(response.roles);
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error fetching roles: ", error);
        }
    };

    // funkcja zmieniająca rolę użytkownika
    const changeRole = async (userId, role) => {
        try {
            const response = await changeUserRole(userId, role);
            if (response.success) {
                Alert.alert("Success", response.message);
                setIsModalVisible(false);
                fetchUsers();
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error changing role: ", error);
        }
    }

    // funkcja wywołująca alert z pytaniem o potwierdzenie zmiany roli
    const handleChangeRole = async (userId, role) => {
        if (!role) {
            return Alert.alert("Error", "Please select a new role.");
        }
        Alert.alert(
            "Potwierdzenie zmiany roli",
            `Czy na pewno chcesz zmienić role użytkownika ${selectedUser.username} na ${role}?`,
            [
                { text: "ANULUJ", style: "cancel" },
                {
                    text: "ZMIEŃ",
                    style: "destructive",
                    onPress: () => changeRole(userId, role),
                },
            ]
        );
    };

    // funkcja wywołująca modal z informacjami o użytkowniku
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    // funkcja renderująca użytkownika
    const renderUsers = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectUser(item)} style={styles.userCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                    {item.username}
                </Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zarządzaj użytkownikami</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUsers}
                contentContainerStyle={styles.userList}
            />

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {selectedUser && (
                            <>
                                <Text style={styles.modalTitle}>{selectedUser.username}</Text>

                                <Text style={styles.modalText}>
                                    <Text style={{ fontWeight: 'bold' }}>E-mail: </Text>
                                    <Text style={{ fontWeight: 'normal' }}>{selectedUser.email}</Text>
                                </Text>

                                <Text style={styles.modalText}>
                                    <Text style={{ fontWeight: 'bold' }}>Data rejestracji: </Text>
                                    <Text style={{ fontWeight: 'normal' }}>{selectedUser.registrationDate}</Text>
                                </Text>

                                <Text style={styles.modalText}>
                                    <Text style={{ fontWeight: 'bold' }}>Aktualna rola: </Text>
                                    <Text style={{ fontWeight: 'normal' }}>{selectedUser.role}</Text>
                                </Text>

                                <Text style={styles.modalText}>
                                    <Text style={{ fontWeight: 'bold' }}>Wybierz nową rolę: </Text>
                                </Text>
                                <Picker
                                    selectedValue={defaultRole}
                                    onValueChange={(itemValue) => setNewRole(itemValue)}
                                    style={styles.picker}
                                >
                                    {roles.map((role) => (
                                        <Picker.Item key={role.id} label={role.name} value={role.name} />
                                    ))}
                                </Picker>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => handleChangeRole(selectedUser.id, newRole)}
                                        style={styles.acceptButton}
                                    >
                                        <Ionicons name="checkmark" size={24} color="#fff" style={styles.icon} />
                                        <Text style={styles.acceptButtonText}>Zatwierdź</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setIsModalVisible(false)}
                                        style={styles.cancelButton}
                                    >
                                        <Ionicons name="close" size={24} color="#fff" style={styles.icon} />
                                        <Text style={styles.cancelButtonText}>Anuluj</Text>
                                    </TouchableOpacity>
                                </View>

                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
    userList: {
        paddingBottom: 10,
    },
    userCard: {
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
    userName: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    iconContainer: {
        flexDirection: 'row',
        flexShrink: 1,
        justifyContent: 'flex-end',
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
        color: '#333',
        fontWeight: 'bold',
    },
    modalSubText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
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
    roleItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    selectedRoleItem: {
        backgroundColor: '#e6f7ff',
    },
    roleText: {
        fontSize: 16,
        color: '#333',
    },
    picker: {
        height: 50,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.48,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.48,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    icon: {
        marginRight: 8,
    },
});

export default AdminManageUsersScreen;
