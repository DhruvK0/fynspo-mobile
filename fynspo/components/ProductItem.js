import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';
import { SimpleGrid } from 'react-native-super-grid'; // Make sure this is imported
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window');

const ProductItem = ({ item, onBuy, depth = 0 }) => {
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

  const handleBuyNow = () => {
    Linking.openURL(item.product_link);
  };

  // Dummy data for similar items
  const similarItems = Array(6).fill({}).map((_, index) => ({
    id: `similar-${depth}-${index}`,
    name: `Similar Item ${index + 1}`,
    price: (Math.random() * 100).toFixed(2),
    image: 'https://via.placeholder.com/150',
    product_link: 'https://example.com',
  }));

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
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Image source={{uri: item.image}} style={styles.modalImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.priceText}>${item.price}</Text>
                <TouchableOpacity 
                  style={styles.buyButton} 
                  onPress={() => WebBrowser.openBrowserAsync(item.product_link)}
                >
                  <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>

                <Text style={styles.similarItemsTitle}>Similar Styled Items</Text>
                <SimpleGrid
                  itemDimension={100}
                  data={similarItems}
                  spacing={10}
                  renderItem={({item: similarItem}) => (
                    <ProductItem 
                      item={similarItem} 
                      onBuy={onBuy} 
                      depth={depth + 1}
                    />
                  )}
                />
              </ScrollView>
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
    backgroundColor: 'black',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalImage: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
  },
  buyButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: width * 0.8,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  similarItemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: 'white',
  },
  similarItemContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 150,
  },
});

export default ProductItem;