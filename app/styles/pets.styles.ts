import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    addButton: {
        backgroundColor: '#07e4fe',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    petItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    petDetails: {
        flex: 1,
        marginLeft: 15,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    petSpecies: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#07e4fe',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#a6b4b3',
    },
    registerButton: {
        backgroundColor: '#07e4fe',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#07e4fe',
    },
    errorContainer: {
        padding: 15,
        backgroundColor: '#f8d7da',
        borderRadius: 10,
        marginBottom: 15,
    },
    errorText: {
        color: '#721c24',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailPetImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
        marginBottom: 15,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#07e4fe',
        padding: 12,
        shadowColor: '#07e4fe',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    detailSection: {
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        padding: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 12,
    },

    detailLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 1,
    },

    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
}); 