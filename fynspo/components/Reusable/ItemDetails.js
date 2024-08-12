// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Image,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Animated,
//   PanResponder,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');

// const ItemDetails = ({ item, closeModal }) => {
//   const [selectedSize, setSelectedSize] = useState(null);
//   const panX = useRef(new Animated.Value(0)).current;
//   const translateX = panX.interpolate({
//     inputRange: [-1, 0, width],
//     outputRange: [0, 0, width],
//   });

//   const resetModalPosition = Animated.spring(panX, {
//     toValue: 0,
//     damping: 15,
//     mass: 0.7,
//     stiffness: 150,
//     useNativeDriver: true,
//   });

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gestureState) => {
//         panX.setValue(gestureState.dx);
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dx > 50 || gestureState.vx > 0.5) {
//           closeModal();
//         } else {
//           resetModalPosition.start();
//         }
//       },
//     })
//   ).current;

//   const availableSizes = Object.entries(item.apiItem)
//     .filter(([key, value]) => key.startsWith('size_') && value === 2)
//     .map(([key]) => key.replace('size_', ''));

//   return (
//     <Animated.View 
//       style={[styles.modalContainer, { transform: [{ translateX }] }]}
//       {...panResponder.panHandlers}
//     >
//       <View style={styles.modalContent}>
//         <ScrollView style={styles.modalScrollView}>
//           <Image source={{ uri: item.image }} style={styles.modalImage} />
//           <View style={styles.modalInfoContainer}>
//             <Text style={styles.modalBrandText}>{item.brand}</Text>
//             <Text style={styles.modalNameText}>{item.name}</Text>
//             <Text style={styles.modalPriceText}>${item.price}</Text>
//             <Text style={styles.modalCategoryText}>Category: {item.category}</Text>
//             <Text style={styles.sizeTitle}>Available Sizes:</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScrollView}>
//               {availableSizes.map((size) => (
//                 <TouchableOpacity
//                   key={size}
//                   style={[
//                     styles.sizeButton,
//                     selectedSize === size && styles.selectedSizeButton
//                   ]}
//                   onPress={() => setSelectedSize(size)}
//                 >
//                   <Text style={[
//                     styles.sizeButtonText,
//                     selectedSize === size && styles.selectedSizeButtonText
//                   ]}>{size}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </ScrollView>
//         <TouchableOpacity style={styles.backButton} onPress={closeModal}>
//           <Ionicons name="chevron-back" size={30} color="white" />
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'white',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: height * 0.9,
//     overflow: 'hidden',
//   },
//   modalImage: {
//     width: '100%',
//     height: height * 0.5,
//     resizeMode: 'cover',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 20,
//     padding: 5,
//   },
//   modalScrollView: {
//     flex: 1,
//   },
//   modalInfoContainer: {
//     padding: 20,
//   },
//   modalBrandText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalNameText: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 10,
//   },
//   modalPriceText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   modalCategoryText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 10,
//   },
//   sizeScrollView: {
//     marginVertical: 10,
//   },
//   sizeButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginRight: 8,
//   },
//   selectedSizeButton: {
//     backgroundColor: '#8400ff',
//     borderColor: '#8400ff',
//   },
//   sizeButtonText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   selectedSizeButtonText: {
//     color: 'white',
//   },
//   sizeTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//   },
// });

// export default ItemDetails;
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveItemState, getItemState } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemDetails = ({ item, closeModal }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [isInBag, setIsInBag] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const panX = useRef(new Animated.Value(0)).current;

  const translateX = panX.interpolate({
    inputRange: [-1, 0, width],
    outputRange: [0, 0, width],
  });

  useEffect(() => {
    loadItemState();
  }, []);

  const loadItemState = async () => {
    const { isInCart } = await getItemState(item);
    setIsInBag(isInCart);
  };

  const resetModalPosition = Animated.spring(panX, {
    toValue: 0,
    damping: 15,
    mass: 0.7,
    stiffness: 150,
    useNativeDriver: true,
  });

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

  const availableSizes = Object.entries(item.apiItem)
    .filter(([key, value]) => key.startsWith('size_') && value === 2)
    .map(([key]) => key.replace('size_', ''));

  const addToBag = async () => {
    if (!isInBag) {
      await saveItemState(item, false, true);
      setIsInBag(true);
    }
  };

  const toggleDescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <Animated.View 
      style={[styles.modalContainer, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <ScrollView style={styles.modalContent}>
        <Image source={{ uri: item.image }} style={styles.modalImage} />
        <View style={styles.modalInfoContainer}>
          <Text style={styles.modalBrandText}>{item.brand}</Text>
          <Text style={styles.modalNameText}>{item.name}</Text>
          <Text style={styles.modalPriceText}>${item.price}</Text>
          
          <TouchableOpacity onPress={toggleDescription} style={styles.accordionHeader}>
            <Text style={styles.accordionHeaderText}>Description</Text>
            <Ionicons 
              name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#333"
            />
          </TouchableOpacity>
          {isDescriptionExpanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.modalDescriptionText}>{item.apiItem.description}</Text>
            </View>
          )}
          
          <Text style={styles.sizeTitle}>Available Sizes:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScrollView}>
            {availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.selectedSizeButtonText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.addToBagButton, isInBag && styles.addToBagButtonDisabled]} 
            onPress={addToBag}
            disabled={isInBag || !selectedSize}
          >
            <Text style={styles.addToBagButtonText}>
              {isInBag ? 'In Bag' : 'Add to Bag'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={closeModal}>
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    height: height * 0.9,
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
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    paddingVertical: 10,
  },
  modalDescriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sizeScrollView: {
    marginVertical: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedSizeButton: {
    backgroundColor: '#8400ff',
    borderColor: '#8400ff',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeButtonText: {
    color: 'white',
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  addToBagButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addToBagButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToBagButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ItemDetails;