import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ArticleCard = ({ title, category, image, readTime, bookmarked }) => (
  <TouchableOpacity style={styles.articleCard}>
    <Image source={{ uri: image }} style={styles.articleImage} />
    <View style={styles.articleContent}>
      <View style={styles.categoryContainer}>
        <Text style={styles.category}>{category}</Text>
        <TouchableOpacity>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={bookmarked ? "#07e4fe" : "#666"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.readTimeContainer}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.readTime}>{readTime} min read</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CategoryChip = ({ name, active }) => (
  <TouchableOpacity
    style={[
      styles.categoryChip,
      active && styles.activeCategoryChip
    ]}
  >
    <Text
      style={[
        styles.categoryChipText,
        active && styles.activeCategoryChipText
      ]}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

export default function ArticlesScreen() {
  const articles = [
    {
      title: "Essential Vaccinations for Your Puppy",
      category: "Health",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=300",
      readTime: 5,
      bookmarked: true,
    },
    {
      title: "Understanding Cat Behavior",
      category: "Behavior",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300",
      readTime: 7,
      bookmarked: false,
    },
    {
      title: "Nutrition Guide for Senior Dogs",
      category: "Nutrition",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=300",
      readTime: 6,
      bookmarked: false,
    },
  ];

  const categories = [
    { name: "All", active: true },
    { name: "Health", active: false },
    { name: "Nutrition", active: false },
    { name: "Behavior", active: false },
    { name: "Training", active: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Care Articles</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <CategoryChip key={index} {...category} />
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {articles.map((article, index) => (
          <ArticleCard key={index} {...article} />
        ))}
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
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#07e4fe',
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryChipText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    color: '#07e4fe',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTime: {
    color: '#666',
    fontSize: 14,
  },
});