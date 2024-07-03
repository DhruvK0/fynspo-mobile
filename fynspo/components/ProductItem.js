import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';
import { SimpleGrid } from 'react-native-super-grid';
import * as WebBrowser from 'expo-web-browser';
import { HomeGrid } from './FlatGrid';
import Home from './Home';

const { width, height } = Dimensions.get('window');

const ProductItem = ({ item, onBuy, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    // Fetch similar items based on the clicked image
    const fetchSimilarItems = async () => {
      try {
        // Dummy data for similar items with provided image links
        const dummyData = [
          {
            id: `similar-${depth}-0`,
            name: 'Similar Item 1',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/41/c9/76/41c976d2e9459aba38c3f5207c26f6d6.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-1`,
            name: 'Similar Item 2',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/a1/af/27/a1af272327639de4c1f3f2c62557e7ab.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-2`,
            name: 'Similar Item 3',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/9b/50/72/9b50721394ec9a8f27d9b69279ca56dd.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-3`,
            name: 'Similar Item 4',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/474x/d4/30/57/d4305735690274d0181fcd9732a1676d.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-4`,
            name: 'Similar Item 5',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/c4/26/90/c42690d92c96536967abbd2a83d429e1.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-5`,
            name: 'Similar Item 6',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/5b/90/21/5b90213fad525861f3a87b94506fd69c.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-6`,
            name: 'Similar Item 7',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/86/d7/c3/86d7c326848690a57e3d0a1751c190ec.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-7`,
            name: 'Similar Item 8',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/e2/3b/96/e23b96ce905149b2f5d1741d35baf2df.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-8`,
            name: 'Similar Item 9',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/474x/06/0f/3a/060f3a7738b1e54e0c62197934f53697.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-9`,
            name: 'Similar Item 10',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/73/5b/65/735b6567926c5f7e612eebd33cbf8f54.jpg',
            product_link: 'https://example.com',
          },
          {
            id: `similar-${depth}-10`,
            name: 'Similar Item 11',
            price: (Math.random() * 100).toFixed(2),
            image: 'https://i.pinimg.com/236x/ef/b7/d3/efb7d390149bcf7a2400932484e0bf0c.jpg',
            product_link: 'https://example.com',
          },
        ];

        // Update the visibleItems and hiddenItems state
        setVisibleItems(dummyData);
        // setHiddenItems(dummyData.slice(6));
      } catch (error) {
        console.error('Error fetching similar items:', error);
      }
    };

    if (isOpen) {
      fetchSimilarItems();
    }
  }, [isOpen]);

  const openSubpage = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSubpage = () => {
    setSelectedItem(null);
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

  const handleRemoveItem = async (itemId) => {
    try {
      // Simulate an API call to update the remove count for the item
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the index of the removed item in visibleItems
      const removedItemIndex = visibleItems.findIndex((item) => item.id === itemId);

      if (removedItemIndex !== -1) {
        // Create a new array with the removed item replaced by a hidden item
        const updatedVisibleItems = [...visibleItems];
        const replacementItem = hiddenItems[0];
        updatedVisibleItems[removedItemIndex] = replacementItem;

        // Update the visibleItems and hiddenItems state
        setVisibleItems(updatedVisibleItems);

        // Move the first item in hiddenItems to the end of the array
        const updatedHiddenItems = [...hiddenItems.slice(1), hiddenItems[0]];
        setHiddenItems(updatedHiddenItems);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    openSubpage();
  };

  return (
    <>
      <Pressable onPress={openSubpage} style={styles.pressable}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </Pressable>

      {isOpen && (
        <Portal>
          <View style={styles.fullScreenContainer}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.subpage, { transform: [{ translateX: slideAnim }] }]}
            >
              <TouchableOpacity style={styles.backButton} onPress={closeSubpage}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {selectedItem ? (
                  <ProductItem item={selectedItem} depth={depth + 1} />
                ) : (
                  <>
                  <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(item.product_link)}>
                    <Image source={{ uri: item.image }} style={styles.modalImage} />
                  </TouchableOpacity>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.priceText}>${item.price}</Text>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => WebBrowser.openBrowserAsync(item.product_link)}
                    >
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                  </>
                )}

                <Text style={styles.similarItemsTitle}>Similar Styled Items</Text>

                <HomeGrid clothing={visibleItems} />
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
    position: 'relative',
  },
  similarItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default ProductItem;