import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { saveItemState, getItemState, subscribeToChanges } from '../../utils/storage';
import ItemDetails from './ItemDetails';

const { width } = Dimensions.get('window');
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

const ItemComponent = ({ item }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInBag, setIsInBag] = useState(false);

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleFavorite = async (event) => {
    event.stopPropagation();
    const newFavoriteState = !isFavorite;
    await saveItemState(item, newFavoriteState, isInBag);
  };

  const toggleBag = async (event) => {
    event.stopPropagation();
    const newBagState = !isInBag;
    await saveItemState(item, isFavorite, newBagState);
  };

  return (
    <TouchableOpacity onPress={toggleModal} style={[styles.itemContainer, item.style]}>
      <View style={styles.imageContainer}>
        <ImageComponent source={item.image} style={styles.image} />
        <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
         <FontAwesome 
            name={isFavorite ? "heart" : "heart-o" }
            size={24} 
            color={isFavorite ? "#8400ff" : "white"} 
        />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.brandText} numberOfLines={1}>{item.brand}</Text>
          <Text style={styles.nameText} numberOfLines={3}>{item.name}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${item.price}</Text>
          <TouchableOpacity style={styles.cartButton} onPress={toggleBag}>
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
        onRequestClose={toggleModal}
      >
        <ItemDetails item={item} closeModal={toggleModal} />
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
});

export default ItemComponent;