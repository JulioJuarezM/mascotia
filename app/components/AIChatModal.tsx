import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

interface AIChatModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function AIChatModal({ isVisible, onClose }: AIChatModalProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con el cuidado de tus mascotas?',
            isBot: true,
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = React.useRef<ScrollView>(null);

    const handleSend = async () => {
        if (inputMessage.trim() === '' || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            isBot: false,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const url = `${process.env.API_URL}/api/v1/mascotia/ia/chat`;
            console.log('URL:', url);
            const sessionId = user?.email + '1' || user?.id || 'anonymous';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify({
                    prompt: inputMessage,
                    sessionId: sessionId
                })
            });

            const data = await response.text();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data || 'Lo siento, hubo un error al procesar tu mensaje.',
                isBot: true,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                isBot: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }

        setInputMessage('');
    };

    const formatMessage = (text: string) => {
        try {
            // Intenta parsear el JSON si es una respuesta en formato JSON
            const jsonResponse = JSON.parse(text);
            return jsonResponse.message || jsonResponse.response || text;
        } catch {
            // Si no es JSON, retorna el texto tal cual
            return text.replace(/\\n/g, '\n').replace(/\\/g, '');
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Asistente Virtual</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Messages */}
                    <ScrollView
                        style={styles.messagesContainer}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((message) => (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageWrapper,
                                    message.isBot ? styles.botMessageWrapper : styles.userMessageWrapper,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.messageBubble,
                                        message.isBot ? styles.botMessage : styles.userMessage,
                                    ]}
                                >
                                    <Text style={[
                                        styles.messageText,
                                        message.isBot ? styles.botMessageText : styles.userMessageText,
                                    ]}>
                                        {formatMessage(message.text)}
                                    </Text>
                                </View>
                                <Text style={styles.timestamp}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        ))}
                        {isLoading && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="small" color="#3B82F6" />
                                <Text style={styles.loaderText}>Escribiendo...</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                    >
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Escribe un mensaje..."
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                multiline
                                maxLength={500}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                style={[
                                    styles.sendButton,
                                    isLoading && styles.sendButtonDisabled
                                ]}
                                disabled={inputMessage.trim() === '' || isLoading}
                            >
                                <Send size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageWrapper: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    botMessageWrapper: {
        alignSelf: 'flex-start',
    },
    userMessageWrapper: {
        alignSelf: 'flex-end',
    },
    messageBubble: {
        borderRadius: 16,
        padding: 12,
        maxWidth: '100%',
    },
    botMessage: {
        backgroundColor: '#F3F4F6',
    },
    userMessage: {
        backgroundColor: '#3B82F6',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    botMessageText: {
        color: '#1F2937',
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    timestamp: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#3B82F6',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginLeft: 8,
    },
    loaderText: {
        marginLeft: 8,
        color: '#6B7280',
        fontSize: 14,
    },
}); 