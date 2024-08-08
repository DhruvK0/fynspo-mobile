import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAllItemStates, subscribeToChanges } from '../../utils/storage';

const SavedPage = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const loadSavedItems = async () => {
      const { favorites } = await getAllItemStates();
      setSavedItems(favorites);
    };

    loadSavedItems();

    const unsubscribe = subscribeToChanges(({ favorites }) => {
      setSavedItems(favorites);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Item ID: {item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Items</Text>
      <FlatList
        data={savedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={<Text style={styles.emptyText}>No saved items</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default SavedPage;