import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text } from 'react-native';
import SplashCarouselComponent from '../Reusable/SplashCarousel';
import { getUserRecs } from '../../utils/requests';
import { useUser } from '@clerk/clerk-expo'

const ForYouPage = () => {
  const [categoryData, setCategoryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const categories = [
    'shirt', 'blouse', 'tank top', 'top', 't-shirt', 'sweatshirt', 'sweater',
    'cardigan', 'vest', 'jacket', 'pants', 'shorts', 'skirt', 'coat', 'dress',
    'jumpsuit', 'shoe', 'socks', 'necklace', 'bracelet', 'earrings', 'ring',
    'body chain', 'hat', 'sunglasses', 'underwear', 'swimwear', 'bag', 'other'
  ];

  useEffect(() => {
    fetchAllCategoryData();
  }, []);

  const fetchAllCategoryData = async () => {
    setIsLoading(true);
    try {
      const uid = user.id; // Replace with actual user ID
      const dataPromises = categories.map(category => 
        getUserRecs(uid, category, user.unsafeMetadata.fashionPreference, null, null, null)
      );
      const results = await Promise.all(dataPromises);
      const newCategoryData = {};
      categories.forEach((category, index) => {
        newCategoryData[category] = results[index];
      });
      setCategoryData(newCategoryData);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapApiItemToCarouselItem = useCallback((apiItem) => ({
    apiItem,
    id: apiItem.fynspo_id,
    image: apiItem.display_image,
    brand: apiItem.brand,
    name: apiItem.title,
    price: apiItem.price,
  }), []);

  const getItemsForCategory = useCallback((category, page = 0) => {
    const items = categoryData[category] || [];
    const startIndex = page * 10 % items.length;
    return items
      .concat(items) // Duplicate the array to allow wrapping around
      .slice(startIndex, startIndex + 10)
      .map(mapApiItemToCarouselItem);
  }, [categoryData, mapApiItemToCarouselItem]);

  const fetchItemsForCategory = useCallback((category) => async (page) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getItemsForCategory(category, page);
  }, [getItemsForCategory]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map((category, index) => (
          <SplashCarouselComponent 
            key={index} 
            title={category.charAt(0).toUpperCase() + category.slice(1)} 
            fetchItems={fetchItemsForCategory(category)}
            initialItems={getItemsForCategory(category)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ForYouPage;