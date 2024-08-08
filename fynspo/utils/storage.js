// utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';
const CART_KEY = '@cart';
const CATEGORIES_KEY = '@categories';

let listeners = [];

export const saveItemState = async (itemId, isFavorite, isInCart, category) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);

    let favoritesArray = favorites ? JSON.parse(favorites) : [];
    let cartArray = cart ? JSON.parse(cart) : [];
    let categoriesObject = categories ? JSON.parse(categories) : {};

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

    categoriesObject[itemId] = category;

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartArray));
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categoriesObject));

    notifyListeners({ favorites: favoritesArray, cart: cartArray, categories: categoriesObject });
  } catch (error) {
    console.error('Error saving item state:', error);
  }
};

export const getItemState = async (itemId) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);

    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    const cartArray = cart ? JSON.parse(cart) : [];
    const categoriesObject = categories ? JSON.parse(categories) : {};

    return {
      isFavorite: favoritesArray.includes(itemId),
      isInCart: cartArray.includes(itemId),
      category: categoriesObject[itemId] || null,
    };
  } catch (error) {
    console.error('Error getting item state:', error);
    return { isFavorite: false, isInCart: false, category: null };
  }
};

export const getAllItemStates = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);

    return {
      favorites: favorites ? JSON.parse(favorites) : [],
      cart: cart ? JSON.parse(cart) : [],
      categories: categories ? JSON.parse(categories) : {},
    };
  } catch (error) {
    console.error('Error getting all item states:', error);
    return { favorites: [], cart: [], categories: {} };
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([FAVORITES_KEY, CART_KEY, CATEGORIES_KEY]);
    notifyListeners({ favorites: [], cart: [], categories: {} });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

export const subscribeToChanges = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

const notifyListeners = (data) => {
  listeners.forEach(listener => listener(data));
};