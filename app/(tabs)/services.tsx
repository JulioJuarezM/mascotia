import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Star, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { petService, Pet as ServicePet } from '../services/petService';

interface Appointment {
  id: number;
  pet_id: number;
  appointment_date: string;
  provider_id: number;
  appointment_type_id: number;
  appointment_types: {
    id: number;
    name: string;
  };
  appointment_providers: {
    id: number;
    name: string;
    address: string;
  };
}

type DisplayPet = {
  id: number;
  name: string;
  breed: string;
  imageUrl: string;
};

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<DisplayPet[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://34.31.240.21:31700/api/v1/mascotia/appointments/pet/1');
      const appointmentsData = await response.json();

      // Obtener las mascotas del AsyncStorage
      const petsData = await AsyncStorage.getItem('pets');
      const formattedPets: DisplayPet[] = petsData ? JSON.parse(petsData) : [];
      setPets(formattedPets);

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
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
            <Text style={styles.headerTitle}>Servicios</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" strokeWidth={2.2} />
              <Text style={styles.searchPlaceholder}>Buscar servicios...</Text>
            </View>
          </Animated.View>

          {/* Categories */}
          <Animated.View entering={FadeInDown.delay(300).duration(700)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
                <Text style={[styles.categoryText, styles.categoryTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Veterinarios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Peluquería</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Entrenamiento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Tiendas</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>

        {/* Featured Services */}
        <View style={styles.content}>

          <Animated.View entering={FadeInDown.delay(600).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximas Citas</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {/* Appointment Card */}
            {appointments.map((appointment) => {
              const pet = pets.find(p => p.id === appointment.pet_id);

              return (
                <TouchableOpacity key={appointment.id}>
                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentPet}>
                        <Image
                          source={{ uri: pet?.imageUrl || 'https://images.unsplash.com/photo-1583511655826-05700442b31b?q=80&w=1976&auto=format&fit=crop' }}
                          style={styles.appointmentPetImage}
                        />
                        <View>
                          <Text style={styles.appointmentPetName}>{pet?.name || 'Mi Mascota'}</Text>
                          <Text style={styles.appointmentType}>{appointment.appointment_types.name}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.appointmentStatus,
                        new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
                          ? styles.appointmentStatus
                          : styles.appointmentStatusUpcoming
                      ]}>
                        <Text style={[
                          styles.appointmentStatusText,
                          new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
                            ? styles.appointmentStatusText
                            : styles.appointmentStatusTextUpcoming
                        ]}>
                          {new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
                            ? 'Hoy'
                            : new Date(appointment.appointment_date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.appointmentDivider} />
                    <View style={styles.appointmentDetails}>
                      <View style={styles.appointmentInfo}>
                        <Calendar size={16} color="#3B82F6" strokeWidth={2.2} />
                        <Text style={styles.appointmentInfoText}>
                          {new Date(appointment.appointment_date).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.appointmentInfo}>
                        <MapPin size={16} color="#3B82F6" strokeWidth={2.2} />
                        <Text style={styles.appointmentInfoText}>{appointment.appointment_providers.name}</Text>
                      </View>
                      <TouchableOpacity style={styles.appointmentAction}>
                        <Text style={styles.appointmentActionText}>Ver detalles</Text>
                        <ArrowRight size={16} color="#3B82F6" strokeWidth={2.2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>


          <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Destacados</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Featured Service Card */}
            <TouchableOpacity>
              <View style={styles.featuredCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.featuredGradient}
                />
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <Star size={12} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                    <Text style={styles.featuredBadgeText}>Destacado</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Centro Veterinario PetCare</Text>
                  <View style={styles.featuredLocation}>
                    <MapPin size={14} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.featuredLocationText}>A 1.2 km de distancia</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Nearby Services */}
          <Animated.View entering={FadeInDown.delay(500).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cerca de ti</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Service Card 1 */}
            <TouchableOpacity>
              <View style={styles.serviceCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?q=80&w=2070&auto=format&fit=crop' }}
                  style={styles.serviceImage}
                />
                <View style={styles.serviceContent}>
                  <View>
                    <View style={styles.serviceRating}>
                      <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                      <Text style={styles.serviceRatingText}>4.8</Text>
                      <Text style={styles.serviceReviewCount}>(124)</Text>
                    </View>
                    <Text style={styles.serviceTitle}>Peluquería Canina Happy Paws</Text>
                    <Text style={styles.serviceCategory}>Peluquería</Text>
                    <View style={styles.serviceLocation}>
                      <MapPin size={14} color="#64748B" strokeWidth={2.2} />
                      <Text style={styles.serviceLocationText}>A 2.5 km de distancia</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Service Card 2 */}
            <TouchableOpacity>
              <View style={styles.serviceCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064&auto=format&fit=crop' }}
                  style={styles.serviceImage}
                />
                <View style={styles.serviceContent}>
                  <View>
                    <View style={styles.serviceRating}>
                      <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                      <Text style={styles.serviceRatingText}>4.6</Text>
                      <Text style={styles.serviceReviewCount}>(98)</Text>
                    </View>
                    <Text style={styles.serviceTitle}>Entrenamiento Canino PetMaster</Text>
                    <Text style={styles.serviceCategory}>Entrenamiento</Text>
                    <View style={styles.serviceLocation}>
                      <MapPin size={14} color="#64748B" strokeWidth={2.2} />
                      <Text style={styles.serviceLocationText}>A 3.8 km de distancia</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Upcoming Appointments */}

          {/* Book Service Button */}
          <Animated.View entering={FadeInDown.delay(700).duration(700)}>
            <TouchableOpacity style={styles.bookServiceButton}>
              <LinearGradient
                colors={['#3B82F6', '#60A5FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookServiceGradient}
              >
                <Text style={styles.bookServiceText}>Reservar nuevo servicio</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Floating Filter Button */}
      <Animated.View
        style={[styles.filterButtonContainer, { bottom: 80 + insets.bottom }]}
        entering={FadeInDown.delay(800).duration(700)}
      >
        <TouchableOpacity style={styles.filterButton}>
          <BlurView intensity={90} tint="light" style={styles.filterButtonBlur}>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/filter.png' }}
              style={styles.filterIcon}
            />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
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
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 10,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  featuredCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#94A3B8',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  featuredTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLocationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
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
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  serviceRatingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 5,
  },
  serviceReviewCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
    marginLeft: 3,
  },
  serviceTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  serviceCategory: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#3B82F6',
    marginBottom: 5,
  },
  serviceLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLocationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
    marginLeft: 5,
  },
  bookButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  bookButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#3B82F6',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  appointmentPet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentPetImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  appointmentPetName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  appointmentType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#64748B',
  },
  appointmentStatus: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  appointmentStatusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#F43F5E',
  },
  appointmentStatusUpcoming: {
    backgroundColor: '#EFF6FF',
  },
  appointmentStatusTextUpcoming: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#3B82F6',
  },
  appointmentDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 15,
  },
  appointmentDetails: {
    gap: 8,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 10,
  },
  appointmentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  appointmentActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 5,
  },
  bookServiceButton: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
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
  bookServiceGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookServiceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  filterButtonContainer: {
    position: 'absolute',
    right: 20,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#94A3B8',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  filterButtonBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
});