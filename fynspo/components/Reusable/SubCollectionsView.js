import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubCollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.subCollectionCard} onPress={onPress}>
    <Text style={styles.subCardTitle}>{title}</Text>
  </TouchableOpacity>
);

const SubCollectionsView = ({ title, subCollections, onItemPress, onBack }) => {
  return (
    <View style={styles.subContent}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={subCollections}
        renderItem={({ item }) => (
          <SubCollectionCard
            title={item}
            onPress={() => onItemPress(item)}
          />
        )}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  gridContainer: {
    paddingTop: 10,
  },
  subCollectionCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default SubCollectionsView;