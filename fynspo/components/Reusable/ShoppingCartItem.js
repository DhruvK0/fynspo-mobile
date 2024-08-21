import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveItemState, getItemState } from '../../utils/storage';
import ItemComponent from './Item';

const ShoppingCartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const availableSizes = Object.entries(item.apiItem)
    .filter(([key, value]) => key.startsWith('size_') && value === 2)
    .map(([key]) => key.replace('size_', ''));
  
  const handlesizeUpdate = async (item, itemId, updated_size) => {
    //update the selected_size value with the updated_size in the item 
    const { isFavorite, isInCart } = await getItemState(item);
    item.selected_size = updated_size;
    await saveItemState(item, isFavorite, isInCart);
    setModalVisible(false);
  }
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
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.sizeButton}>
            <Text style={styles.sizeButtonText}>Size: {item.selected_size}</Text>
          </TouchableOpacity>
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
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Size</Text>
            {availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={styles.sizeOption}
                onPress={() => { handlesizeUpdate(item, item.id, size) }}
                // disabled={quantity === 0}
              >
                <Text style={[styles.sizeOptionText]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
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
    color: '#666',
  },
  size: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  sizeButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  sizeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    paddingVertical: 1.5
  },
  removeButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sizeOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sizeOptionText: {
    fontSize: 16,
    color: '#000',
  },
  disabledText: {
    color: '#999',
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ShoppingCartItem;