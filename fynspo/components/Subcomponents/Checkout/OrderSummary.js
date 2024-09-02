// OrderSummary.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const OrderSummary = ({ cartItems, subtotal, shippingCost, taxAmount, total, address }) => {
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <FastImage source={{ uri: item.image }} style={styles.itemImage} resizeMode={FastImage.resizeMode.cover} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Order Summary</Text>
      <View style={styles.orderSummary}>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.cartList}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Subtotal:</Text>
          <Text style={styles.totalAmount}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Shipping:</Text>
          <Text style={styles.totalAmount}>
            {address ? `$${shippingCost.toFixed(2)}` : "Enter Shipping Address"}
          </Text>
        </View>
        {address && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Estimated Tax:</Text>
            <Text style={styles.totalAmount}>${taxAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, styles.finalTotal]}>Total:</Text>
          <Text style={[styles.totalAmount, styles.finalTotal]}>
            {address ? `$${total.toFixed(2)}` : "Enter Shipping Address"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  orderSummary: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#ccc',
    fontSize: 14,
  },
  itemQuantity: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  totalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OrderSummary;