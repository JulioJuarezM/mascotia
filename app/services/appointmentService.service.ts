import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalConfig } from '../constants';
import { API_ENDPOINTS } from '../constants';

type DisplayPet = {
    id: number;
    name: string;
    breed: string;
    imageUrl: string;
};

export interface Appointment {
    id: number;
    petId: number;
    petName: string;
    petImage: string;
    date: string;
    time: string;
    providerName: string;
    appointmentType: string;
    address: string;
}

export class AppointmentService {
    async getUserAppointments(petId: number): Promise<{ appointments: any[], pets: DisplayPet[] }> {
        try {
            const response = await fetch(`http://localhost:89/api/v1/mascotia/appointments/pet/${petId}`);
            const appointmentsData = await response.json();

            // Obtener las mascotas del AsyncStorage
            const petsData = await AsyncStorage.getItem('pets');
            const formattedPets: DisplayPet[] = petsData ? JSON.parse(petsData) : [];

            return {
                appointments: appointmentsData,
                pets: formattedPets
            };
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }

    async getAppointmentsAndPets(petId: number): Promise<{ appointments: any[], pets: DisplayPet[] }> {
        try {
            const response = await fetch(`http://localhost:89/api/v1/mascotia/appointments/pet/${petId}`);
            const appointmentsData = await response.json();

            // Obtener las mascotas del AsyncStorage
            const petsData = await AsyncStorage.getItem('pets');
            const formattedPets: DisplayPet[] = petsData ? JSON.parse(petsData) : [];

            return {
                appointments: appointmentsData,
                pets: formattedPets
            };
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }
    async getNextAppointment(petId: number): Promise<any> {
        try {
            const response = await fetch(`http://localhost:89/api/v1/mascotia/appointments/pet/${petId}`);
            console.log('response', response);
            const appointmentData = await response.json();
            return appointmentData;
        } catch (error) {
            console.error('Error fetching next appointment:', error);
            throw error;
        }
    }
}