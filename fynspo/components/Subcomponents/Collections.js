// CollectionsView.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.collectionCard} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const CollectionsView = () => {
  const collections = [
    'For You',
    'On Sale',
    'Shop By Brand',
    'Shop By Occasion',
    'Shop By Trend'
  ];

  const handleCardPress = (title) => {
    console.log(`Pressed ${title} card`);
    // Add your navigation or other logic here
  };

  return (
    <ScrollView style={styles.container}>
      {collections.map((collection, index) => (
        <CollectionCard 
          key={index} 
          title={collection} 
          onPress={() => handleCardPress(collection)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  collectionCard: {
    width: width - 20,
    height: height / 4,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CollectionsView;