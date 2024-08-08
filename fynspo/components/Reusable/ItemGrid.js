import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import ItemComponent from './Item';

const { width, height } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15;

const ItemGrid = ({ fetchItems, onRemoveItem, isCartView = false }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    if (loading && page !== 1) return;
    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      const itemsWithKeys = newItems.map(item => ({
        ...item,
        uniqueKey: item.id ? `${item.id}-${Math.random().toString(36).substr(2, 9)}` : Math.random().toString(36).substr(2, 9)
      }));
      setItems((prevItems) => [...prevItems, ...itemsWithKeys]);
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

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      loadItems();
    }
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
    setItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8400ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={400}
    >
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.uniqueKey} style={styles.itemContainer}>
            <ItemComponent
              {...item}
              style={{ width: COLUMN_WIDTH, marginBottom: 10 }}
            />
            {isCartView && (
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {loading && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#8400ff" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 1.5,
  },
  loadingMore: {
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 20,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemGrid;