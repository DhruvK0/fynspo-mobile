import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAllItemStates, subscribeToChanges } from '../../utils/storage';
import SavedItemGrid from '../Reusable/SavedItemGrid';

const SavedPage = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    loadSavedItems();

    const unsubscribe = subscribeToChanges((data) => {
      if (data.favoritesObject) {
        const updatedItems = Object.values(data.favoritesObject);
        setSavedItems(updatedItems);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadSavedItems = async () => {
    const { favoritesObject } = await getAllItemStates();
    const savedItemsArray = Object.values(favoritesObject);
    setSavedItems(savedItemsArray);
  };

  return (
    <View style={styles.container}>
      <SavedItemGrid items={savedItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,   
  },
});

export default SavedPage;