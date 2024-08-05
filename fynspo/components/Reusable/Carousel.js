import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import ItemComponent from './Item';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4; // 40% of screen width
const ITEM_MARGIN = 10;
const VISIBLE_ITEMS = 2.5; // Show 2 full items and half of the third

const CarouselComponent = ({ title, fetchItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      setItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchItems, page, loading]);

  useEffect(() => {
    loadItems();
  }, []);

  const renderItem = ({ item, index }) => (
    <ItemComponent
      {...item}
      style={[
        styles.carouselItem,
        { width: ITEM_WIDTH },
        index === 0 && styles.firstCarouselItem,
        index === items.length - 1 && styles.lastCarouselItem,
      ]}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#8400ff" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (items.length >= 10) {
      loadItems();
    }
  };

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>{title}</Text>
      <View style={styles.carouselWrapper}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.75}
          ListFooterComponent={renderFooter}
        //   snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
        //   decelerationRate="slow"
        //   snapToAlignment="start"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 20,
  },
  carouselWrapper: {
    position: 'relative',
    height: ITEM_WIDTH * 2, // Adjust this value based on your item height
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
    color: '#fff',
  },
  carouselContent: {
    paddingHorizontal: screenWidth * (1 - VISIBLE_ITEMS * 0.4) / 2 - ITEM_MARGIN,
  },
  carouselItem: {
    marginHorizontal: ITEM_MARGIN,
  },
  firstCarouselItem: {
    marginLeft: ITEM_MARGIN,
  },
  lastCarouselItem: {
    marginRight: ITEM_MARGIN,
  },
  loaderContainer: {
    width: ITEM_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default CarouselComponent;