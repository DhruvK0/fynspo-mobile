import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';
import CategoryButton from './Buttons/CategoryButton';
import { HomeGrid } from './FlatGrid';
import ImageViewer from './ImageViewer';
import { track } from '@amplitude/analytics-react-native';

const { width, height } = Dimensions.get('window');

const OutfitItem = ({ item, onBuy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [category, setCategory] = useState("Select Category");
  const [clothing, setClothing] = useState(item.data);
  const [outfitViewStartTime, setOutfitViewStartTime] = useState(null);
  const [categoryViewStartTime, setCategoryViewStartTime] = useState(null);
  const [categoryClickCounts, setCategoryClickCounts] = useState({});
  const [clothingItemClickCounts, setClothingItemClickCounts] = useState({});

  useEffect(() => {
    if (clothing) {
      setCategory(Object.keys(clothing)[0]);
    }
  }, [clothing]);

  const openSubpage = () => {
    setIsOpen(true);
    setOutfitViewStartTime(Date.now());
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    track('outfit_opened', { outfitId: item.id, image: item.image });
  };

  const closeSubpage = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      const viewDuration = (Date.now() - outfitViewStartTime) / 1000; // in seconds
      track('outfit_closed', { 
        outfitId: item.id, 
        image: item.image, 
        viewDuration,
        categoryClicks: categoryClickCounts,
        clothingItemClicks: clothingItemClickCounts
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        slideAnim.setValue(Math.max(gestureState.dx, 0));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > width / 3) {
          closeSubpage();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (!isOpen) {
      slideAnim.setValue(width);
    }
  }, [isOpen]);

  const handleCategoryPress = (categoryName) => {
    if (category !== categoryName) {
      const categoryViewDuration = categoryViewStartTime ? (Date.now() - categoryViewStartTime) / 1000 : 0;
      track('category_view', {
        outfitId: item.id,
        outfitImage: item.image,
        category,
        viewDuration: categoryViewDuration
      });
    }
    setCategory(categoryName);
    setCategoryViewStartTime(Date.now());
    setCategoryClickCounts(prev => ({
      ...prev,
      [categoryName]: (prev[categoryName] || 0) + 1
    }));
  };

  const handleClothingItemClick = (clothingItem) => {
    setClothingItemClickCounts(prev => ({
      ...prev,
      [clothingItem.id]: (prev[clothingItem.id] || 0) + 1
    }));
    track('clothing_item_click', {
      outfitId: item.id,
      outfitImage: item.image,
      clothingItemId: clothingItem.id,
      category
    });
  };

  return (
    <>
      <Pressable onPress={openSubpage} style={styles.pressable}>
        <Image source={{uri: item.image}} style={styles.image} />
      </Pressable>

      {isOpen && (
        <Portal>
          <View style={styles.fullScreenContainer}>
            <Animated.View 
              {...panResponder.panHandlers}
              style={[
                styles.subpage, 
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <SafeAreaView>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={closeSubpage}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  <View style={styles.imageContainer} collapsable={false}>
                    <ImageViewer 
                      selectedImage={item.image} 
                      style={{ height: '100%', width: '100%' }} 
                      height={height /2}
                    />
                  </View>

                  <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                  >
                    {clothing && Object.keys(clothing).map((key, index) => (
                      <CategoryButton 
                        key={index} 
                        label={key} 
                        onPress={() => handleCategoryPress(key)}
                        active={category === key}
                      />
                    ))}
                  </ScrollView>
                  <View style={styles.gridContainer}>
                    <HomeGrid 
                      clothing={clothing[category][0]} 
                      onItemClick={handleClothingItemClick}
                    />
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Animated.View>
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullScreenContainer: {
    position: 'absolute',
    // top: 0,
    // left: 0,
    width: width,
    // height: height,
    // zIndex: 1000,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subpage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width,
    height: height,
    backgroundColor: 'black',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingTop: 60,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalImage: {
    width: '80%',
    height: '40%',
    resizeMode: 'contain',
    // borderRadius: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  buyButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  categoriesContainer: {
    backgroundColor: 'black',
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 2,
  },
  categoryButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#2ecc71',
  },
  categoryButtonText: {
    color: 'white',
  },
  // gridContainer: {
  //   marginTop: 20,
  //   width: '100%',
  // },
  gridItem: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  gridItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  gridItemText: {
    color: 'white',
    marginTop: 5,
  },
});

export default OutfitItem;