// import React, { useState, useRef, useEffect } from 'react';
// import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Portal } from '@gorhom/portal';
// import { makeApiCall } from './GetRequests';
// import { HomeGrid } from './FlatGrid';
// import IconButton from './Buttons/IconButton';
// import ImageViewer from './ImageViewer';
// const PlaceholderImage = require('../assets/images/background-image.png');
// const screenHeight = Dimensions.get('window').height;

// const { width, height } = Dimensions.get('window');

// const OutfitItem = ({ item, onBuy }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showAppOptions, setShowAppOptions] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [pickedEmoji, setPickedEmoji] = useState(null);
//   const [clothing, setClothing] = useState(null);
//   const [category, setCategory] = useState("Select Category");
//   const [loading, setLoading] = useState(true);
//   const imageRef = useRef();
//   const [isSticky, setIsSticky] = useState(false);
//   const scrollViewRef = useRef(null);
//   const slideAnim = useRef(new Animated.Value(width)).current;

//   const categories = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];

  

//   const openSubpage = async () => {
//     setIsOpen(true);
//     setLoading(true);

//     try {
//       const base64Image = await convertToBase64(item.image);
//       console.log('Base64 image:', base64Image);
//       const response = await makeApiCall(base64Image);
//       setClothing(response.data);
//       setCategory(Object.keys(response)[0])
//       console.log('Response:', response);
//     } catch (error) {
//       console.error('Error making API call:', error);
//     }

//     setLoading(false);

//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleScroll = (event) => {
//       const scrollPosition = event.nativeEvent.contentOffset.y;
//       setIsSticky(scrollPosition >= screenHeight / 190);  // Adjust based on your image height
//     };

//     const onReset = () => {
//       // Implement your reset logic here
//       setSelectedImage(null);
//       setShowAppOptions(false);
//       setClothing(null);
//       setLoading(true);

//     }; 

//   const closeSubpage = () => {
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

//   const convertToBase64 = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(',')[1];
//         resolve(base64String);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
// };

//   const renderItem = ({ item }) => (
//     <View style={styles.gridItem}>
//       <Image source={{ uri: item.image }} style={styles.gridItemImage} />
//       <Text style={styles.gridItemText}>{item.name}</Text>
//     </View>
//   );

//   return (
//     <>
//       <Pressable onPress={openSubpage} style={styles.pressable}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//       </Pressable>

//       {isOpen && (
//         <Portal>
//           {/* <View style={styles.fullScreenContainer}>
//             <Animated.View
//               {...panResponder.panHandlers}
//               style={[styles.subpage, { transform: [{ translateX: slideAnim }] }]}
//             >
//               <TouchableOpacity style={styles.backButton} onPress={closeSubpage}>
//                 <Ionicons name="arrow-back" size={24} color="white" />
//               </TouchableOpacity>

//               <Image source={{ uri: item.image }} style={styles.modalImage} />
//               <Text style={styles.priceText}>${item.price}</Text>

//               {isLoading ? (
//                 <ActivityIndicator size="large" color="white" style={styles.loader} />
//               ) : (
//                 <>
//                   <HomeGrid clothing={foundItems[selectedCategory]} />
//                 </>
//               )}
//             </Animated.View>
//           </View> */}
//           <View style={[styles.container]}>
//             <View style={styles.optionsContainer}>
//               {loading ? 
//                 <SafeAreaView>
//                   <ScrollView
//                     ref={scrollViewRef}
//                     onScroll={handleScroll}
//                     scrollEventThrottle={16}
//                     stickyHeaderIndices={isSticky ? [1] : []}
//                     showsVerticalScrollIndicator={false}
//                   >
//                     <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
//                       <IconButton icon="refresh" label="Reset" onPress={onReset} />
//                       <ImageViewer 
//                         placeholderImageSource={PlaceholderImage} 
//                         selectedImage={selectedImage} 
//                         style={showAppOptions && { height: '100%', width: '100%' }} 
//                         height={screenHeight / 3.5}
//                       />
//                       {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
//                     </View>
//                     <View style={styles.loaderContainer}>
//                       <ActivityIndicator size="large" color="#8400ff"/> 
//                       <Text style={{color: 'white', textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Getting Your Matches</Text>           
//                     </View>
//                   </ScrollView>
//                 </SafeAreaView> :
//                 <SafeAreaView>
//                   <ScrollView
//                     ref={scrollViewRef}
//                     onScroll={handleScroll}
//                     scrollEventThrottle={16}
//                     stickyHeaderIndices={isSticky ? [1] : []}
//                     showsVerticalScrollIndicator={false}
//                     // style={{paddingTop: 40}}
//                   >
//                     <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
//                       <IconButton icon="refresh" label="Reset" onPress={onReset} />
//                       <ImageViewer 
//                         placeholderImageSource={PlaceholderImage} 
//                         selectedImage={selectedImage} 
//                         style={showAppOptions && { height: '100%', width: '100%' }} 
//                         height={screenHeight / 3.5}
//                       />
//                       {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
//                     </View>


