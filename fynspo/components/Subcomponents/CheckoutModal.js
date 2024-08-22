import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Animated, Dimensions, Alert, FlatList } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { AddressSheet, AddressSheetError } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const { width } = Dimensions.get('window');

const CheckoutModal = ({ cartItems, isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);
  const [address, setAddress] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();


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
    initializePaymentSheet();
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
    if (isVisible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handlePanGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handlePanGestureEnd = (event) => {
    if (event.nativeEvent.translationX > width / 2) {
      handleClose();
    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  };

  const clampedTranslateX = translateX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });


  const handleAddressInput = () => {
    setAddressSheetVisible(true);
    console.log("Navigate to address input screen");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
        <FastImage 
            source={{ uri: item.image }}
            style={styles.itemImage}
            resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
    </View>
    );



  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <PanGestureHandler
        onGestureEvent={handlePanGesture}
        onEnded={handlePanGestureEnd}
      >
        <Animated.View style={[
          styles.modalContainer,
          {
            transform: [{ translateX: clampedTranslateX}]
          }
        ]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                <Icon name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.title}>Checkout</Text>
              <Text style={styles.subtitle}>Shipping Information</Text>
        
              <AddressSheet
                appearance={{
                    colors: {
                    primary: '#8400ff',
                    background: '#ffffff'
                    }
                }}
                visible={addressSheetVisible}
                onSubmit={async (addressDetails) => {
                    // Make sure to set `visible` back to false to dismiss the address element.
                    console.log(addressDetails);

                    setAddress(addressDetails);
                    setAddressSheetVisible(false);

                    // Handle result and update your UI
                }}
                onError={(error) => {
                    if (error.code === AddressSheetError.Failed) {
                    Alert.alert('There was an error.', 'Check the logs for details.');
                    console.log(error);
                    }
                // Make sure to set `visible` back to false to dismiss the address element.
                    setAddressSheetVisible(false);
                }}
                additionalFields={{
                    phoneNumber: 'required'
                }}
                />
              
                <TouchableOpacity 
                    style={styles.addressButton} 
                    onPress={handleAddressInput}
                >
                    <View style={styles.iconContainer}>
                    <Icon name="add" size={24} color="#fff" />
                    </View>
                    <Text style={styles.addressButtonText}>
                        Add Shipping Address
                    </Text>
                    <Icon name="arrow-forward" size={24} color="#fff" style={styles.rightIcon} />
                </TouchableOpacity>
                
                <Text style={styles.subtitle}>Order Summary</Text>
                <View style={styles.orderSummary}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.cartList}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total:</Text>
                        <Text style={styles.totalAmount}>${calculateTotal()}</Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Shipping:</Text>
                        <Text style={styles.totalAmount}>${calculateTotal()}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={openPaymentSheet}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  addressButton: {
  backgroundColor: '#8400ff',
  padding: 15,
  borderRadius: 5,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
addressButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
},
leftIcon: {
    marginRight: 10,
},
rightIcon: {
    marginLeft: 10,
},
iconContainer: {
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 20,
  width: 25,
  height: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
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
  checkoutButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutModal;