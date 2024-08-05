import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import CarouselComponent from '../Reusable/Carousel';

const ForYouPage = () => {
  // Sample fetch function (replace with actual API calls)
  const fetchItems = (category) => async (page) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${category}-${page}-${i}`,
      image: 'https://example.com/image.jpg',
      brand: `Brand ${page}-${i}`,
      name: `${category} Item ${page}-${i}`,
      price: Math.floor(Math.random() * 100) + 20,
    }));
  };

  const categories = [
    { title: 'Just for you', fetchItems: fetchItems('JustForYou') },
    { title: 'Tops', fetchItems: fetchItems('Tops') },
    { title: 'Trending', fetchItems: fetchItems('Trending') },
    { title: 'Bottoms', fetchItems: fetchItems('Bottoms') },
    { title: 'Shoes', fetchItems: fetchItems('Shoes') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map((category, index) => (
          <CarouselComponent 
            key={index} 
            title={category.title} 
            fetchItems={category.fetchItems} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingVertical: 20,
  },
});

export default ForYouPage;