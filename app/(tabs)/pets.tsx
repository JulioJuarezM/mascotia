import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Plus, Heart, Calendar, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { petService } from '../../app/services/petService';
import { useRouter } from 'expo-router';

type Pet = {
  id: number;
  name: string;
  pet_image: string;
  details:
  [{
    age: number;
    gender: string;
    type: string;
    breed: string;
    color: string;
  }]
};

export default function PetsScreen() {
  const insets = useSafeAreaInsets();
  const [pets, setPets] = useState<Pet[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const userPets = await petService.getUserPets(user?.id || 0);
      console.log('Raw pets response:', JSON.stringify(userPets, null, 2));

      if (!Array.isArray(userPets)) {
        console.log('userPets no es un array:', userPets);
        setPets([]);
        return;
      }

      // Validar y transformar los datos
      const validatedPets: Pet[] = userPets.map(pet => ({
        id: pet?.id || 0,
        name: pet?.name || 'Sin nombre',
        pet_image: pet?.image || '',
        details: [{
          age: pet?.details?.[0]?.age || 0,
          gender: pet?.details?.[0]?.gender || 'Desconocido',
          type: pet?.details?.[0]?.species || 'Desconocido',
          breed: pet?.details?.[0]?.breed || 'Desconocida',
          color: pet?.details?.[0]?.color || 'Desconocido'
        }]
      }));

      console.log('Validated pets:', JSON.stringify(validatedPets, null, 2));
      setPets(validatedPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      setPets([]); // Establecer un array vacío en caso de error
    }
  };

  const handleAddPet = () => {
    router.push('/add-pet');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <Animated.View entering={FadeInDown.delay(100).duration(700)}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Mis Mascotas</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
                <Plus size={22} color="#FFFFFF" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" strokeWidth={2.2} />
              <Text style={styles.searchPlaceholder}>Buscar mascota...</Text>
            </View>
          </Animated.View>
        </View>

        {/* Pets List */}
        <View style={styles.content}>
          {pets.map((pet) => (
            <Animated.View key={pet.id} entering={FadeInDown.delay(300).duration(700)}>
              <TouchableOpacity>
                <View style={styles.petCard}>
                  <Image
                    source={{ uri: pet.pet_image }}
                    style={styles.petImage}
                  />
                  <View style={styles.petInfo}>
                    <View>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petBreed}>
                        {pet.details?.[0]?.breed || 'Raza desconocida'}
                      </Text>
                      <View style={styles.petStats}>
                        <View style={styles.petStat}>
                          <Text style={styles.petStatValue}>
                            {pet.details?.[0]?.age || '?'}
                          </Text>
                          <Text style={styles.petStatLabel}>Años</Text>
                        </View>
                        <View style={styles.petStatDivider} />
                        <View style={styles.petStat}>
                          <Text style={styles.petStatValue}>
                            {pet.details?.[0]?.type || '?'}
                          </Text>
                          <Text style={styles.petStatLabel}>Tipo</Text>
                        </View>
                        <View style={styles.petStatDivider} />
                        <View style={styles.petStat}>
                          <Text style={styles.petStatValue}>
                            {pet.details?.[0]?.gender === 'Hembra' ? 'Hembra ' : 'Macho'}
                          </Text>
                          <Text style={styles.petStatLabel}>Género</Text>
                        </View>
                      </View>
                      {pet.details?.[0]?.color && (
                        <View style={styles.colorTag}>
                          <Text style={styles.colorText}>
                            Color: {pet.details[0].color}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Add Pet Card */}
          <Animated.View entering={FadeInDown.delay(600).duration(700)}>
            <TouchableOpacity onPress={handleAddPet}>
              <View style={styles.addPetCard}>
                <View style={styles.addPetIconContainer}>
                  <Plus size={30} color="#3B82F6" strokeWidth={2.2} />
                </View>
                <Text style={styles.addPetText}>Añadir nueva mascota</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#94A3B8',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#94A3B8',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  petImage: {
    width: '100%',
    height: 180,
  },
  petInfo: {
    padding: 15,
  },
  petName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  petBreed: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
  },
  petStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  petStat: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  petStatValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  petStatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  petStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  colorTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  colorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  addPetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  addPetIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#3B82F6',
  },
});

const additionalStyles = StyleSheet.create({
  petItemDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});