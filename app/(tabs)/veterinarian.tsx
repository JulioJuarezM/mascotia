import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VetCard = ({ name, specialty, image, rating, distance }) => (
  <TouchableOpacity style={styles.vetCard}>
    <Image source={{ uri: image }} style={styles.vetImage} />
    <View style={styles.vetInfo}>
      <Text style={styles.vetName}>{name}</Text>
      <Text style={styles.specialty}>{specialty}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>{rating}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="location" size={16} color="#07e4fe" />
          <Text style={styles.statText}>{distance} km</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function VeterinarianScreen() {
  const vets = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'General Veterinarian',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300',
      rating: 4.9,
      distance: 2.5,
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Surgery Specialist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300',
      rating: 4.8,
      distance: 3.7,
    },
    {
      name: 'Dr. Emily Wilson',
      specialty: 'Dermatology',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300',
      rating: 4.7,
      distance: 4.1,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Vet</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search veterinarians...</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Available Now</Text>
        {vets.map((vet, index) => (
          <VetCard key={index} {...vet} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.emergencyButton}>
        <Ionicons name="medical" size={24} color="###07e4fe" />
        <Text style={styles.emergencyText}>Emergency Care</Text>
      </TouchableOpacity>
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    gap: 10,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  vetCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  vetInfo: {
    flex: 1,
    marginLeft: 15,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsRow: {
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
  emergencyButton: {
    backgroundColor: '#07e4fe',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});