import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons'; // Import the icon set
import ItemComponent from './Item';
import ItemGrid from './ItemGrid';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4;
const ITEM_MARGIN = 10;
const VISIBLE_ITEMS = 2.5;

const CarouselComponent = ({ title, fetchItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showAllItems, setShowAllItems] = useState(false);
  const translateX = useSharedValue(screenWidth);

  const loadItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      const itemsWithIds = newItems.map(item => ({
        ...item,
        uniqueId: item.id || Math.random().toString(36).substr(2, 9)
      }));
      setItems(prevItems => [...prevItems, ...itemsWithIds]);
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

  const handleViewMore = () => {
    setShowAllItems(true);
    translateX.value = withTiming(0, { duration: 300 });
  };

  const handleClose = () => {
    translateX.value = withTiming(screenWidth, { duration: 300 }, () => {
      runOnJS(setShowAllItems)(false);
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(context.startX + event.translationX, 0);
    },
    onEnd: (event) => {
      if (event.translationX > screenWidth / 3) {
        runOnJS(handleClose)();
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>View More</Text>
          <Text style={styles.arrowRight}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.carouselWrapper}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.uniqueId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.75}
          ListFooterComponent={renderFooter}
        />
      </View>
      <Modal
        visible={showAllItems}
        animationType="none"
        transparent={true}
        onRequestClose={handleClose}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <View style={styles.placeholder} />
                </View>
                <ItemGrid fetchItems={fetchItems} />
              </SafeAreaView>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  carouselWrapper: {
    position: 'relative',
    height: ITEM_WIDTH * 2.2,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  arrowRight: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 5,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginBottom: 3
  },
  placeholder: {
    width: 24,  // Match the width of the back button icon
  },
});

export default CarouselComponent;