// import React, { useState, useRef, useEffect } from 'react';
// import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, Linking, ScrollView, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Portal } from '@gorhom/portal';
// import * as WebBrowser from 'expo-web-browser';
// import { HomeGrid } from './FlatGrid';
// import { getSimilarItems } from './GetRequests';
// import { track } from '@amplitude/analytics-react-native';

// const { width, height } = Dimensions.get('window');

// const ProductItem = ({ item, onBuy, depth = 0, id, view }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [visibleItems, setVisibleItems] = useState([]);
//   const [hiddenItems, setHiddenItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const slideAnim = useRef(new Animated.Value(width)).current;

//   useEffect(() => {
//     const fetchSimilarItems = async () => {
//       try {
//         const result = await getSimilarItems(id, view, 20);
//         setVisibleItems(result);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching similar items:', error);
//       }
//     };

//     if (isOpen) {
//       fetchSimilarItems();
//     }
//   }, [isOpen]);

//   const openSubpage = () => {
//     setIsOpen(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeSubpage = () => {
//     setSelectedItem(null);
//     Animated.timing(slideAnim, {
//       toValue: width,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => setIsOpen(false));
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return gestureState.dx > 20;
//       },
//       onPanResponderMove: (_, gestureState) => {
//         slideAnim.setValue(Math.max(gestureState.dx, 0));
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dx > width / 3) {
//           closeSubpage();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   useEffect(() => {
//     if (!isOpen) {
//       slideAnim.setValue(width);
//     }
//   }, [isOpen]);

//   const handleBuyNow = () => {
//     track('buy_button_click', { 
//       itemId: item.id, 
//       itemImage: item.image,
//       itemName: item.name,
//       itemPrice: item.price
//     });
//     WebBrowser.openBrowserAsync(item.product_link);
//   };

//   const handleGridItemClick = (gridItem) => {
//     track('grid_item_click', {
//       parentItemId: item.id,
//       parentItemImage: item.image,
//       gridItemId: gridItem.id,
//       gridItemImage: gridItem.image,
//       gridItemName: gridItem.name
//     });
//     setSelectedItem(gridItem);
//     openSubpage();
//   };

//   const handleRemoveItem = async (itemId) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const removedItemIndex = visibleItems.findIndex((item) => item.id === itemId);

//       if (removedItemIndex !== -1) {
//         const updatedVisibleItems = [...visibleItems];
//         const replacementItem = hiddenItems[0];
//         updatedVisibleItems[removedItemIndex] = replacementItem;
//         setVisibleItems(updatedVisibleItems);
//         const updatedHiddenItems = [...hiddenItems.slice(1), hiddenItems[0]];
//         setHiddenItems(updatedHiddenItems);
//       }
//     } catch (error) {
//       console.error('Error removing item:', error);
//     }
//   };

//   return (
//     <>
//       <Pressable onPress={openSubpage} style={styles.pressable}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//       </Pressable>

//       {isOpen && (
//         <Portal>
//           <View style={styles.fullScreenContainer}>
//             <Animated.View
//               {...panResponder.panHandlers}
//               style={[styles.subpage, { transform: [{ translateX: slideAnim }] }]}
//             >
//               <TouchableOpacity style={styles.backButton} onPress={closeSubpage}>
//                 <Ionicons name="arrow-back" size={24} color="white" />
//               </TouchableOpacity>

//               <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                 {selectedItem ? (
//                   <ProductItem item={selectedItem} depth={depth + 1} />
//                 ) : (
//                   <>
//                     <TouchableOpacity onPress={handleBuyNow}>
//                       <Image source={{ uri: item.image }} style={styles.modalImage} />
//                     </TouchableOpacity>
//                     <Text style={styles.productName}>{item.name}</Text>
//                     <Text style={styles.priceText}>${item.price}</Text>
//                     <TouchableOpacity
//                       style={styles.buyButton}
//                       onPress={handleBuyNow}
//                     >
//                       <Text style={styles.buyButtonText}>Buy Now</Text>
//                     </TouchableOpacity>
//                   </>
//                 )}
//                 {loading ? 
//                 <View style={styles.similarItemsTitle}>
//                   <ActivityIndicator size="large" color="#8400ff"/>
//                 </View> : 
//                 <View style={styles.scrollTitle}>
//                   <Text style={styles.similarItemsTitle}>Similar Styled Items</Text>
//                   <HomeGrid clothing={visibleItems} onItemClick={handleGridItemClick} />
//                 </View>
//                 }
//               </ScrollView>
//             </Animated.View>
//           </View>
//         </Portal>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   pressable: {
//     width: '100%',
//     height: '100%',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   fullScreenContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: width,
//     height: height,
//     zIndex: 1000,
//   },
//   subpage: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: width,
//     height: height,
//     backgroundColor: 'black',
//   },
//   scrollContent: {
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   scrollTitle: {
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: width * 0.8,
//     height: height * 0.4,
//     resizeMode: 'contain',
//     borderRadius: 10,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//     textAlign: 'center',
//     color: 'white',
//   },
//   priceText: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginTop: 10,
//     color: 'white',
//   },
//   buyButton: {
//     backgroundColor: '#8400ff',
//     padding: 15,
//     borderRadius: 5,
//     marginTop: 20,
//     width: width * 0.8,
//   },
//   buyButtonText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   similarItemsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 30,
//     marginBottom: 10,
//     color: 'white',
//   },
//   similarItemContainer: {
//     backgroundColor: 'white',
//     borderRadius: 5,
//     height: 150,
//     position: 'relative',
//   },
//   similarItemImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//     padding: 5,
//   },
// });

// export default ProductItem;

import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';
import * as WebBrowser from 'expo-web-browser';
import { HomeGrid } from './FlatGrid';
import { getSimilarItems } from './GetRequests';
import { track } from '@amplitude/analytics-react-native';

const { width, height } = Dimensions.get('window');

const ProductItem = ({ item, onBuy, depth = 0, id, view }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const fetchSimilarItems = async () => {
      try {
        console.log("Fetching similar items for item", id);
        const result = await getSimilarItems(id, view, 20);
        setVisibleItems(result);
        setLoading(false);
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
    track('buy_button_click', { 
      itemId: item.id, 
      itemImage: item.image,
      itemName: item.name,
      itemPrice: item.price
    });
    WebBrowser.openBrowserAsync(item.product_link);
  };

  const handleGridItemClick = (gridItem) => {
    track('grid_item_click', {
      parentItemId: item.id,
      parentItemImage: item.image,
      gridItemId: gridItem.id,
      gridItemImage: gridItem.image,
      gridItemName: gridItem.name
    });
    setSelectedItem(gridItem);
    openSubpage();
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const removedItemIndex = visibleItems.findIndex((item) => item.id === itemId);

      if (removedItemIndex !== -1) {
        const updatedVisibleItems = [...visibleItems];
        const replacementItem = hiddenItems[0];
        updatedVisibleItems[removedItemIndex] = replacementItem;
        setVisibleItems(updatedVisibleItems);
        const updatedHiddenItems = [...hiddenItems.slice(1), hiddenItems[0]];
        setHiddenItems(updatedHiddenItems);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      <Pressable onPress={openSubpage} style={styles.pressable}>
        <FastImage 
          source={{ uri: item.image }} 
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
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
                  <ProductItem item={selectedItem} depth={depth + 1} id={selectedItem.id} view={view} />
                ) : (
                  <>
                    <TouchableOpacity onPress={handleBuyNow}>
                      <FastImage 
                        source={{ uri: item.image }} 
                        style={styles.modalImage}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableOpacity>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.priceText}>${item.price}</Text>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={handleBuyNow}
                    >
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                  </>
                )}
                {loading ? 
                <View style={styles.similarItemsTitle}>
                  <ActivityIndicator size="large" color="#8400ff"/>
                </View> : 
                <View style={styles.scrollTitle}>
                  <Text style={styles.similarItemsTitle}>Similar Styled Items</Text>
                  <HomeGrid clothing={visibleItems} onItemClick={handleGridItemClick} />
                </View>
                }
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
  scrollTitle: {
    alignItems: 'center',
  },
  modalImage: {
    width: width * 0.8,
    height: height * 0.4,
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
});

export default ProductItem;