import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text, RefreshControl } from 'react-native';
import SplashCarouselComponent from '../Reusable/SplashCarousel';
import { getUserRecs } from '../../utils/requests';
import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator } from 'react-native-paper';
import { getFilterState, subscribeToFilterChanges } from '../../utils/storage';

const ForYouPage = () => {
  const [categoryData, setCategoryData] = useState({});
  const [displayedIds, setDisplayedIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState(0);
  const [filters, setFilters] = useState(null);
  const { user } = useUser();

  const categories = [
    'shirt', 
    'blouse', 
    // 'tank top', 
    'top', 
    't-shirt', 
    // 'sweatshirt', 
    'sweater',
    'cardigan', 
    // 'vest', 'jacket', 
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
  const LOAD_MORE_COUNT = 5;
  const loadingRef = useRef(false);

  const fetchFilters = useCallback(async () => {
    try {
      const filterState = await getFilterState();
      setFilters(filterState || {});
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters({});
    }
  }, []);

  useEffect(() => {
    fetchFilters();

    const unsubscribe = subscribeToFilterChanges((newFilters) => {
      setFilters(newFilters);
    });

    return () => unsubscribe();
  }, [fetchFilters]);

  // useEffect(() => {
  //   console.log('Filters:', filters);
  // }, [filters]);

  const fetchCategoryData = useCallback(async (category) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const uid = user.id;
      const result = await getUserRecs(
        uid,
        category,
        user.unsafeMetadata.fashionPreference,
        null,
        null,
        null,
        filters.filters?.Brand,
        filters.filters?.Price[0],
        filters.filters?.Price[1]
      );
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
  }, [user, filters]);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setLoadedCategories(0);
    setCategoryData({});
    setDisplayedIds({});

    for (let i = 0; i < INITIAL_LOAD_COUNT && i < categories.length; i++) {
      await fetchCategoryData(categories[i]);
    }

    setIsLoading(false);
  }, [fetchCategoryData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData, filters]);

  const loadMoreCategories = useCallback(async () => {
    const nextCategoryIndex = loadedCategories;
    const endIndex = Math.min(nextCategoryIndex + LOAD_MORE_COUNT, categories.length);
    
    for (let i = nextCategoryIndex; i < endIndex; i++) {
      await fetchCategoryData(categories[i]);
    }
  }, [loadedCategories, fetchCategoryData, categories]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFilters();
    await fetchInitialData();
    setRefreshing(false);
  }, [fetchInitialData, fetchFilters]);

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
        filters.filters?.Brand,
        filters.filters?.Price[0],
        filters.filters?.Price[1]
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
  }, [user, displayedIds, getItemsForCategory, mapApiItemToCarouselItem, filters]);

  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >=
        (contentSize.height - paddingToBottom) / 4) {
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

  const categoriesWithItems = Object.keys(categoryData).filter(category => categoryData[category].length > 0);

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

export default ForYouPage;