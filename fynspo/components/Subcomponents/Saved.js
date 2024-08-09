import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAllItemStates, saveItemState } from '../../utils/storage';
import ItemGrid from '../Reusable/ItemGrid';

const SavedPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const fetchSavedItems = useCallback(async (page) => {
    const { favoritesObject } = await getAllItemStates();
    const savedItemsArray = Object.values(favoritesObject);
    console.log(savedItemsArray);
    // Simulating pagination for saved items
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return savedItemsArray.slice(startIndex, endIndex);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Items</Text>
      <ItemGrid
        fetchItems={fetchSavedItems}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // margin: 20,   
  },
});

export default SavedPage;