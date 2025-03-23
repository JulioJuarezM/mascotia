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
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Camera, ArrowRight, Loader } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { petService } from '../services/petService';
import { useAuth } from '../context/AuthContext';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { API_URL } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

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
        color: '',
        gender: '',
        attributes: '',
        size: '',
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

                    const url = `${API_URL}/api/v1/mascotia/ia/image`;
                    const base64Image = manipResult.base64;
                    const response = await fetch(url, {
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
                        const petDetails = result.data.pet_details;
                        setPetData(prev => ({
                            ...prev,
                            species: petDetails?.type || 'No detectado',
                            breed: petDetails?.breed || 'No detectado',
                            color: petDetails?.color || 'No detectado',
                            gender: petDetails?.gender || 'Desconocido',
                            size: petDetails?.size || 'No detectado',
                            attributes: petDetails?.attributes || 'Sin características detectadas'
                        }));
                    }

                    if (result.statusCode === 500) {
                        console.log('Error:', result.message);
                        alert('Error al analizar la imagen. Por favor, intenta nuevamente.');
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
                color: '',
                gender: '',
                attributes: '',
                size: '',
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
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <MotiView
                                from={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'timing', duration: 500 }}
                                style={styles.imagePreviewWrapper}
                            >
                                <View style={styles.imagePreviewContainer}>
                                    <Image
                                        source={{ uri: petData.image }}
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                </View>
                            </MotiView>

                            <MotiView
                                from={{ translateY: 20, opacity: 0 }}
                                animate={{ translateY: 0, opacity: 1 }}
                                transition={{ type: 'timing', duration: 500, delay: 200 }}
                                style={styles.detectedInfoContainer}
                            >
                                <Text style={styles.detectedInfoTitle}>Hemos detectado:</Text>
                                <View style={styles.infoGrid}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoColumn}>
                                            <Text style={styles.infoLabel}>ESPECIE</Text>
                                            <Text style={styles.infoValue}>{petData.species}</Text>
                                        </View>
                                        <View style={styles.infoColumn}>
                                            <Text style={styles.infoLabel}>RAZA</Text>
                                            <Text style={styles.infoValue}>{petData.breed}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoColumn}>
                                            <Text style={styles.infoLabel}>COLOR</Text>
                                            <Text style={styles.infoValue}>{petData.color}</Text>
                                        </View>
                                        <View style={styles.infoColumn}>
                                            <Text style={styles.infoLabel}>TAMAÑO</Text>
                                            <Text style={styles.infoValue}>{petData.size}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoColumn}>
                                            <Text style={styles.infoLabel}>GÉNERO</Text>
                                            <Text style={styles.infoValue}>{petData.gender}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.factsContainer}>
                                    <Text style={styles.factsTitle}>Facts:</Text>
                                    <Text style={styles.factsText}>{petData.attributes}</Text>
                                </View>
                            </MotiView>
                        </ScrollView>

                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: 'timing', duration: 500, delay: 400 }}
                            style={styles.buttonContainer}
                        >
                            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                                <Text style={styles.nextButtonText}>Continuar</Text>
                                <ArrowRight size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </MotiView>
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
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Color</Text>
                            <TextInput
                                style={styles.input}
                                value={petData.color}
                                onChangeText={(text) => setPetData({ ...petData, color: text })}
                                placeholder="Color de la mascota"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Género</Text>
                            <TextInput
                                style={styles.input}
                                value={petData.gender}
                                onChangeText={(text) => setPetData({ ...petData, gender: text })}
                                placeholder="Género (male/female)"
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
        height: '90%',
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
        width: '100%',
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
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    imagePreviewWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    imagePreviewContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 16,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    detectedInfoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    detectedInfoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    infoGrid: {
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoColumn: {
        flex: 1,
        marginHorizontal: 4,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    factsContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    factsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    factsText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4B5563',
        fontStyle: 'italic',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
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