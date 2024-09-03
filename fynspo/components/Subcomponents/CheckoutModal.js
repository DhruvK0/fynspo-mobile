// import React, { useEffect, useInsertionEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Animated, Dimensions, Alert, ScrollView } from 'react-native';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import { useStripe } from '@stripe/stripe-react-native';
// import { fetchPaymentSheetParams, getShippingInformation, calculateTaxAmount } from '../../utils/requests';
// import { clearCart } from '../../utils/storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import ContactForm from './Checkout/ContactForm';
// import ShippingForm from './Checkout/ShippingForm';
// import OrderSummary from './Checkout/OrderSummary';
// import ShippingCosts from './Checkout/ShippingCosts';

// const { width } = Dimensions.get('window');

// const CheckoutModal = ({ cartItems, isVisible, onClose }) => {
//   const translateX = useRef(new Animated.Value(width)).current;
//   const [address, setAddress] = useState(null);
//   const [email, setEmail] = useState('');
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const [costPerBrand, setCostPerBrand] = useState({});
//   const [totalShippingCost, setTotalShippingCost] = useState(0);
//   const [shippingInfo, setShippingInfo] = useState([]);
//   const [taxAmount, setTaxAmount] = useState(0);
//   const [ isDoneCalculating, setIsDoneCalculating ] = useState(false);

//   useEffect(() => {
//     if (isVisible) {
//       animateModal(0);
//     }
//     // initializePaymentSheet();
//   }, [isVisible]);

//   useEffect(() => {
//     if (address) {
//       const calculateRemaining = async () => {
//         await calculateCostPerBrand();
//         await calculateTax();
//         setIsDoneCalculating(true);
//       }
//       calculateRemaining();
//     }
//   }, [address, cartItems]);

//   useEffect(() => {
//     if (isDoneCalculating) {
//       const total = calculateTotal();
//       initializePaymentSheet(total);
//     }
//   }, [isDoneCalculating]);


//   useEffect(() => {
//     if (shippingInfo.length > 0 && Object.keys(costPerBrand).length > 0) {
//       calculateTotalShippingCost();
//     }
//   }, [shippingInfo, costPerBrand]);

//   const resetStates = () => {
//     setAddress(null);
//     setEmail('');
//     setCostPerBrand({});
//     setShippingInfo([]);
//     setTotalShippingCost(0);
//     setTaxAmount(0);
//   };

//   const calculateCostPerBrand = async () => {
//     const brandCosts = {};
//     cartItems.forEach(item => {
//       brandCosts[item.brand] = (brandCosts[item.brand] || 0) + item.price * item.quantity;
//     });
//     setCostPerBrand(brandCosts);

//     const brands = Object.keys(brandCosts);
//     const shippingData = await getShippingInformation(brands);
//     setShippingInfo(shippingData);
//   };

//   const calculateTotalShippingCost = () => {
//     const total = shippingInfo.reduce((acc, brandInfo) => {
//       const brandTotal = costPerBrand[brandInfo.brand] || 0;
//       const shippingFee = (brandInfo.threshold_avail && brandTotal >= brandInfo.threshold) ? 0 : brandInfo.fee;
//       return acc + shippingFee;
//     }, 0);
//     setTotalShippingCost(total);
//   };

//   const calculateTax = async () => {
//     // This is a dummy function to simulate tax calculation
//     // In a real scenario, you would make an API call to Stripe here

//     const line_items = cartItems.map(item => ({
//       amount: Math.round(item.price * 100), // Stripe expects amounts in cents
//       reference: item.id.toString(),
//     }));
    
//     const customer_details = {
//       address: {
//         "line1": address.address.line1,
//         "city": address.address.city,
//         "state": address.address.state,
//         "postal_code": address.address.postalCode,
//         "country": address.address.country,
//       },
//       address_source: "shipping"
//     };
    
//     const tax = await calculateTaxAmount(customer_details, line_items);
 
//     setTaxAmount(tax.tax_calculation.tax_amount_exclusive);
//   };

//   const handleClose = () => {
//     resetStates();
//     onClose();
//   };

//   const animateModal = (toValue) => {
//     Animated.timing(translateX, {
//       toValue,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       if (toValue === width) handleClose();
//     });
//   };

//   const handlePanGestureEnd = (event) => {
//     if (event.nativeEvent.translationX > width / 2) {
//       animateModal(width);
//     } else {
//       animateModal(0);
//     }
//   };

//   const initializePaymentSheet = async (total) => {
//     const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams(Math.round(total*100));
//     const { error } = await initPaymentSheet({
//       merchantDisplayName: "fynspo",
//       customerId: customer,
//       customerEphemeralKeySecret: ephemeralKey,
//       paymentIntentClientSecret: paymentIntent,
//       allowsDelayedPaymentMethods: true,
//       defaultBillingDetails: { name: address.name },
//       returnURL: 'fynspo://payment-complete',
//       applePay: { merchantCountryCode: 'US' },
//       googlePay: { merchantCountryCode: 'US', currencyCode: 'usd', testEnv: true }
//     });
//     if (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const openPaymentSheet = async () => {
//     const { error } = await presentPaymentSheet();
//     if (error) {
//       Alert.alert(`Error: ${error.code}`, error.message);
//     } else {
//       Alert.alert('Success', 'Your order is confirmed!');
//       clearCart(); // clear the cart after successful payment

