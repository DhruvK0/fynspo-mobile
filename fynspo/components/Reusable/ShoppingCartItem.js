import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShoppingCartItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.infoContainer}>
          <View style={styles.brandPriceContainer}>
            <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => onUpdateQuantity(item.id, -1)} style={styles.quantityButton}>
              <Ionicons name="remove" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity || 1}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 1)} style={styles.quantityButton}>
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    height: 100,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  brandPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#bbb',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
  },
  quantityButton: {
    padding: 5,
    color: '#000',
  },
  quantity: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  removeButton: {
    // padding: 5,
  },
});

export default ShoppingCartItem;