import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';

const { width, height } = Dimensions.get('window');

const OutfitItem = ({ item, onBuy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  // Mock data for categories and items (replace with actual data)
  const categories = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const foundItems = [
    { id: '1', name: 'Item 1', image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Item 2', image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Item 3', image: 'https://via.placeholder.com/100' },
    { id: '4', name: 'Item 4', image: 'https://via.placeholder.com/100' },
  ];

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

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridItemImage} />
      <Text style={styles.gridItemText}>{item.name}</Text>
    </View>
  );

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

              <Image source={{uri: item.image}} style={styles.modalImage} />
              <Text style={styles.priceText}>${item.price}</Text>
              
              <ScrollView horizontal style={styles.categoriesContainer}>
                {categories.map((category, index) => (
                  <TouchableOpacity key={index} style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={foundItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                style={styles.gridContainer}
              />

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
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  modalImage: {
    width: '80%',
    height: '40%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
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
  categoriesContainer: {
    marginTop: 20,
    maxHeight: 50,
  },
  categoryButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryButtonText: {
    color: 'white',
  },
  gridContainer: {
    marginTop: 20,
    width: '100%',
  },
  gridItem: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  gridItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  gridItemText: {
    color: 'white',
    marginTop: 5,
  },
});

export default OutfitItem;