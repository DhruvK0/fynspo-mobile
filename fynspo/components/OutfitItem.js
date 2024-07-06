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