//       animateModal(width)
//     }
//   };

//   const isCheckoutReady = () => address && email.trim() !== '';

//   const calculateSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   const calculateTotal = () => calculateSubtotal() + totalShippingCost + taxAmount;

//   return (
//     <Modal visible={isVisible} animationType="none" transparent={true} onRequestClose={() => animateModal(width)}>
//       <PanGestureHandler onGestureEvent={Animated.event([{ nativeEvent: { translationX: translateX } }], { useNativeDriver: true })} onEnded={handlePanGestureEnd}>
//         <Animated.View style={[styles.modalContainer, { transform: [{ translateX: translateX.interpolate({ inputRange: [0, width], outputRange: [0, width], extrapolate: 'clamp' }) }] }]}>
//           <SafeAreaView style={styles.safeArea}>
//             <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
//               <View style={styles.content}>
//                 <TouchableOpacity onPress={() => animateModal(width)} style={styles.backButton}>
//                   <Icon name="arrow-back" size={28} color="#fff" />
//                 </TouchableOpacity>
                
//                 <ContactForm email={email} setEmail={setEmail} />
//                 <ShippingForm address={address} setAddress={setAddress} />
//                 <ShippingCosts shippingInfo={shippingInfo} costPerBrand={costPerBrand} />
//                 <OrderSummary 
//                   cartItems={cartItems} 
//                   subtotal={calculateSubtotal()} 
//                   shippingCost={totalShippingCost}
//                   taxAmount={taxAmount}
//                   total={calculateTotal()} 
//                   address={address} 
//                 />
//               </View>
//             </ScrollView>
//             <View style={styles.checkoutButtonContainer}>
//               <TouchableOpacity 
//                 style={[styles.checkoutButton, !isCheckoutReady() && styles.disabledButton]} 
//                 onPress={openPaymentSheet}
//                 disabled={!isCheckoutReady()}
//               >
//                 <Text style={styles.checkoutButtonText}>
//                   {isCheckoutReady() ? isDoneCalculating ? "Proceed to Checkout" : "Calculating..." : "Please fill all fields"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </SafeAreaView>
//         </Animated.View>
//       </PanGestureHandler>
//     </Modal>
//   );
// };
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Animated, Dimensions, Alert, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentSheetParams, getShippingInformation, calculateTaxAmount } from '../../utils/requests';
import { clearCart } from '../../utils/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const [taxAmount, setTaxAmount] = useState(0);
  const [isDoneCalculating, setIsDoneCalculating] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  useEffect(() => {
    if (isVisible) {
      animateModal(0);
      setIsCheckoutComplete(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (address && !isCheckoutComplete) {
      const calculateRemaining = async () => {
        await calculateCostPerBrand();
        await calculateTax();
        setIsDoneCalculating(true);
      }
      calculateRemaining();
    }
  }, [address, cartItems, isCheckoutComplete]);

  useEffect(() => {
    if (isDoneCalculating && !isCheckoutComplete) {
      const total = calculateTotal();
      initializePaymentSheet(total);
    }
  }, [isDoneCalculating, isCheckoutComplete]);

  useEffect(() => {
    if (shippingInfo.length > 0 && Object.keys(costPerBrand).length > 0 && !isCheckoutComplete) {
      calculateTotalShippingCost();
    }
  }, [shippingInfo, costPerBrand, isCheckoutComplete]);

  const resetStates = () => {
    setAddress(null);
    setEmail('');
    setCostPerBrand({});
    setShippingInfo([]);
    setTotalShippingCost(0);
    setTaxAmount(0);
    setIsDoneCalculating(false);
    setIsCheckoutComplete(false);
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

  const calculateTax = async () => {
    const line_items = cartItems.map(item => ({
      amount: Math.round(item.price * 100),
      reference: item.id.toString(),
    }));
    
    const customer_details = {
      address: {
        "line1": address.address.line1,
        "city": address.address.city,
        "state": address.address.state,
        "postal_code": address.address.postalCode,
        "country": address.address.country,
      },
      address_source: "shipping"
    };
    
    const tax = await calculateTaxAmount(customer_details, line_items);
    setTaxAmount(tax.tax_calculation.tax_amount_exclusive);
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

  const initializePaymentSheet = async (total) => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams(Math.round(total*100));
    const { error } = await initPaymentSheet({
      merchantDisplayName: "fynspo",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: address.name },
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
      clearCart();
      setIsCheckoutComplete(true);
      animateModal(width);
    }
  };

  const isCheckoutReady = () => address && email.trim() !== '';

  const calculateSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal() + totalShippingCost + taxAmount;

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
                  taxAmount={taxAmount}
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
                  {isCheckoutReady() ? isDoneCalculating ? "Proceed to Checkout" : "Calculating..." : "Please fill all fields"}
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