import { StyleSheet, Platform } from 'react-native';

const indexStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#64748B',
    },
    nameText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#1E293B',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F43F5E',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    petCardContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#3B82F6',
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    petCard: {
        borderRadius: 24,
        padding: 20,
    },
    petCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    petCardTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 4,
    },
    petName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    appointmentInfo: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    appointmentDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    appointmentText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        color: '#FFFFFF',
        marginLeft: 5,
    },
    detailsButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    detailsButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        color: '#FFFFFF',
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    content: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#1E293B',
    },
    seeAllText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#3B82F6',
    },
    petsScrollContainer: {
        paddingRight: 20,
    },
    petItem: {
        marginRight: 15,
        alignItems: 'center',
        width: 100,
    },
    petImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
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
    petItemImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    petItemName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#1E293B',
        marginTop: 8,
    },
    petItemBreed: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#64748B',
    },
    addPetButton: {
        alignItems: 'center',
        width: 100,
    },
    addPetIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    addPetIcon: {
        fontSize: 30,
        color: '#94A3B8',
    },
    addPetText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },
    addPetSubtext: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#94A3B8',
        marginTop: -3,
    },
    tipCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 15,
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
    tipCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    tipIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    tipTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#1E293B',
    },
    tipDescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#64748B',
    },
    tipArrowContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceItem: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
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
    serviceIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceIcon: {
        width: 36,
        height: 36,
    },
    serviceTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#1E293B',
        textAlign: 'center',
    },
    aiButtonContainer: {
        position: 'absolute',
        right: 20,
    },
    aiButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#3B82F6',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    aiButtonBlur: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 4,
    },
});

export default indexStyles;