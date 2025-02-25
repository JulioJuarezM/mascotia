import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PetListItem = ({ pet, onPress }) => (
  <TouchableOpacity style={styles.petItem} onPress={onPress}>
    <Image source={{ uri: pet.image }} style={styles.petImage} />
    <View style={styles.petDetails}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petSpecies}>{pet.species}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.statText}>{pet.age} years</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="scale" size={16} color="#666" />
          <Text style={styles.statText}>{pet.weight} kg</Text>
        </View>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#ccc" />
  </TouchableOpacity>
);

export default function PetsScreen() {
  const [pets, setPets] = useState([]);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:89/api/v1/mascotia/pets/user/1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const transformedPets = data.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        species: pet.breed || 'No especificado',
        image: pet.pet_image,
        age: pet.age,
        weight: 0,
        color: pet.color,
      }));
      setPets(transformedPets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mascotas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {pets.map((pet, index) => (
          <PetListItem
            key={index}
            pet={pet}
            onPress={() => { }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#07e4fe',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  petItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petDetails: {
    flex: 1,
    marginLeft: 15,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
});