import { useEffect, useState } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

const SplashScreen = () => (
  <Animated.View
    style={styles.splash}
    exiting={FadeOut.duration(500).withCallback((finished) => {
      'worklet';
      if (finished) {
        console.log('Animación completada');
      }
    })}
  >
    <Image
      source={require('../assets/images/icon-mascotia.webp')}
      style={styles.splashIcon}
    />
    <Text style={styles.splashTitle}>MASCOTIA</Text>
    <Text style={styles.splashSubtitle}>Tu asistente veterinario</Text>
  </Animated.View>
);

function useProtectedRoute(user: string | null, showSplash: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (showSplash) return;

      const inAuthGroup = segments[0] === '(tabs)';
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('User token en effect:', userToken);
        console.log('user:', user);
        console.log('inAuthGroup:', inAuthGroup);

        if (!userToken && inAuthGroup) {
          console.log('Redirigiendo a login');
          router.replace('/login');
        } else if (userToken && !inAuthGroup) {
          console.log('Redirigiendo a tabs');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [user, segments, showSplash]);
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    window.frameworkReady?.();

    const initializeApp = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        console.log('Token recuperado >>>>>>>>>>>', savedToken);
        setUser(savedToken);
      } catch (error) {
        console.error('Error al recuperar el token:', error);
        setUser(null);
      }
    };

    initializeApp();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  console.log('Logger in effect user', user);
  useProtectedRoute(user, showSplash);

  return (
    <>
      {showSplash ? (<SplashScreen />) : (<Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>)}
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  splashIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
});