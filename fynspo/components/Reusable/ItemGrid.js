// ItemGrid.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ItemComponent from './Item'; // Assuming you have this component

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15; // Subtracting padding

const ItemGrid = ({ fetchItems }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const renderItem = ({ item }) => (
    <ItemComponent
      {...item}
      style={{ width: COLUMN_WIDTH, marginBottom: 10 }}
    />
  );

  const handleEndReached = () => {
    loadItems();
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.25}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ItemGrid;