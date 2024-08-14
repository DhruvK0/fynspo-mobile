import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import { saveItemState, getItemState } from '../../utils/storage';
import CarouselComponent from '../Reusable/Carousel';

const { width, height } = Dimensions.get('window');

// Utility function to preload images
const preloadImages = (images) => {
  const imagesToPreload = images.map(image => ({ uri: image }));
  FastImage.preload(imagesToPreload);
};

// Custom ImageComponent with loading indicator
const ImageComponent = ({ source, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={style}>
      {isLoading && (
        <ActivityIndicator 
          size="large" 
          color="#8400ff" 
          style={StyleSheet.absoluteFill} 
        />
      )}
      <FastImage
        style={StyleSheet.absoluteFill}
        source={{ uri: source }}
        onLoadEnd={() => setIsLoading(false)}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

const ItemDetails = ({ item, closeModal, navigateToItem }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [isInBag, setIsInBag] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const panY = useRef(new Animated.Value(0)).current;

  const translateY = panY.interpolate({
    inputRange: [-1, 0, height],
    outputRange: [0, 0, height],
  });

  const images = JSON.parse(item.apiItem.images);

  useEffect(() => {
    loadItemState();
    preloadImages(images);
  }, []);

  const loadItemState = async () => {
    const { isInCart } = await getItemState(item);
    setIsInBag(isInCart);
  };

  const availableSizes = Object.entries(item.apiItem)
    .filter(([key, value]) => key.startsWith('size_') && value === 2)
    .map(([key]) => key.replace('size_', ''));

  const addToBag = async () => {
    if (!selectedSize) {
      Alert.alert(
        "Size Required",
        "Please select a size before adding to bag.",
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    if (!isInBag) {
      await saveItemState(item, false, true);
      setIsInBag(true);
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const renderImageItem = ({ item: imageUrl }) => (
    <ImageComponent source={imageUrl} style={styles.carouselImage} />
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const fetchSimilarItems = async (page) => {
    try {
      const response = await fetch('https://mock-apis-fex9.onrender.com/get_trending_items');
      const data = await response.json();
      // Simulate pagination by slicing the data
      const startIndex = page * 10;
      const endIndex = startIndex + 10;
      return data.slice(startIndex, endIndex).map(mapApiItemToCarouselItem);
    } catch (error) {
      console.error('Error fetching similar items:', error);
      return [];
    }
  };

  const mapApiItemToCarouselItem = (apiItem) => ({
    apiItem,
    id: apiItem.fynspo_id,
    image: apiItem.display_image,
    brand: apiItem.brand,
    name: apiItem.title,
    price: apiItem.price,
  });

  const handleSimilarItemPress = (newItem) => {
    closeModal();
    // Use setTimeout to ensure the current modal is closed before opening the new one
    setTimeout(() => navigateToItem(newItem), 300);
  };

  return (
    <Animated.View 
      style={[styles.modalContainer, { transform: [{ translateY }] }]}
    >
      <ScrollView style={styles.modalContent}>
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          <View style={styles.paginationDots}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.modalInfoContainer}>
          <Text style={styles.modalBrandText}>{item.brand}</Text>
          <Text style={styles.modalNameText}>{item.name}</Text>
          <Text style={styles.modalPriceText}>${item.price}</Text>
          
          <TouchableOpacity onPress={toggleDescription} style={styles.accordionHeader}>
            <Text style={styles.accordionHeaderText}>Description</Text>
            <Ionicons 
              name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#333"
            />
          </TouchableOpacity>
          {isDescriptionExpanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.modalDescriptionText}>{item.apiItem.description}</Text>
            </View>
          )}
          
          <Text style={styles.sizeTitle}>Available Sizes:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScrollView}>
            {availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.selectedSizeButtonText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.addToBagButton, isInBag && styles.addToBagButtonDisabled]} 
            onPress={addToBag}
            disabled={isInBag}
          >
            <Text style={styles.addToBagButtonText}>
              {isInBag ? 'In Bag' : 'Add to Bag'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.similarStylesContainer}>
            <Text style={styles.similarStylesTitle}>Similar Styles</Text>
            <CarouselComponent
              title=""
              fetchItems={fetchSimilarItems}
              initialItems={[]}
              onItemPress={handleSimilarItemPress}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  modalContent: {
    backgroundColor: '#fff',
    height: height,
  },
  carouselContainer: {
    height: height * 0.5,
  },
  carouselImage: {
    width: width,
    height: height * 0.5,
    resizeMode: 'cover',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  modalInfoContainer: {
    padding: 20,
  },
  modalBrandText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalNameText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  modalPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    paddingVertical: 10,
  },
  modalDescriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sizeScrollView: {
    marginVertical: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedSizeButton: {
    backgroundColor: '#8400ff',
    borderColor: '#8400ff',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeButtonText: {
    color: 'white',
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  addToBagButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addToBagButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToBagButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  similarStylesContainer: {
    marginTop: 30,
  },
  similarStylesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default ItemDetails;