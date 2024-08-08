import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemGrid from '../Reusable/ItemGrid';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const fetchCartItems = useCallback(async (page) => {
    try {
      const response = await fetch('YOUR_API_BASE_URL/get_cart_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_ids: cartItems,
          page: page,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }, [cartItems]);

  const handleRemoveFromCart = async (itemId) => {
    const updatedCartItems = cartItems.filter(id => id !== itemId);
    setCartItems(updatedCartItems);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error updating cart items:', error);
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Proceed to checkout');
  };

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
          <ItemGrid 
            fetchItems={fetchCartItems} 
            onRemoveItem={handleRemoveFromCart}
            isCartView={true}
          />
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
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
    backgroundColor: '#1a1a1a',
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
  checkoutButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    margin: 15,
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