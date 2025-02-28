import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, StatusBar, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const router = useRouter();

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error al seleccionar la imagen:', error);
            alert('Error al seleccionar la imagen');
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!image) {
            alert('Por favor selecciona una imagen de perfil');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('name', name);

            // Agregar la imagen al FormData
            const imageUri = image.uri;
            const imageName = imageUri.split('/').pop();
            const imageType = 'image/jpeg';

            formData.append('image', {
                uri: imageUri,
                name: imageName,
                type: imageType,
            } as any);

            const response = await fetch('http://localhost:89/api/v1/mascotia/signup', {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro exitoso');
                router.replace('/login');
            } else {
                alert(data.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            alert('Error al intentar registrarse');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="paw" size={40} color="#3B82F6" />
                            </View>
                            <Text style={styles.logoText}>Mascotia</Text>
                            <Text style={styles.subtitleText}>Crear una cuenta nueva</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Nombre completo</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tu nombre"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Correo electrónico</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirma tu contraseña"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Imagen de perfil</Text>
                                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                    {image ? (
                                        <Image
                                            source={{ uri: image.uri }}
                                            style={styles.selectedImage}
                                        />
                                    ) : (
                                        <View style={styles.imagePlaceholder}>
                                            <Ionicons name="camera-outline" size={24} color="#64748B" />
                                            <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                                <Text style={styles.loginButtonText}>Registrarse</Text>
                            </TouchableOpacity>

                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>¿Ya tienes una cuenta? </Text>
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.signupLink}>Inicia sesión</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    keyboardAvoid: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
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
    logoText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#1E293B',
        marginBottom: 8,
    },
    subtitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#64748B',
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
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
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#1E293B',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        color: '#1E293B',
        paddingVertical: 12,
    },
    loginButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#FFFFFF',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#64748B',
    },
    signupLink: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#3B82F6',
    },
    scrollContent: {
        flexGrow: 1,
    },
    imagePickerButton: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },
});
