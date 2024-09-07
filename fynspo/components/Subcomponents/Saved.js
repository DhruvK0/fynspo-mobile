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

    //have text for no saved items
    savedItems.length ? <View style={styles.container}>
      <SavedItemGrid items={savedItems} />
    </View> :
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>No Saved Items</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20,
    color: '#fff',   
  },
});

export default SavedPage;