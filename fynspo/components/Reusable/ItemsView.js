import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ForYouPage from '../Subcomponents/ForYou';

import SplashCarouselComponent from '../Reusable/SplashCarousel';
import { FetchService, getFilters } from '../../utils/requests';

const ItemsView = ({ title, onBack }) => {
  return (
    <View style={styles.subContent}>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        <ContentPage />
    </View>
  );
};


const ContentPage = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchTrendingItems();
  }, [filters]);

  const loadFilters = async () => {
    const savedFilters = await getFilters();
    setFilters(savedFilters);
  };

  const fetchTrendingItems = async () => {
    try {
      setIsLoading(true);
      const data = await FetchService.getTrendingItems(1, filters);
      setTrendingItems(data);
    } catch (error) {
      console.error('Error fetching trending items:', error);
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

  const getItemsForCategory = useCallback((offset = 0, page = 0) => {
    const startIndex = (offset + page) * 10 % trendingItems.length;
    const endIndex = startIndex + 10;
    return trendingItems
      .concat(trendingItems) // Duplicate the array to allow wrapping around
      .slice(startIndex, startIndex + 10)
      .map(mapApiItemToCarouselItem);
  }, [trendingItems, mapApiItemToCarouselItem]);

  const fetchItemsForCategory = useCallback((offset) => async (page) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getItemsForCategory(offset, page);
  }, [getItemsForCategory]);

  const categories = [
    { title: 'Just for you', offset: 0 },
    { title: 'Tops', offset: 2 },
    { title: 'Trending', offset: 4 },
    { title: 'Bottoms', offset: 6 },
    { title: 'Shoes', offset: 8 },
  ];

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
            title={category.title} 
            fetchItems={fetchItemsForCategory(category.offset)}
            initialItems={getItemsForCategory(category.offset)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backButtonContainer: {
    marginBottom: 40,
    },
  fillerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
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

export default ItemsView;