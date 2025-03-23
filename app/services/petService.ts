import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalConfig } from '../constants';
import { API_ENDPOINTS } from '../constants';
import { API_URL } from '@env';

export interface PetDetail {
    id: number;
    species: string;
    age: number;
    color: string;
    breed: string;
    gender: string;
}

export interface Pet {
    id: number;
    name: string;
    pet_image: string;
    pet_details: {
        age: number;
        gender: string;
        type: string;
        breed: string;
        color: string;
    };
}

export interface NewPet {
    name: string;
    age: string;
    breed: string;
    species: string;
    image: string;
    weight: string;
    color: string;
    gender: string;
}

export const petService = {
    getUserPets: async (userId: number): Promise<Pet[]> => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            let url = `${GlobalConfig.BASE_URL}/${API_ENDPOINTS.PETS}/${userId}`
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data.map((pet: any) => ({
                id: pet.id,
                name: pet.name,
                details: pet.pet_details.map((detail: any) => ({
                    id: detail.id,
                    species: detail.type || 'No especificado',
                    age: detail.age || 0,
                    color: detail.color || 'No especificado',
                    breed: detail.breed || 'No especificado',
                    gender: detail.gender || 'No especificado'
                })),
                image: pet.pet_image,
                created_at: pet.created_at,
                updated_at: pet.updated_at
            }));
        } catch (error) {
            console.error('Error fetching pets:', error);
            throw error;
        }
    },

    async addPet(newPet: NewPet, userId: number): Promise<void> {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const formData = new FormData();

            // Agregar los campos básicos
            formData.append('name', newPet.name);
            formData.append('breed', newPet.breed);
            formData.append('userId', userId.toString());
            formData.append('type', newPet.species);
            formData.append('color', newPet.color);
            formData.append('gender', newPet.gender);
            formData.append('age', newPet.age);

            // Preparar y agregar la imagen si existe
            if (newPet.image) {
                const imageUri = newPet.image;
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('image', {
                    uri: imageUri,
                    name: filename,
                    type,
                } as any);
            }

            console.log('API_URL:', API_URL);
            const response = await fetch(`${API_URL}/api/v1/mascotia/pets/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                console.log('Error al registrar la mascota:', response);
                throw new Error('Error al registrar la mascota');
            }
        } catch (error) {
            console.error('Error registering pet:', error);
            throw error;
        }
    }
}; 