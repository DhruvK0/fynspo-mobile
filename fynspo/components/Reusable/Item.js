import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Animated
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { saveItemState, getItemState, subscribeToChanges } from '../../utils/storage';
import { userInteraction } from '../../utils/requests';
import ItemDetails from './ItemDetails';
import { useUser } from '@clerk/clerk-expo';

const { height, width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 30;
const ITEM_HEIGHT = ITEM_WIDTH * 2; // Adjust this multiplier as needed

// Utility function to preload images
const preloadImages = (images) => {
  const imagesToPreload = images.map(image => ({ uri: image }));
  FastImage.preload(imagesToPreload);
};

// Custom ImageComponent with loading indicator
const ImageComponent = ({ source, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    preloadImages([source]);
  }, [source]);

  return (
    <View style={style}>
      {isLoading && (
        <ActivityIndicator 
          size="small" 
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

const ItemComponent = ({ item, previousCloseModal}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInBag, setIsInBag] = useState(false);
  const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const { user } = useUser();
  const modalOpenTimeRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    loadItemState();
    const unsubscribe = subscribeToChanges((data) => {
      setIsFavorite(data.favorites.includes(item.id));
      setIsInBag(data.cart.includes(item.id));
    });

    return () => {
      unsubscribe();
    };
  }, [item.id]);

  const loadItemState = async () => {
    const { isFavorite: storedFavorite, isInCart: storedInCart } = await getItemState(item);
    setIsFavorite(storedFavorite);
    setIsInBag(storedInCart);
  };


  const openModal = async () => {
    if (previousCloseModal) {
      previousCloseModal();
    }

    setIsModalVisible(true);
    modalOpenTimeRef.current = Date.now();
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  // const closeModal = async () => {
  //   setIsModalVisible(false);
  //   const duration = (Date.now() - modalOpenTimeRef.current) / 1000; // Convert to seconds
  //   try {
  //     await userInteraction(user.id, item.id, 'view', duration);
  //   } catch (error) {
  //     console.error('Error logging user interaction:', error);
  //   }
  // }

  const closeModal = async () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
    });

    const duration = (Date.now() - modalOpenTimeRef.current) / 1000;
    try {
      await userInteraction(user.id, item.id, 'view', duration);
    } catch (error) {
      console.error('Error logging user interaction:', error);
    }
  }

  
  const toggleModal = async () => {
    if (!isModalVisible) {
      // Modal is being opened
      modalOpenTimeRef.current = Date.now();
    } else {
      // Modal is being closed
      const duration = (Date.now() - modalOpenTimeRef.current) / 1000; // Convert to seconds
      try {
        await userInteraction(user.id, item.id, 'view', duration);
      } catch (error) {
        console.error('Error logging user interaction:', error);
      }
    }
    setIsModalVisible(!isModalVisible);
  };

  const toggleFavorite = async (event) => {
    event.stopPropagation();
    const newFavoriteState = !isFavorite;
    await saveItemState(item, newFavoriteState, isInBag);
    if (newFavoriteState) {
      await userInteraction(user.id, item.id, 'like', 0);
    }
  };

  const toggleSizeModal = async (event) => {
    event.stopPropagation();
    if (isInBag) {
      const newBagState = !isInBag;
      await saveItemState(item, isFavorite, newBagState);
    } else {
    setIsSizeModalVisible(true);
    }
  };

  //pass the selected size to the selectSize function
  const selectSize = async (event, size) => {
    event.stopPropagation();
    const newBagState = !isInBag;
    await saveItemState({...item, quantity: 1, selected_size: size}, isFavorite, newBagState);
    setIsSizeModalVisible(false);
  };

  const availableSizes = Object.entries(item.apiItem)
    .filter(([key, value]) => key.startsWith('size_') && value === "2")
    .map(([key]) => key.replace('size_', ''));

  return (
    <TouchableOpacity onPress={openModal} style={[styles.itemContainer, item.style]}>
      <View style={styles.imageContainer}>
        <ImageComponent source={item.image} style={styles.image} />
        <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
         <FontAwesome 
            name={isFavorite ? "heart" : "heart-o" }
            size={24} 
            color={isFavorite ? "#8400ff" : "white"} 
        />
        </TouchableOpacity>
        <Modal animationType="slide" transparent={true} visible={isSizeModalVisible} onRequestClose={() => setIsSizeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Size</Text>
            {availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={styles.sizeOption}
                onPress={(event) => selectSize(event, size)}
                // disabled={quantity === 0}
              >
                <Text style={[styles.sizeOptionText]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsSizeModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.brandText} numberOfLines={1}>{item.brand}</Text>
          <Text style={styles.nameText} numberOfLines={3}>{item.name}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${item.price}</Text>
          <TouchableOpacity style={styles.cartButton} onPress={toggleSizeModal}>
            <Ionicons 
              name={isInBag ? "bag-check" : "bag-add-outline"} 
              size={24} 
              color={isInBag ? "#8400ff" : "black"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ItemDetails item={item} closeModal={closeModal} />
        </Animated.View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: ITEM_WIDTH * 1.2,
  },
  heartButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 14,
    color: '#666',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    // padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sizeOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sizeOptionText: {
    fontSize: 16,
    color: '#000',
  },
  disabledText: {
    color: '#999',
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});

export default ItemComponent;