import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { getAllItemStates, saveItemState, subscribeToChanges } from '../../utils/storage';
import ShoppingCartItem from '../Reusable/ShoppingCartItem';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch('https://backend-server-8doz.onrender.com/payment-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
      returnURL: 'fynspo://payment-complete',
      applePay: {
        merchantCountryCode: 'US',
      },
      googlePay: {
        merchantCountryCode: 'US',
        currencyCode: 'usd',
        testEnv: true,
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

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
        await saveItemState(item, true, false);
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
    <StripeProvider
    publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    merchantIdentifier={'merchant.com.fynspo'}>
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
            <TouchableOpacity style={styles.checkoutButton} onPress={openPaymentSheet}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
    </StripeProvider>
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