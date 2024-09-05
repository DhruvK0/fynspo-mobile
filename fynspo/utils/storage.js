// utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';
const CART_KEY = '@cart';
const CATEGORIES_KEY = '@categories';
const FAVORITES_OBJECT_KEY = '@favorites_object';
const CART_OBJECT_KEY = '@cart_object';
const FILTERS_KEY = '@filters';

let listeners = [];
let filterListeners = [];

export const saveItemState = async (item, isFavorite, isInCart) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    const favoritesObject = await AsyncStorage.getItem(FAVORITES_OBJECT_KEY);
    const cartObject = await AsyncStorage.getItem(CART_OBJECT_KEY);

    let favoritesArray = favorites ? JSON.parse(favorites) : [];
    let cartArray = cart ? JSON.parse(cart) : [];
    let favoritesObjects = favoritesObject ? JSON.parse(favoritesObject) : {};
    let cartObjects = cartObject ? JSON.parse(cartObject) : {};
    let categoriesObject = categories ? JSON.parse(categories) : {};

    if (isFavorite) {
      if (!favoritesArray.includes(item.id)) {
        favoritesArray.push(item.id);
        favoritesObjects[item.id] = item;
      }
    } else {
      favoritesArray = favoritesArray.filter(id => id !== item.id);
      delete favoritesObjects[item.id];
    }

    if (isInCart) {
      if (!cartArray.includes(item)) {
        cartArray.push(item.id);
        cartObjects[item.id] = item;
      }
    } else {
      cartArray = cartArray.filter(id => id !== item.id);
      delete cartObjects[item.id];
    }

    categoriesObject[item.id] = item.category;

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartArray));
    await AsyncStorage.setItem(FAVORITES_OBJECT_KEY, JSON.stringify(favoritesObjects));
    await AsyncStorage.setItem(CART_OBJECT_KEY, JSON.stringify(cartObjects));
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categoriesObject));

    notifyListeners({ favorites: favoritesArray, cart: cartArray, categories: categoriesObject, favoritesObject: favoritesObjects, cartObject: cartObjects });
  } catch (error) {
    console.error('Error saving item state:', error);
  }
};

export const getItemState = async (item) => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const cart = await AsyncStorage.getItem(CART_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    const favoritesObject = await AsyncStorage.getItem(FAVORITES_OBJECT_KEY);
    const cartObject = await AsyncStorage.getItem(CART_OBJECT_KEY);

    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    const cartArray = cart ? JSON.parse(cart) : [];
    const categoriesObject = categories ? JSON.parse(categories) : {};
    const favoritesObjects = favoritesObject ? JSON.parse(favoritesObject) : {};
    const cartObjects = cartObject ? JSON.parse(cartObject) : {};

    return {
      isFavorite: favoritesArray.includes(item.id),
      isInCart: cartArray.includes(item.id),
      category: categoriesObject[item.id] || null,
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
    const favoritesObject = await AsyncStorage.getItem(FAVORITES_OBJECT_KEY);
    const cartObject = await AsyncStorage.getItem(CART_OBJECT_KEY);

    return {
      favorites: favorites ? JSON.parse(favorites) : [],
      cart: cart ? JSON.parse(cart) : [],
      categories: categories ? JSON.parse(categories) : {},
      // return a list of values from the favoritesObject
      favoritesObject: favoritesObject ? JSON.parse(favoritesObject) : {},
      cartObject: cartObject ? JSON.parse(cartObject) : {},

    };
  } catch (error) {
    console.error('Error getting all item states:', error);
    return { favorites: [], cart: [], categories: {} };
  }
};

export const saveFilterState = async (filters) => {
  try {
    await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    notifyFilterListeners(filters);
  } catch (error) {
    console.error('Error saving filter state:', error);
  }
};

export const getFilterState = async () => {
  try {
    const filters = await AsyncStorage.getItem(FILTERS_KEY);
    return filters ? JSON.parse(filters) : { sort: '', filters: {} };
  } catch (error) {
    console.error('Error getting filter state:', error);
    return { sort: '', filters: {} };
  }
};

export const clearCart = async () => {
  try {
    // Remove cart-related data from AsyncStorage
    await AsyncStorage.multiRemove([CART_KEY, CART_OBJECT_KEY]);

    // Get current state of other data
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    const favoritesObject = await AsyncStorage.getItem(FAVORITES_OBJECT_KEY);

    // Prepare updated state
    const updatedState = {
      favorites: favorites ? JSON.parse(favorites) : [],
      cart: [],
      categories: categories ? JSON.parse(categories) : {},
      favoritesObject: favoritesObject ? JSON.parse(favoritesObject) : {},
      cartObject: {}
    };

    // Notify listeners of the change
    notifyListeners(updatedState);

    console.log('Cart cleared successfully');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([FAVORITES_KEY, CART_KEY, CATEGORIES_KEY, FAVORITES_OBJECT_KEY, CART_OBJECT_KEY, FILTERS_KEY]);
    notifyListeners({ favorites: [], cart: [], categories: {}, favoritesObject: {}, cartObject: {} });
    notifyFilterListeners({});
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

export const subscribeToFilterChanges = (callback) => {
  filterListeners.push(callback);
  return () => {
    filterListeners = filterListeners.filter(listener => listener !== callback);
  };
};

const notifyListeners = (data) => {
  listeners.forEach(listener => listener(data));
};

const notifyFilterListeners = (filters) => {
  filterListeners.forEach(listener => listener(filters));
};