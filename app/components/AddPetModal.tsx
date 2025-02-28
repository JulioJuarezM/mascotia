import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Camera, ArrowRight, Loader } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { petService } from '../services/petService';
import { useAuth } from '../context/AuthContext';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

interface AddPetModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddPet: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = () => reject(new Error('Error converting blob to base64'));
        reader.readAsDataURL(blob);
    });
};

const AddPetModal = ({ isVisible, onClose, onAddPet }: AddPetModalProps) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(1));

    const [petData, setPetData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        image: '',
    });

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const nextStep = () => {
        fadeOut();
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            fadeIn();
        }, 200);
    };

    const pickImage = async () => {
        console.log('pickImage');
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.2,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setIsAnalyzing(true);
                const selectedImage = result.assets[0];
                setPetData({ ...petData, image: selectedImage.uri });

                try {
                    const manipResult = await manipulateAsync(
                        selectedImage.uri,
                        [
                            { resize: { width: 800 } },
                        ],
                        {
                            compress: 0,
                            format: SaveFormat.JPEG,
                            base64: true
                        }
                    );

                    const base64Image = manipResult.base64;
                    const response = await fetch('http://localhost:89/api/v1/mascotia/ia/image', {
                        method: 'POST',
                        headers: {
                            'accept': '*/*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            image: base64Image,
                            sessionId: 'abc'
                        })
                    });

                    const result = await response.json();
                    console.log('Respuesta del endpoint de IA:', result);

                    if (result.success && result.data) {
                        setPetData(prev => ({
                            ...prev,
                            name: result.data.name || '',
                            species: result.data.pet_details?.type || 'No detectado',
                            breed: result.data.pet_details?.breed || 'No detectado',
                            age: result.data.pet_details?.age?.toString() || '',
                        }));
                    }

                    nextStep();
                } catch (error) {
                    console.error('Error analyzing image:', error);
                } finally {
                    setIsAnalyzing(false);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!user?.id) return;
            await petService.addPet(petData, user.id);
            onAddPet();
            onClose();
            setCurrentStep(1);
            setPetData({
                name: '',
                species: '',
                breed: '',
                age: '',
                weight: '',
                image: '',
            });
        } catch (error) {
            console.error('Error al crear mascota:', error);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
                        <Text style={styles.stepTitle}>Fotografía de tu mascota</Text>
                        <Text style={styles.stepDescription}>
                            Toma una foto de cuerpo completo de tu mascota para que podamos
                            identificar sus características
                        </Text>
                        <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
                            <Camera size={32} color="#3B82F6" />
                            <Text style={styles.imageUploadText}>Tomar o seleccionar foto</Text>
                        </TouchableOpacity>
                    </Animated.View>
                );

            case 2:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: petData.image }} style={styles.previewImage} />
                        </View>
                        <View style={styles.detectedInfoContainer}>
                            <Text style={styles.detectedInfoTitle}>Hemos detectado:</Text>
                            <Text style={styles.detectedInfoText}>Especie: {petData.species}</Text>
                            <Text style={styles.detectedInfoText}>Raza: {petData.breed}</Text>
                        </View>
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                            <Text style={styles.nextButtonText}>Continuar</Text>
                            <ArrowRight size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </Animated.View>
                );

            case 3:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
                        <Text style={styles.stepTitle}>Datos finales</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nombre de tu mascota</Text>
                            <TextInput
                                style={styles.input}
                                value={petData.name}
                                onChangeText={(text) => setPetData({ ...petData, name: text })}
                                placeholder="¿Cómo se llama?"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Edad</Text>
                            <TextInput
                                style={styles.input}
                                value={petData.age}
                                onChangeText={(text) => setPetData({ ...petData, age: text })}
                                placeholder="Edad en años"
                                keyboardType="numeric"
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Guardar mascota</Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={90} tint="light" style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nueva Mascota</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    {isAnalyzing ? (
                        <View style={styles.loadingContainer}>
                            <Loader size={40} color="#3B82F6" />
                            <Text style={styles.loadingText}>Analizando imagen...</Text>
                        </View>
                    ) : (
                        renderStep()
                    )}
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        height: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        padding: 5,
    },
    stepContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    imageUploadButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    imageUploadText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    imagePreviewContainer: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    detectedInfoContainer: {
        width: '100%',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    detectedInfoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    detectedInfoText: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 8,
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 12,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 2,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
        color: '#1F2937',
    },
});

export default AddPetModal; 