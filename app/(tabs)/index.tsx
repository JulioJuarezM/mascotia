import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const PetCard = ({ name, species, image, nextCheckup }: { name: string, species: string, image: string, nextCheckup: string }) => (
  <View style={styles.petCard}>
    <Image
      source={{ uri: image }}
      style={styles.petImage}
    />
    <View style={styles.petInfo}>
      <Text style={styles.petName}>{name}</Text>
      <Text style={styles.petSpecies}>{species}</Text>
      <Text style={styles.checkupText}>Next checkup: {nextCheckup}</Text>
    </View>
  </View>
);

const AdviceCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
  <View style={styles.adviceCard}>
    <Ionicons name={icon as any} size={24} color="#07e4fe" />
    <View style={styles.adviceContent}>
      <Text style={styles.adviceTitle}>{title}</Text>
      <Text style={styles.adviceDescription}>{description}</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [pets, setPets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPets = async () => {
    try {
      const response = await fetch('http://localhost:89/api/v1/mascotia/pets/user/1');
      const data = await response.json();
      const transformedPets = data.map((pet: any) => ({
        name: pet.name,
        species: pet.breed || 'No especificado',
        image: pet.pet_image,
        nextCheckup: 'Próximamente',
      }));
      setPets(transformedPets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
        </View>

        <Text style={styles.sectionTitle}>Tus Mascotas</Text>
        {pets.map((pet: any, index: number) => (
          <PetCard key={index} {...pet} />
        ))}

        <Text style={styles.sectionTitle}>Consejos de Cuidado</Text>
        {pets.map((pet: any, index: number) => (
          <AdviceCard
            key={index}
            title={`Cuidado de ${pet.name}`}
            description={`Recuerda dar atención especial a ${pet.name} hoy`}
            icon="heart"
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chatbubbles" size={24} color="#fff" />
        <Text style={styles.chatButtonText}>AI</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="logo-github" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Asistente AI</Text>
                  <Text style={styles.modalSubtitle}>En línea</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatContainer}>
              <View style={styles.messageContainer}>
                <View style={styles.aiMessage}>
                  <Text style={styles.messageText}>¡Hola! ¿En qué puedo ayudarte hoy?</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#07e4fe" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  petCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  petImage: {
    width: 100,
    height: 100,
  },
  petInfo: {
    padding: 15,
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkupText: {
    fontSize: 12,
    color: '#07e4fe',
    marginTop: 8,
  },
  adviceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adviceContent: {
    marginLeft: 15,
    flex: 1,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  adviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  floatingChatButton: {
    backgroundColor: '#07e4fe',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'flex-end',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#07e4fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#07e4fe',
  },
  closeButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});