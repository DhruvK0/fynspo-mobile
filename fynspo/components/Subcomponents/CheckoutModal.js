import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Animated, Dimensions, Alert, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useStripe } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchPaymentSheetParams, getShippingInformation } from '../../utils/requests';
import ContactForm from './Checkout/ContactForm';
import ShippingForm from './Checkout/ShippingForm';
import OrderSummary from './Checkout/OrderSummary';
import ShippingCosts from './Checkout/ShippingCosts';

const { width } = Dimensions.get('window');

const CheckoutModal = ({ cartItems, isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState('');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [costPerBrand, setCostPerBrand] = useState({});
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [shippingInfo, setShippingInfo] = useState([]);

  useEffect(() => {
    if (isVisible) {
      animateModal(0);
    }
    initializePaymentSheet();
  }, [isVisible]);

  useEffect(() => {
    if (address) {
      calculateCostPerBrand();
    }
  }, [address, cartItems]);

  useEffect(() => {
    if (shippingInfo.length > 0 && Object.keys(costPerBrand).length > 0) {
      calculateTotalShippingCost();
    }
  }, [shippingInfo, costPerBrand]);

  const resetStates = () => {
    setAddress(null);
    setEmail('');
    setCostPerBrand({});
    setShippingInfo([]);
    setTotalShippingCost(0);
  };

  const calculateCostPerBrand = async () => {
    const brandCosts = {};
    cartItems.forEach(item => {
      brandCosts[item.brand] = (brandCosts[item.brand] || 0) + item.price * item.quantity;
    });
    setCostPerBrand(brandCosts);

    const brands = Object.keys(brandCosts);
    const shippingData = await getShippingInformation(brands);
    setShippingInfo(shippingData);
  };

  const calculateTotalShippingCost = () => {
    const total = shippingInfo.reduce((acc, brandInfo) => {
      const brandTotal = costPerBrand[brandInfo.brand] || 0;
      const shippingFee = (brandInfo.threshold_avail && brandTotal >= brandInfo.threshold) ? 0 : brandInfo.fee;
      return acc + shippingFee;
    }, 0);
    setTotalShippingCost(total);
  };

  const handleClose = () => {
    resetStates();
    onClose();
  };

  const animateModal = (toValue) => {
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === width) handleClose();
    });
  };

  const handlePanGestureEnd = (event) => {
    if (event.nativeEvent.translationX > width / 2) {
      animateModal(width);
    } else {
      animateModal(0);
    }
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: 'Jane Doe' },
      returnURL: 'fynspo://payment-complete',
      applePay: { merchantCountryCode: 'US' },
      googlePay: { merchantCountryCode: 'US', currencyCode: 'usd', testEnv: true }
    });
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  const isCheckoutReady = () => address && email.trim() !== '';

  const calculateSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal() + totalShippingCost;

  return (
    <Modal visible={isVisible} animationType="none" transparent={true} onRequestClose={() => animateModal(width)}>
      <PanGestureHandler onGestureEvent={Animated.event([{ nativeEvent: { translationX: translateX } }], { useNativeDriver: true })} onEnded={handlePanGestureEnd}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateX: translateX.interpolate({ inputRange: [0, width], outputRange: [0, width], extrapolate: 'clamp' }) }] }]}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.content}>
                <TouchableOpacity onPress={() => animateModal(width)} style={styles.backButton}>
                  <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                
                <ContactForm email={email} setEmail={setEmail} />
                <ShippingForm address={address} setAddress={setAddress} />
                <ShippingCosts shippingInfo={shippingInfo} costPerBrand={costPerBrand} />
                <OrderSummary 
                  cartItems={cartItems} 
                  subtotal={calculateSubtotal()} 
                  shippingCost={totalShippingCost} 
                  total={calculateTotal()} 
                  address={address} 
                />
              </View>
            </ScrollView>
            <View style={styles.checkoutButtonContainer}>
              <TouchableOpacity 
                style={[styles.checkoutButton, !isCheckoutReady() && styles.disabledButton]} 
                onPress={openPaymentSheet}
                disabled={!isCheckoutReady()}
              >
                <Text style={styles.checkoutButtonText}>
                  {isCheckoutReady() ? "Proceed to Checkout" : "Please fill all fields"}
                </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Add extra padding at the bottom for the fixed checkout button
  },
  backButton: {
    marginBottom: 20,
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 20,
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
  disabledButton: {
    backgroundColor: '#4a4a4a',
  },
});

export default CheckoutModal;