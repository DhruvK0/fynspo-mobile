import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal'; // You'll need to install this package

const { width, height } = Dimensions.get('window');

const ProductItem = ({ item, onBuy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const openSubpage = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSubpage = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        slideAnim.setValue(Math.max(gestureState.dx, 0));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > width / 3) {
          closeSubpage();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (!isOpen) {
      slideAnim.setValue(width);
    }
  }, [isOpen]);

  return (
    <>
      <Pressable onPress={openSubpage} style={styles.pressable}>
        <Image source={{uri: item.image}} style={styles.image} />
      </Pressable>

      {isOpen && (
        <Portal>
          <View style={styles.fullScreenContainer}>
            <Animated.View 
              {...panResponder.panHandlers}
              style={[
                styles.subpage, 
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={closeSubpage}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>

              <Image source={{uri: item.image}} style={styles.modalImage} />
              <Text style={styles.priceText}>${item.price}</Text>
              <TouchableOpacity 
                style={styles.buyButton} 
                onPress={() => {
                  onBuy(item);
                  closeSubpage();
                }}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
  },
  subpage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width,
    height: height,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default ProductItem;