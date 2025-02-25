import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Definir interfaz para el tipo de usuario
interface User {
  name: string;
  email: string;
  profileImage: string;
}

const MenuItem = ({ icon, title, subtitle, showBadge }: { icon: string, title: string, subtitle: string, showBadge: boolean }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuIcon}>
      <Ionicons name={icon as any} size={24} color="#07e4fe" />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.menuRight}>
      {showBadge && <View style={styles.badge} />}
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </View>
  </TouchableOpacity>
);

export default function UserScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const response = await fetch(`http://localhost:89/api/v1/mascotia/user/${email}`); // Reemplaza con tu endpoint real
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/login');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.profile_image || 'https://default-image-url.com' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <MenuItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
            showBadge={false}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts"
            showBadge
          />
          <MenuItem
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password and authentication"
            showBadge={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Care</Text>
          <MenuItem
            icon="calendar-outline"
            title="Appointments"
            subtitle="View upcoming vet visits"
            showBadge={false}
          />
          <MenuItem
            icon="medical-outline"
            title="Health Records"
            subtitle="Access pet medical history"
            showBadge={false}
          />
          <MenuItem
            icon="document-text-outline"
            title="Documents"
            subtitle="View important files"
            showBadge={false}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#07e4fe" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#07e4fe',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#07e4fe',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    marginBottom: 30,
  },
  logoutText: {
    color: '#07e4fe',
    fontSize: 16,
    fontWeight: '500',
  },
});