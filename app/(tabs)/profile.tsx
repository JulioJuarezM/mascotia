import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit, LogOut, Bell, Heart, Calendar, CreditCard, CircleHelp, Shield, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut, isAuthenticated, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [image, setImage] = useState('');
  const handleLogout = async () => {
    try {
      await signOut();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const authData = await AsyncStorage.getItem('authData');
      if (authData) {
        const data = JSON.parse(authData);
        setName(data.name);
        setEmail(data.email);
        setId(data.id);
        setImage(data.image);
      }
    };
    fetchUser();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.headerTop}>
            <Text style={styles.headerTitle}>Perfil</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={22} color="#1F2937" strokeWidth={2.2} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#FFFFFF" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={16} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Account Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(700)}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Edit size={20} color="#3B82F6" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Editar perfil</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Bell size={20} color="#F43F5E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Notificaciones</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Shield size={20} color="#10B981" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Privacidad y seguridad</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Payments Section */}
          <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <Text style={styles.sectionTitle}>Pagos</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <CreditCard size={20} color="#3B82F6" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Métodos de pago</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Calendar size={20} color="#10B981" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Historial de pagos</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Preferences Section */}
          <Animated.View entering={FadeInDown.delay(500).duration(700)}>
            <Text style={styles.sectionTitle}>Preferencias</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Heart size={20} color="#F43F5E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Favoritos</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#FFF7ED' }]}>
                  <CircleHelp size={20} color="#F97316" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>Ayuda y soporte</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* App Info */}
          <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.appInfo}>
            <Text style={styles.appVersion}>Versión 1.0.0</Text>
            <View style={styles.appInfoLinks}>
              <TouchableOpacity>
                <Text style={styles.appInfoLink}>Términos de servicio</Text>
              </TouchableOpacity>
              <View style={styles.appInfoDot} />
              <TouchableOpacity>
                <Text style={styles.appInfoLink}>Política de privacidad</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#94A3B8',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
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
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 5,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 25,
    marginBottom: 15,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  appVersion: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 10,
  },
  appInfoLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfoLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  appInfoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginHorizontal: 8,
  },
});