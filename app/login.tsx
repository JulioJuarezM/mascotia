import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
                if (!data.token) {
                    console.error('No se recibió token en la respuesta');
                    alert('Error en la autenticación');
                    return;
                }

                try {
                    const tokenString = String(data.token);
                    await AsyncStorage.setItem('userToken', tokenString);
                    await AsyncStorage.setItem('email', email);
                    await AsyncStorage.setItem('isAuthenticated', 'true');
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
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Ionicons name="paw" size={80} color="#07e4fe" />
                <Text style={styles.title}>Mascotia</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#07e4fe',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 