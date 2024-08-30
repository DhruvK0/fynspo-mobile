import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Modal, SafeAreaView, Image } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ItemComponent from './Item';
import ItemGrid from './ItemGrid';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4;
const ITEM_MARGIN = 10;
const VISIBLE_ITEMS = 2.5;
const SPLASH_SIZE = screenWidth;

const SplashCarouselComponent = ({ title, fetchItems }) => {
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
        uniqueId: Math.random().toString(36).substr(2, 9)
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
      item={{ ...item, style: [styles.carouselItem, { width: ITEM_WIDTH }, index === 0 && styles.firstCarouselItem, index === items.length - 1 && styles.lastCarouselItem] }}
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

  const handleOpenGrid = () => {
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

  const renderSplashImage = () => {
    if (items.length === 0) return null;
    const firstItem = items[0];
    return (
      <TouchableOpacity onPress={handleOpenGrid}>
        <View style={styles.splashContainer}>
          
            <FastImage
              style={styles.splashImage}
              source={{
                uri: firstItem.image,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
           />
          <LinearGradient 
                colors={['#00000000', '#000000']} 
                style={styles.gradient}
          />
          <TouchableOpacity style={styles.categoryButton} onPress={handleOpenGrid}>
            <Text style={styles.categoryText}>{title}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      {renderSplashImage()}
      <View style={styles.titleContainer}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <TouchableOpacity onPress={handleOpenGrid} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>View More</Text>
          <Text style={styles.arrowRight}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.carouselWrapper}>
        <FlatList
          data={items.slice(1)} // Skip the first item as it's used for the splash
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
  splashContainer: {
    width: SPLASH_SIZE,
    height: SPLASH_SIZE,
    alignSelf: 'center',
    marginBottom: 20,
    // paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    opacity: 0.9
  },

  titleContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  paddingHorizontal: 15,
},
carouselTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
},
viewMoreButton: {
  flexDirection: 'row',
  alignItems: 'center',
  
},
viewMoreText: {
  color: '#D3D3D3',
  fontWeight: 'bold',
  fontSize: 12,
},
arrowRight: {
  color: '#fff',
  fontSize: 12,
  marginLeft: 5,
},
  categoryButton: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 20,
    // backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'left ',
    width: SPLASH_SIZE * 0.6,
    justifyContent: 'left',
    // borderColor: '#8400ff',
    // borderWidth: 1,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  carouselWrapper: {
    position: 'relative',
    height: ITEM_WIDTH * 2.2,
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
    width: 24,
  },
});

export default SplashCarouselComponent;