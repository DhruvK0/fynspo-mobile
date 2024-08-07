// import React from 'react';
// import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const ITEM_WIDTH = width / 2 - 30;

// const ItemComponent = ({ image, brand, name, price, style }) => {
//   return (
//     <View style={[styles.itemContainer, style]}>
//       <Image source={{ uri: image }} style={styles.image} />
//       <View style={styles.infoContainer}>
//         <View style={styles.textContainer}>
//           <Text style={styles.brandText} numberOfLines={1}>{brand}</Text>
//           <Text style={styles.nameText}>{name}</Text>
//         </View>
//         <View style={styles.bottomRow}>
//           <Text style={styles.priceText}>${price}</Text>
//           <TouchableOpacity style={styles.cartButton}>
//             <Ionicons name="cart-outline" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   itemContainer: {
//     width: ITEM_WIDTH,
//     // height: ITEM_WIDTH * 1.8, // Adjust this value to change the overall height of the item
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: ITEM_WIDTH * 1.2,
//     resizeMode: 'cover',
//   },
//   infoContainer: {
//     flex: 1,
//     padding: 10,
//     justifyContent: 'space-between',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   brandText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   nameText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   bottomRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     // marginTop: 15,
//   },
//   priceText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cartButton: {
//     // padding: 5,
//   },
// });

// export default ItemComponent;

import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 30;

const ItemComponent = ({ image, brand, name, price, style }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const panX = useRef(new Animated.Value(width)).current;
  const translateX = panX.interpolate({
    inputRange: [-1, 0, width],
    outputRange: [0, 0, width],
  });

  const resetModalPosition = Animated.spring(panX, {
    toValue: 0,
    damping: 15,
    mass: 0.7,
    stiffness: 150,
    useNativeDriver: true,
  });

  const closeModal = () => {
    Animated.spring(panX, {
      toValue: width,
      damping: 15,
      mass: 0.7,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
    // Set isModalVisible to false immediately
    setIsModalVisible(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        panX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 || gestureState.vx > 0.5) {
          closeModal();
        } else {
          resetModalPosition.start();
        }
      },
    })
  ).current;

  const toggleModal = () => {
    if (isModalVisible) {
      closeModal();
    } else {
      setIsModalVisible(true);
      Animated.spring(panX, {
        toValue: 0,
        damping: 15,
        mass: 0.7,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const ItemDetails = () => (
    <Animated.View 
      style={[styles.modalContainer, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.modalContent}>
        <ScrollView style={styles.modalScrollView}>
          <Image source={{ uri: image }} style={styles.modalImage} />
          <View style={styles.modalInfoContainer}>
            <Text style={styles.modalBrandText}>{brand}</Text>
            <Text style={styles.modalNameText}>{name}</Text>
            <Text style={styles.modalPriceText}>${price}</Text>
            <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={toggleModal}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <TouchableOpacity onPress={toggleModal} style={[styles.itemContainer, style]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.brandText} numberOfLines={1}>{brand}</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${price}</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <ItemDetails />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: ITEM_WIDTH * 1.2,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 14,
    color: '#666',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    // padding: 5,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  modalScrollView: {
    flex: 1,
  },
  modalInfoContainer: {
    padding: 20,
  },
  modalBrandText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalNameText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  modalPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ItemComponent;