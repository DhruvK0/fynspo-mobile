import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SplashCarouselComponent from '../Reusable/SplashCarousel';
import { getUserRecs } from '../../utils/requests';
import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator } from 'react-native-paper';

const ItemsView = ({ title, onBack }) => {
  console.log(title)
  return (
    <View style={styles.subContent}>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        <ContentPage title={title} />
    </View>
  );
};

const ContentPage = ({ title }) => {
  const [categoryData, setCategoryData] = useState({});
  const [displayedIds, setDisplayedIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState(0);
  const { user } = useUser();

  // const categories = [
  //   'shirt', 'blouse', 'tank top', 'top', 't-shirt', 'sweatshirt', 'sweater',
  //   'cardigan', 'vest', 'jacket', 'pants', 'shorts', 'skirt', 'coat', 'dress',
  //   'jumpsuit', 'shoe', 'socks', 'necklace', 'bracelet', 'earrings', 'ring',
  //   'body chain', 'hat', 'sunglasses', 'underwear', 'swimwear', 'bag', 'other'
  // ];
  const categories = [
    'top', 
    'shirt', 
    'blouse', 
    // 'tank top', 
    't-shirt', 
    // 'sweatshirt', 
    'sweater',
    'cardigan', 
    'vest', 'jacket', 
    'pants', 'shorts', 'skirt', 'coat', 'dress',
    // 'jumpsuit', 
    'shoe', 
    // 'socks',
    //  'necklace', 'bracelet', 'earrings', 'ring',
    // 'body chain', 
    // 'hat', 'sunglasses',
    // 'underwear', 
    'swimwear', 
    //  'bag',
    
    // 'other'
  ];

  const INITIAL_LOAD_COUNT = 5;
  const LOAD_MORE_COUNT = 3;
  const loadingRef = useRef(false);

  const fetchCategoryData = useCallback(async (category) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const uid = user.id;
      const result = await getUserRecs(uid, category, null, null, null, null, [title]);
      if (result && result.length > 0) {
        setCategoryData(prevData => ({
          ...prevData,
          [category]: result
        }));
        setDisplayedIds(prevIds => ({
          ...prevIds,
          [category]: result.map(item => item.fynspo_id)
        }));
      }
    } catch (error) {
      console.error(`Error fetching data for category ${category}:`, error);
    } finally {
      loadingRef.current = false;
      setLoadedCategories(prev => prev + 1);
    }
  }, [user, title]);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setLoadedCategories(0);
    setCategoryData({});
    setDisplayedIds({});

    const initialCategories = categories.slice(0, INITIAL_LOAD_COUNT);
    await Promise.all(initialCategories.map(fetchCategoryData));

    setIsLoading(false);
  }, [fetchCategoryData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loadMoreCategories = useCallback(() => {
    const nextCategoryIndex = loadedCategories;
    if (nextCategoryIndex < categories.length) {
      const categoriesToLoad = categories.slice(nextCategoryIndex, nextCategoryIndex + LOAD_MORE_COUNT);
      categoriesToLoad.forEach(fetchCategoryData);
    }
  }, [loadedCategories, fetchCategoryData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  }, [fetchInitialData]);

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
      .slice(startIndex, startIndex + 10)
      .map(mapApiItemToCarouselItem);
  }, [categoryData, mapApiItemToCarouselItem]);

  const fetchItemsForCategory = useCallback((category) => async (page) => {
    try {
      const uid = user.id;
      const shownIds = displayedIds[category] || [];
      const newItems = await getUserRecs(
        uid,
        category,
        user.unsafeMetadata.fashionPreference,
        shownIds,
        null,
        null,
        title
      );

      if (newItems && newItems.length > 0) {
        setCategoryData(prevData => ({
          ...prevData,
          [category]: [...(prevData[category] || []), ...newItems]
        }));
        setDisplayedIds(prevIds => ({
          ...prevIds,
          [category]: [...(prevIds[category] || []), ...newItems.map(item => item.fynspo_id)]
        }));
        return newItems.map(mapApiItemToCarouselItem);
      } else {
        return getItemsForCategory(category, page);
      }
    } catch (error) {
      console.error('Error fetching new items for category:', error);
      return getItemsForCategory(category, page);
    }
  }, [user, displayedIds, getItemsForCategory, mapApiItemToCarouselItem, title]);

  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      loadMoreCategories();
    }
  }, [loadMoreCategories]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting Your Clothes</Text>
          <ActivityIndicator size="large" color="#8400ff" />
        </View>
      </SafeAreaView>
    );
  }

  const categoriesWithItems = Object.keys(categoryData).filter(category => categoryData[category] && categoryData[category].length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8400ff"
            titleColor="#fff"
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {categoriesWithItems.length > 0 ? (
          categoriesWithItems.map((category, index) => (
            <SplashCarouselComponent 
              key={index} 
              title={category.charAt(0).toUpperCase() + category.slice(1)} 
              fetchItems={fetchItemsForCategory(category)}
              initialItems={getItemsForCategory(category)}
            />
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No items found for any category.</Text>
          </View>
        )}
        {loadedCategories < categories.length && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#8400ff" />
            <Text style={styles.loadingMoreText}>Loading more categories...</Text>
          </View>
        )}
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
    marginBottom: 20,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  noItemsText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingMoreText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ItemsView;