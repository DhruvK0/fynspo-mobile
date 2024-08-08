// utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';
const CART_KEY = '@cart';

export const saveItemState = async (itemId, isFavorite, isInCart) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);

    let favoritesArray = favorites ? JSON.parse(favorites) : [];
    let cartArray = cart ? JSON.parse(cart) : [];

    if (isFavorite) {
      if (!favoritesArray.includes(itemId)) {
        favoritesArray.push(itemId);
      }
    } else {
      favoritesArray = favoritesArray.filter(id => id !== itemId);
    }

    if (isInCart) {
      if (!cartArray.includes(itemId)) {
        cartArray.push(itemId);
      }
    } else {
      cartArray = cartArray.filter(id => id !== itemId);
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartArray));
  } catch (error) {
    console.error('Error saving item state:', error);
  }
};

export const getItemState = async (itemId) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);

    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    const cartArray = cart ? JSON.parse(cart) : [];

    return {
      isFavorite: favoritesArray.includes(itemId),
      isInCart: cartArray.includes(itemId),
    };
  } catch (error) {
    console.error('Error getting item state:', error);
    return { isFavorite: false, isInCart: false };
  }
};