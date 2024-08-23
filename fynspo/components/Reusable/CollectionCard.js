import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = 50;
const TOP_TAB_HEIGHT = 50;

const CollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.collectionCard} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  collectionCard: {
    width: width - 20,
    height: (height - TOP_TAB_HEIGHT - BOTTOM_NAV_HEIGHT) / 4,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CollectionCard;