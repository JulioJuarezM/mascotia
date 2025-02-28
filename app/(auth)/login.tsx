import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            console.log('Iniciando proceso de login...');
            const response = await fetch('http://localhost:89/api/v1/mascotia/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await response.json();
            console.log('Respuesta completa:', data);

            if (response.ok) {
                console.log('Login exitoso:', JSON.stringify(data));

                if (!data.token) {
                    console.error('No se recibió token en la respuesta');
                    alert('Error en la autenticación');
                    return;
                }

                try {
                    const tokenString = String(data.token);
                    let prevAuthData = {
                        userToken: tokenString,
                        email: email,
                        isAuthenticated: 'true',
                        name: data.user.name,
                        id: data.user.id,
                        image: data.user.profile_image
                    };
                    await AsyncStorage.setItem('authData', JSON.stringify(prevAuthData));
                    console.log('Datos guardados en AsyncStorage:', prevAuthData);
                    router.replace('/(tabs)');
                } catch (storageError) {
                    console.error('Error guardando datos:', storageError);
                    alert('Error al guardar la sesión');
                }
            } else {
                console.log('Error en login:', data);
                alert('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            alert('Error al intentar iniciar sesión');
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
                <View style={styles.header}>

                    <View style={styles.logoContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="paw" size={40} color="#3B82F6" />
                        </View>
                        <Text style={styles.logoText}>Mascotia</Text>
                        <Text style={styles.subtitleText}>¡Bienvenido de vuelta!</Text>
                    </View>

                    <View style={styles.formCard}>
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

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signupLink}>Regístrate</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
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
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#3B82F6',
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
}); 