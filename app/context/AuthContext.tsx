import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
    email: string;
    id: number;
    name: string;
    isAuthenticated: boolean;
    userToken: string;
} | null;

type AuthContextType = {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
    user: UserData;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Este hook nos permitirá usar el contexto de autenticación fácilmente
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserData>(null);
    const router = useRouter();
    const segments = useSegments();

    const checkAuthState = async () => {
        try {
            const authData = await AsyncStorage.getItem('authData');
            console.log('Datos recuperados >>>>>>>>>>', authData); // Debug log

            if (authData) {
                const parsedData = JSON.parse(authData);
                // Convertimos explícitamente el string "true" a booleano
                const isAuth = parsedData.isAuthenticated === true || parsedData.isAuthenticated === "true";
                console.log('Estado de autenticación parseado:', isAuth); // Debug log

                setIsAuthenticated(isAuth);
                setUser(parsedData);
            }
        } catch (error) {
            console.error('Error al verificar el estado de autenticación:', error);
        }
    };

    useEffect(() => {
        checkAuthState();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const authData = await AsyncStorage.getItem('authData');
            if (authData) {
                const parsedData = JSON.parse(authData);
                const isAuth = parsedData.isAuthenticated === true || parsedData.isAuthenticated === "true";
                setIsAuthenticated(isAuth);
                setUser(parsedData);
            }
            console.log('Auth state changed:', isAuthenticated);
            console.log('Current segment:', segments[0]);
            console.log('Current user:', user);

            const inAuthGroup = segments[0] === '(auth)';

            if (!isAuthenticated && !inAuthGroup) {
                router.replace('/login');
            } else if (isAuthenticated && inAuthGroup) {
                router.replace('/(tabs)');
            }
        };
        checkAuth();
    }, [isAuthenticated, segments]);

    const signIn = async (email: string, password: string) => {
        try {
            // Simulamos una respuesta exitosa
            const userData = {
                email,
                id: 1,
                name: "Usuario",
                isAuthenticated: true, // Aseguramos que sea booleano
                userToken: "token-ejemplo"
            };

            await AsyncStorage.setItem('authData', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);

            console.log('Datos guardados en signIn:', userData); // Debug log
        } catch (error) {
            console.error('Error de autenticación:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('authData');
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
} 