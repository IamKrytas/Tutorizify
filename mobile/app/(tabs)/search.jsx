import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchTeachers } from '../../api/searchApi';
import { fetchAllSubjects, fetchAllLevels } from '../../api/subjectsApi';
import RenderStars from '../../components/RenderStars';
import { useRouter } from 'expo-router';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSort, setSelectedSort] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]); // Dodano brakujący stan
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const router = useRouter();

  // Funkcja odświeżania ekranu
  const onRefresh = () => {
    const now = new Date().getTime();
    if (lastRefreshTime && now - lastRefreshTime < 30000) {
      console.log("Odświeżanie jest zablokowane, musisz poczekać 30 sekund.");
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(now);

    loadTeachers();
    loadSubjects();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // Resetowanie filtrów
  const ResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedLevel('all');
    setSelectedSort('all');
  };

  // Filtrowanie i sortowanie
  useEffect(() => {
    let updatedTeachers = [...teachers];

    // Filtrowanie po przedmiocie
    if (selectedSubject !== 'all') {
      updatedTeachers = updatedTeachers.filter(
        (teacher) => teacher.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Filtrowanie po poziomie
    if (selectedLevel !== 'all') {
      updatedTeachers = updatedTeachers.filter(
        (teacher) => teacher.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Sortowanie
    if (selectedSort === 'rating') {
      updatedTeachers.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (selectedSort === 'price') {
      updatedTeachers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    // Wyszukiwanie
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      updatedTeachers = updatedTeachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query) ||
          teacher.subject.toLowerCase().includes(query) ||
          teacher.level.toLowerCase().includes(query)
      );
    }

    setFilteredTeachers(updatedTeachers);
  }, [searchQuery, selectedSubject, selectedLevel, selectedSort, teachers]);

  // Pobieranie nauczycieli
  const loadTeachers = async () => {
    try {
      const response = await fetchTeachers();
      if (response.success) {
        setTeachers(response.teachers);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error("Błąd pobierania nauczycieli:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchAllSubjects();
      if (response.success) {
        setSubjects(response.subjects);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error("Błąd pobierania przedmiotów:", error);
    }
  };

  // Pobieranie poziomów nauczania
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      if (response.success) {
        setLevels(response.levels);
      } else {
        Alert.alert('Błąd', response.message);
      }
    } catch (error) {
      console.error("Błąd pobierania poziomów nauczania:", error);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadLevels();
    loadTeachers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Znajdź nauczycieli</Text>
          <Text style={styles.headerSubtitle}>Użyj poniższych opcji, aby znaleźć idealnego nauczyciela.</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Wyszukaj nauczyciela lub przedmiot"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={ResetFilters}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.label}>Filtruj według przedmiotu:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, selectedSubject === 'all' && styles.selectedButton]}
              onPress={() => setSelectedSubject('all')}
            >
              <Text style={styles.buttonText}>Brak</Text>
            </TouchableOpacity>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.button,
                  selectedSubject === subject.name && styles.selectedButton
                ]}
                onPress={() => setSelectedSubject(subject.name)}
              >
                <Text style={styles.buttonText}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Filtruj według poziomu:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, selectedLevel === 'all' && styles.selectedButton]}
              onPress={() => setSelectedLevel('all')}
            >
              <Text style={styles.buttonText}>Brak</Text>
            </TouchableOpacity>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.button,
                  selectedLevel === level.name && styles.selectedButton
                ]}
                onPress={() => setSelectedLevel(level.name)}
              >
                <Text style={styles.buttonText}>{level.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Sortuj według:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, selectedSort === 'all' && styles.selectedButton]}
              onPress={() => setSelectedSort('all')}
            >
              <Text style={styles.buttonText}>Brak</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedSort === 'rating' && styles.selectedButton]}
              onPress={() => setSelectedSort('rating')}
            >
              <Text style={styles.buttonText}>Oceny</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedSort === 'price' && styles.selectedButton]}
              onPress={() => setSelectedSort('price')}
            >
              <Text style={styles.buttonText}>Cena</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6200ea" />
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <View key={teacher.id} style={styles.resultCard}>
                <Text style={styles.resultName}>{teacher.name}</Text>
                <Text><RenderStars rating={teacher.rating} /></Text>
                <Text style={styles.resultDetails}>{teacher.subject}</Text>
                <Text style={styles.resultDetails}>{teacher.level}</Text>
                <Text style={styles.resultDetails}>{teacher.price} PLN/H</Text>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => router.push(`/teachers/${teacher.id}`)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="person" size={24} color="black" style={styles.profileIcon} />
                    <Text style={styles.profileText}>Zobacz profil</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noResultsText}>Brak wyników</Text>
          )}
        </View>
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
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#6200ea',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
    flexBasis: 'auto',
  },
  selectedButton: {
    backgroundColor: '#6200ea',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultDetails: {
    fontSize: 16,
    color: '#777',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 8,
  },
  profileText: {
    fontSize: 16,
    color: 'black',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
