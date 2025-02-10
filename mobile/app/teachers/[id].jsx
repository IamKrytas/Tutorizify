import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchTeacherById, fetchTeacherReviewsById } from '../../api/teachersApi';
import RenderStars from '../../components/RenderStars';

const TeacherProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Dodano router do obsługi nawigacji
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    if (id) {
      loadTeacher(id);
      loadReviews(id);
    }
  }, [id]);

  const loadTeacher = async (id) => {
    try {
      const response = await fetchTeacherById(id);
      if (response.success) {
        setTeacher(response.teacher);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania nauczyciela:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (id) => {
    try {
      const response = await fetchTeacherReviewsById(id);
      if (response.success) {
        setReviews(response.reviews);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania opinii:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={{ marginTop: 50 }} />
  }

  if (!teacher) {
    return <Text>Nie znaleziono nauczyciela.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: teacher.image }} style={styles.profileImage} />
        <Text style={styles.name}>{teacher.name}</Text>
        <View style={styles.subjectPriceContainer}>
          <Text style={styles.subject}>{teacher.subject}</Text>
          <Text style={styles.price}>{teacher.price} PLN/H</Text>
        </View>
        {/* Poziom na czerwono */}
        <Text style={styles.level}>{teacher.level}</Text>
        <View style={styles.ratingContainer}>
          <RenderStars rating={teacher.rating} />
          <Text style={styles.ratingText}>{teacher.rating} / 5.0 ({teacher.ratingCount})</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Dane nauczyciela</Text>
          <Text style={styles.emailText}>{teacher.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Biogram:</Text>
          <Text style={styles.bio}>{teacher.bio}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Opis:</Text>
          <Text style={styles.description}>{teacher.description}</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={() => router.push(`/bookings/${teacher.id}`)} >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.registerText}>Zarejestruj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#6200ea" />
          <Text style={styles.backText}>Powrót</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.name}>Opinie uczniów</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.card}>
              <Text style={{ fontSize: 16, color: '#444', fontWeight: 'bold' }}>{review.username}</Text>
              <Text style={{ fontSize: 14, color: '#444', marginTop: 5 }}>{review.createdAt}</Text>
              <RenderStars rating={review.rating} />
              <Text style={{ fontSize: 16, color: '#444', marginTop: 5 }}>{review.comment}</Text>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={{ fontSize: 16, color: '#444', marginTop: 5 }}>Brak opinii.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6200ea',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subjectPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e9f7ff',
    borderRadius: 10,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6200ea',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6200ea',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    textAlign: 'justify',
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'justify',
    lineHeight: 22,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 25,
    marginTop: 25,
    width: '80%',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 18,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6200ea',
  },
  backText: {
    fontSize: 16,
    color: '#6200ea',
    marginLeft: 8,
    fontWeight: '600',
  },
  level: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
});

export default TeacherProfile;
