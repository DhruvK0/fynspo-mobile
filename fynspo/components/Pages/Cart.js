import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { getAllItemStates, saveItemState, subscribeToChanges } from '../../utils/storage';
import ShoppingCartItem from '../Reusable/ShoppingCartItem';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItems();

    // Subscribe to changes in the cart
    const unsubscribe = subscribeToChanges(({ cartObject }) => {
      setCartItems(Object.values(cartObject));
    });

    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  const loadCartItems = async () => {
    const { cartObject } = await getAllItemStates();
    setCartItems(Object.values(cartObject));
  };

  const handleRemoveFromCart = async (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      await saveItemState(item, true, false);
      // No need to call loadCartItems() here as the subscription will update the state
    }
  };

  const handleUpdateQuantity = async (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = (item.quantity || 1) + change;
      if (newQuantity > 0) {
        await saveItemState({ ...item, quantity: newQuantity }, true, true);
      } else {
        await saveItemState(item, false, false);
      }
      // No need to update state here as the subscription will handle it
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Proceed to checkout');
  };

  const renderItem = ({ item }) => (
    <ShoppingCartItem
      item={item}
      onRemove={handleRemoveFromCart}
      onUpdateQuantity={handleUpdateQuantity}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
      </View>
      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#fff',
  },
  totalContainer: {
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShoppingCartPage;