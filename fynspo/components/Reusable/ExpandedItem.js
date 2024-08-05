import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.2;

const ExpandedItemCard = ({ item, onClose }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dy) > DISMISS_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: 0, y: SCREEN_HEIGHT },
          duration: 300,
          useNativeDriver: false,
        }).start(onClose);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  useEffect(() => {
    pan.setValue({ x: 0, y: SCREEN_HEIGHT });
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedStyle = {
    transform: pan.getTranslateTransform(),
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]} {...panResponder.panHandlers}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.brandText}>{item.brand}</Text>
        <Text style={styles.nameText}>{item.name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${item.price}</Text>
          <Ionicons name="cart-outline" size={24} color="black" />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default ExpandedItemCard;