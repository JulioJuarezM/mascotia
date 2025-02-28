import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Bell, MessageCircle, Heart, Calendar, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import styles from '../styles/index.styles';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { petService, Pet as ServicePet } from '../services/petService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIChatModal from '../components/AIChatModal';
import { AppointmentService } from '../services/appointmentService.service';
import AddPetModal from '../components/AddPetModal';


// Definimos un tipo local que coincida con lo que necesitamos mostrar en la UI
type DisplayPet = {
  id: number;
  name: string;
  breed: string;
  imageUrl: string;
  age?: number;
  gender?: string;
  type?: string;
  color?: string;
};

// Actualizar el tipo Appointment para incluir las nuevas propiedades
type Appointment = {
  id: number;
  petId: number;
  petName: string;
  petImage: string;
  date: string;
  time: string;
  providerName: string;
  appointmentType: string;
  address: string;
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();
  const [name, setName] = useState('');
  const [pets, setPets] = useState<DisplayPet[]>([]);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    setName(user?.name || '');
    loadPets();
    loadNextAppointment();
  }, [user]);

  const loadPets = async () => {
    try {
      console.log('Loading pets for user:', user?.id);
      const userPets = await petService.getUserPets(user?.id || 0);
      console.log('Raw pets response:', userPets);

      // Verificar si userPets es un array
      if (!Array.isArray(userPets)) {
        console.log('userPets no es un array:', userPets);
        setPets([]);
        return;
      }

      // Transformamos los datos al nuevo formato con validación
      const formattedPets: DisplayPet[] = userPets.map(pet => ({
        id: pet?.id || 0,
        name: pet?.name || 'Sin nombre',
        breed: pet?.details?.[0]?.breed || 'Desconocida',
        imageUrl: pet?.image || '',
        age: pet?.details?.[0]?.age || 0,
        gender: pet?.details?.[0]?.gender || 'Desconocido',
        type: pet?.details?.[0]?.species || 'Desconocido',
        color: pet?.details?.[0]?.color || 'Desconocido'
      }));

      console.log('Formatted pets:', formattedPets);
      setPets(formattedPets);
      await AsyncStorage.setItem('pets', JSON.stringify(formattedPets));
    } catch (error) {
      console.error('Error loading pets:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      setPets([]); // Establecer un array vacío en caso de error
    }
  };

  const loadNextAppointment = async () => {
    try {
      if (!user?.id) return;

      const appointmentService = new AppointmentService();
      const appointments = await appointmentService.getNextAppointment(user.id);

      if (appointments && appointments.length > 0) {
        const appointment = appointments[0];
        const appointmentDate = new Date(appointment.appointment_date);
        const petsArray = await AsyncStorage.getItem('pets');
        const pets = JSON.parse(petsArray || '[]');
        const pet = pets.find((pet: any) => pet.id === appointment.pet_id);

        if (pet) {
          setNextAppointment({
            id: appointment.id,
            petId: appointment.pet_id,
            petName: pet.name,
            petImage: pet.imageUrl,
            date: appointmentDate.toLocaleDateString('es-ES'),
            time: appointmentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            providerName: appointment.appointment_providers.name,
            appointmentType: appointment.appointment_types.name,
            address: appointment.appointment_providers.address
          });
        }
      }
    } catch (error) {
      console.error('Error cargando la próxima cita:', error);
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
            <View style={styles.welcomeContainer}>
              <View>
                <Text style={styles.welcomeText}>Hola,</Text>
                <Text style={styles.nameText}>{name.split(' ')[0]}</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Bell size={22} color="#1F2937" strokeWidth={2.2} />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <MessageCircle size={22} color="#1F2937" strokeWidth={2.2} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Pet Card */}
          {nextAppointment ? (
            <Animated.View
              style={styles.petCardContainer}
              entering={FadeInDown.delay(200).duration(700)}
            >
              <LinearGradient
                colors={['#3B82F6', '#60A5FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.petCard}
              >
                <View style={styles.petCardContent}>
                  <View>
                    <Text style={styles.petCardTitle}>Próxima cita</Text>
                    <Text style={styles.petName}>{nextAppointment.petName}</Text>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentDetail}>
                        <Calendar size={16} color="#FFFFFF" strokeWidth={2.2} />
                        <Text style={styles.appointmentText}>{nextAppointment.date}</Text>
                      </View>
                      <View style={styles.appointmentDetail}>
                        <Clock size={16} color="#FFFFFF" strokeWidth={2.2} />
                        <Text style={styles.appointmentText}>{nextAppointment.time}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.detailsButton}>
                      <Text style={styles.detailsButtonText}>Ver detalles</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: nextAppointment.petImage }}
                    style={styles.petImage}
                  />
                </View>
              </LinearGradient>
            </Animated.View>
          ) : null}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* My Pets Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Mascotas</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petsScrollContainer}
            >
              {pets.map((pet) => (
                <TouchableOpacity key={pet.id} style={styles.petItem}>
                  <View style={styles.petImageContainer}>
                    <Image
                      source={{ uri: pet.imageUrl }}
                      style={styles.petItemImage}
                    />
                  </View>
                  <Text style={styles.petItemName}>{pet.name}</Text>
                  <Text style={styles.petItemBreed}>{pet.breed}</Text>
                  <Text style={styles.petItemDetails}>
                    {pet.age} años • {pet.gender}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Add Pet Button */}
              <TouchableOpacity
                style={styles.addPetButton}
                onPress={() => setIsAddPetModalVisible(true)}
              >
                <View style={styles.addPetIconContainer}>
                  <Text style={styles.addPetIcon}>+</Text>
                </View>
                <Text style={styles.addPetText}>Añadir</Text>
                <Text style={styles.addPetSubtext}>mascota</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>

          {/* Care Tips Section */}
          <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Consejos de Cuidado</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Tip Card */}
            <TouchableOpacity>
              <View style={styles.tipCard}>
                <View style={styles.tipCardContent}>
                  <View style={styles.tipIconContainer}>
                    <Heart size={24} color="#F43F5E" strokeWidth={2.2} />
                  </View>
                  <View style={styles.tipTextContainer}>
                    <Text style={styles.tipTitle}>Cuidado de Sira</Text>
                    <Text style={styles.tipDescription}>
                      Recuerda dar atención especial a Sira hoy
                    </Text>
                  </View>
                  <View style={styles.tipArrowContainer}>
                    <ArrowRight size={20} color="#94A3B8" strokeWidth={2.2} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Tip Card 2 */}
            <TouchableOpacity>
              <View style={styles.tipCard}>
                <View style={styles.tipCardContent}>
                  <View style={[styles.tipIconContainer, { backgroundColor: '#EFF6FF' }]}>
                    <Calendar size={24} color="#3B82F6" strokeWidth={2.2} />
                  </View>
                  <View style={styles.tipTextContainer}>
                    <Text style={styles.tipTitle}>Vacunación</Text>
                    <Text style={styles.tipDescription}>
                      Próxima vacuna de Sira en 2 semanas
                    </Text>
                  </View>
                  <View style={styles.tipArrowContainer}>
                    <ArrowRight size={20} color="#94A3B8" strokeWidth={2.2} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Services Section */}
          <Animated.View entering={FadeInDown.delay(500).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Servicios Populares</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.servicesGrid}>
              {/* Service 1 */}
              <TouchableOpacity style={styles.serviceItem}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/96/veterinarian.png' }}
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>Veterinario</Text>
              </TouchableOpacity>

              {/* Service 2 */}
              <TouchableOpacity style={styles.serviceItem}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/96/dog-bowl.png' }}
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>Alimentación</Text>
              </TouchableOpacity>

              {/* Service 3 */}
              <TouchableOpacity style={styles.serviceItem}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/96/dog-training.png' }}
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>Entrenamiento</Text>
              </TouchableOpacity>

              {/* Service 4 */}
              <TouchableOpacity style={styles.serviceItem}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#FFF7ED' }]}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/96/dog-grooming.png' }}
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>Peluquería</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* AI Assistant Button */}
      <Animated.View
        style={[styles.aiButtonContainer, { bottom: 80 + insets.bottom }]}
        entering={FadeInRight.delay(600).duration(700)}
      >
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => setIsAIChatVisible(true)}
        >
          <BlurView intensity={90} tint="light" style={styles.aiButtonBlur}>
            <MessageCircle size={24} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.aiButtonText}>AI</Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <AIChatModal
        isVisible={isAIChatVisible}
        onClose={() => setIsAIChatVisible(false)}
      />

      <AddPetModal
        isVisible={isAddPetModalVisible}
        onClose={() => setIsAddPetModalVisible(false)}
        onAddPet={loadPets}
      />
    </View>
  );
}