//                     <ScrollView 
//                       horizontal={true} 
//                       showsHorizontalScrollIndicator={false}
//                       style={styles.categoriesContainer}
//                     >
//                       {Object.keys(clothing).map((key, index) => (
//                         <CategoryButton 
//                           key={index} 
//                           label={key} 
//                           onPress={() => setCategory(key)}
//                         />
//                       ))}
//                     </ScrollView>

//                     <View style={styles.gridContainer}>
//                       <HomeGrid clothing={clothing[category]} />
//                     </View>
//                   </ScrollView>
//                 </SafeAreaView>
//               }
//             </View>
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
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     paddingTop: 60,
//   },
//   modalImage: {
//     width: '80%',
//     height: '40%',
//     resizeMode: 'contain',
//     borderRadius: 20,
//   },
//   priceText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: 'white',
//   },
//   buyButton: {
//     backgroundColor: '#2ecc71',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   buyButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   categoriesContainer: {
//     marginTop: 20,
//     maxHeight: 50,
//   },
//   categoryButton: {
//     backgroundColor: '#333',
//     padding: 10,
//     borderRadius: 20,
//     marginHorizontal: 5,
//   },
//   categoryButtonText: {
//     color: 'white',
//   },
//   gridContainer: {
//     marginTop: 20,
//     width: '100%',
//   },
//   gridItem: {
//     flex: 1,
//     margin: 5,
//     alignItems: 'center',
//   },
//   gridItemImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//   },
//   gridItemText: {
//     color: 'white',
//     marginTop: 5,
//   },
//   loader: {
//     maginTop: 30
//   }
// });

// export default OutfitItem;

import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from '@gorhom/portal';
import CategoryButton from './Buttons/CategoryButton';
import { HomeGrid } from './FlatGrid';
import ImageViewer from './ImageViewer';

const { width, height } = Dimensions.get('window');

// Dummy data for clothing
const dummyClothing = {
  tops: [
    [
      { id: '1', name: 'Top 1', image: 'https://via.placeholder.com/100' },
      { id: '2', name: 'Top 2', image: 'https://via.placeholder.com/100' },
      { id: '3', name: 'Top 3', image: 'https://via.placeholder.com/100' },
      { id: '4', name: 'Top 4', image: 'https://via.placeholder.com/100' },
    ],
  ],
  bottoms: [
    [
      { id: '5', name: 'Bottom 1', image: 'https://via.placeholder.com/100' },
      { id: '6', name: 'Bottom 2', image: 'https://via.placeholder.com/100' },
      { id: '7', name: 'Bottom 3', image: 'https://via.placeholder.com/100' },
      { id: '8', name: 'Bottom 4', image: 'https://via.placeholder.com/100' },
    ],
  ],
  shoes: [
    [
      { id: '9', name: 'Shoe 1', image: 'https://via.placeholder.com/100' },
      { id: '10', name: 'Shoe 2', image: 'https://via.placeholder.com/100' },
      { id: '11', name: 'Shoe 3', image: 'https://via.placeholder.com/100' },
      { id: '12', name: 'Shoe 4', image: 'https://via.placeholder.com/100' },
    ],
  ],
};

const OutfitItem = ({ item, onBuy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [category, setCategory] = useState("Select Category");
  const [clothing, setClothing] = useState(dummyClothing);

  useEffect(() => {
    console.log(category);
  }, [category]);

  useEffect(() => {
    if (clothing) {
      setCategory(Object.keys(clothing)[0]);
    }
  }, [clothing]);

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
              <SafeAreaView>
                <TouchableOpacity 
                style={styles.backButton} 
                onPress={closeSubpage}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
    
                <View style={styles.imageContainer} collapsable={false}>
                  <ImageViewer 
                    
                    selectedImage={item.image} 
                    style={{ height: '100%', width: '100%' }} 
                    height={height /2}
                  />
                </View>

                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
                >
                  {clothing && Object.keys(clothing).map((key, index) => (
                    <CategoryButton 
                            key={index} 
                            label={key} 
                            onPress={() => setCategory(key)}
                          />
                  ))}
                </ScrollView>
                <View style={styles.gridContainer}>
                  <HomeGrid clothing={clothing[category][0]} />
                </View>
              </ScrollView>

              </SafeAreaView>

              {/* <FlatList
                data={clothing && clothing[category] ? clothing[category][0] : []}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                style={styles.gridContainer}
              /> */}
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
    // top: 0,
    // left: 0,
    width: width,
    // height: height,
    // zIndex: 1000,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subpage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width,
    height: height,
    backgroundColor: 'black',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingTop: 60,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalImage: {
    width: '80%',
    height: '40%',
    resizeMode: 'contain',
    // borderRadius: 20,
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
    backgroundColor: 'black',
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 2,
  },
  categoryButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#2ecc71',
  },
  categoryButtonText: {
    color: 'white',
  },
  // gridContainer: {
  //   marginTop: 20,
  //   width: '100%',
  // },
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