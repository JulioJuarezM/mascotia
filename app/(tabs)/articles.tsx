import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, BookOpen, Clock, User, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ArticlesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <Animated.View entering={FadeInDown.delay(100).duration(700)}>
            <Text style={styles.headerTitle}>Artículos</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" strokeWidth={2.2} />
              <Text style={styles.searchPlaceholder}>Buscar artículos...</Text>
            </View>
          </Animated.View>

          {/* Categories */}
          <Animated.View entering={FadeInDown.delay(300).duration(700)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
                <Text style={[styles.categoryText, styles.categoryTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Salud</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Nutrición</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Entrenamiento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryText}>Cuidados</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>

        {/* Featured Article */}
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Destacado</Text>
            </View>

            <TouchableOpacity>
              <View style={styles.featuredCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredGradient}
                />
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <BookOpen size={12} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.featuredBadgeText}>Salud</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Cómo mantener a tu perro saludable en verano</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.featuredMetaItem}>
                      <Clock size={14} color="#FFFFFF" strokeWidth={2.2} />
                      <Text style={styles.featuredMetaText}>5 min</Text>
                    </View>
                    <View style={styles.featuredMetaItem}>
                      <User size={14} color="#FFFFFF" strokeWidth={2.2} />
                      <Text style={styles.featuredMetaText}>Dr. Martínez</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Latest Articles */}
          <Animated.View entering={FadeInDown.delay(500).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos artículos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Article Card 1 */}
            <TouchableOpacity>
              <View style={styles.articleCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=2071&auto=format&fit=crop' }}
                  style={styles.articleImage}
                />
                <View style={styles.articleContent}>
                  <View style={styles.articleBadge}>
                    <Text style={styles.articleBadgeText}>Nutrición</Text>
                  </View>
                  <Text style={styles.articleTitle}>La dieta ideal para tu mascota según su edad</Text>
                  <View style={styles.articleMeta}>
                    <View style={styles.articleMetaItem}>
                      <Clock size={14} color="#64748B" strokeWidth={2.2} />
                      <Text style={styles.articleMetaText}>3 min</Text>
                    </View>
                    <View style={styles.articleMetaDot} />
                    <Text style={styles.articleDate}>Hace 2 días</Text>
                  </View>
                  <TouchableOpacity style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Leer más</Text>
                    <ArrowRight size={16} color="#3B82F6" strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Article Card 2 */}
            <TouchableOpacity>
              <View style={styles.articleCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1986&auto=format&fit=crop' }}
                  style={styles.articleImage}
                />
                <View style={styles.articleContent}>
                  <View style={[styles.articleBadge, styles.trainingBadge]}>
                    <Text style={styles.articleBadgeText}>Entrenamiento</Text>
                  </View>
                  <Text style={styles.articleTitle}>5 trucos para enseñar a tu perro comandos básicos</Text>
                  <View style={styles.articleMeta}>
                    <View style={styles.articleMetaItem}>
                      <Clock size={14} color="#64748B" strokeWidth={2.2} />
                      <Text style={styles.articleMetaText}>7 min</Text>
                    </View>
                    <View style={styles.articleMetaDot} />
                    <Text style={styles.articleDate}>Hace 5 días</Text>
                  </View>
                  <TouchableOpacity style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Leer más</Text>
                    <ArrowRight size={16} color="#3B82F6" strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Popular Topics */}
          <Animated.View entering={FadeInDown.delay(600).duration(700)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Temas populares</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.topicsGrid}>
              {/* Topic 1 */}
              <TouchableOpacity style={styles.topicItem}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=1974&auto=format&fit=crop' }}
                  style={styles.topicImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.topicGradient}
                />
                <Text style={styles.topicTitle}>Salud dental</Text>
              </TouchableOpacity>

              {/* Topic 2 */}
              <TouchableOpacity style={styles.topicItem}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1974&auto=format&fit=crop' }}
                  style={styles.topicImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.topicGradient}
                />
                <Text style={styles.topicTitle}>Ejercicio</Text>
              </TouchableOpacity>

              {/* Topic 3 */}
              <TouchableOpacity style={styles.topicItem}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974&auto=format&fit=crop' }}
                  style={styles.topicImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.topicGradient}
                />
                <Text style={styles.topicTitle}>Vacunas</Text>
              </TouchableOpacity>

              {/* Topic 4 */}
              <TouchableOpacity style={styles.topicItem}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?q=80&w=1974&auto=format&fit=crop' }}
                  style={styles.topicImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.topicGradient}
                />
                <Text style={styles.topicTitle}>Adopción</Text>
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
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 10,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
  featuredCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
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
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  featuredTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  featuredMetaText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
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
  articleImage: {
    width: '100%',
    height: 150,
  },
  articleContent: {
    padding: 15,
  },
  articleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  trainingBadge: {
    backgroundColor: '#F0FDF4',
  },
  articleBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#3B82F6',
  },
  articleTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  articleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMetaText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#64748B',
    marginLeft: 5,
  },
  articleMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginHorizontal: 8,
  },
  articleDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  readMoreText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 5,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicItem: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
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
  topicImage: {
    width: '100%',
    height: '100%',
  },
  topicGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  topicTitle: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});