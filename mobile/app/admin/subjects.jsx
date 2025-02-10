import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllSubjects, addSubject, updateSubject } from '../../api/subjectsApi';

const AdminManageSubjectsScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  // funkcja pobierająca przedmioty
  const loadSubjects = async () => {
    try {
      const response = await fetchAllSubjects();
      setSubjects(response.subjects);
    } catch (error) {
      Alert.alert("Error", "Wystąpił błąd podczas pobierania przedmiotów");
    }
  };

  // funkcja dodająca przedmiot
  const confirmAddSubject = async () => {
    try {
      const response = await addSubject(newSubjectName.trim());

      if (response.success) {
        Alert.alert('Success', response.message);
        loadSubjects();
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert("Error","Wystąpił błąd podczas dodawania przedmiotu");
    }
  };

  // funkcja edytująca przedmiot
  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setNewSubjectName(subject.name);
    setIsModalVisible(true);
  };

  // funkcja aktualizująca przedmiot
  const confirmUpdateSubject = async () => {
    if (!selectedSubject) return;

    try {
      const response = await updateSubject(selectedSubject.id, newSubjectName);

      if (response.success) {
        Alert.alert('Success', response.message);
        setSelectedSubject(null);
        setNewSubjectName('');
        setIsModalVisible(false);
        loadSubjects();
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert("Error","Wystąpił błąd podczas aktualizacji przedmiotu");
    }
  };

 
  // funkcja wywołująca alert z pytaniem o potwierdzenie dodania przedmiotu
  const handleAddSubject = () => {
    Alert.alert(
      "Potwierdzenie dodania przedmiotu",
      "Czy na pewno chcesz dodać ten przedmiot?",
      [
        { text: 'ANULUJ', style: 'cancel' },
        { text: 'DODAJ', onPress: () => confirmAddSubject() },
      ]
    );
  };

  // funkcja wywołująca alert z pytaniem o potwierdzenie aktualizacji przedmiotu
  const handleUpdateSubject = () => {
    Alert.alert(
      "Potwierdzenie aktualizacji",
      "Czy na pewno chcesz zaktualizować ten przedmiot?",
      [
        { text: 'ANULUJ', style: 'cancel' },
        { text: 'AKTUALIZUJ', onPress: () => confirmUpdateSubject() },
      ]
    );
  };

  // Funkcja renderująca przedmioty
  const renderSubjects = (subject) => (
    <View style={styles.subjectCard} key={subject.id}>
      <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">
        {subject.name}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditSubject(subject)} style={{ marginHorizontal: 4 }}>
          <Ionicons name="pencil" size={28} color="#6200ea" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Subjects</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedSubject(null);
            setNewSubjectName('');
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={24} color="#6200ea" />
          <Text style={styles.addButtonText}>Add New Subject</Text>
        </TouchableOpacity>

        {subjects.length > 0 ? (
          subjects.map((subject) => renderSubjects(subject))
        ) : (
          <Text style={styles.emptyMessage}>No subjects available</Text>
        )}

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {selectedSubject ? 'Edit Subject' : 'Add Subject'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Subject Name"
                value={newSubjectName}
                onChangeText={setNewSubjectName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={selectedSubject ? handleUpdateSubject : handleAddSubject}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#6200ea',
    fontSize: 16,
    fontWeight: '500',
  },
  subjectCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectName: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default AdminManageSubjectsScreen;
