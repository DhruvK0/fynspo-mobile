// // CollectionsView.js
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
// import CollectionGridComponent from '../Reusable/CollectionGrid';

// const { width, height } = Dimensions.get('window');

// const CollectionCard = ({ title, onPress }) => (
//   <TouchableOpacity style={styles.collectionCard} onPress={onPress}>
//     <Text style={styles.cardTitle}>{title}</Text>
//   </TouchableOpacity>
// );

// const CollectionsView = () => {
//   const [selectedCollection, setSelectedCollection] = useState(null);

//   const collections = [
//     'Shop By Brand',
//     'Shop By Occasion',
//     'Shop By Trend'
//   ];

//   const handleCardPress = (title) => {
//     setSelectedCollection(title);
//   };

//   const closeModal = () => {
//     setSelectedCollection(null);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {collections.map((collection, index) => (
//           <CollectionCard 
//             key={index} 
//             title={collection} 
//             onPress={() => handleCardPress(collection)}
//           />
//         ))}
//       </ScrollView>
//       <Modal
//         visible={!!selectedCollection}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <CollectionGridComponent 
//           title={selectedCollection} 
//           onClose={closeModal}
//         />
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingVertical: 10,
//   },
//   collectionCard: {
//     width: width - 20,
//     height: height / 4,
//     backgroundColor: '#8400ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     marginHorizontal: 10,
//     borderRadius: 15,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default CollectionsView;

// CollectionsView.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, SafeAreaView, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo or the appropriate icon library

const { width, height } = Dimensions.get('window');

const BOTTOM_NAV_HEIGHT = 50; // Adjust this value based on your bottom navbar height
const TOP_TAB_HEIGHT = 50; // Adjust this value based on your top tab height

const CollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.collectionCard} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const SubCollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.subCollectionCard} onPress={onPress}>
    <Text style={styles.subCardTitle}>{title}</Text>
  </TouchableOpacity>
);

const ItemCard = ({ title }) => (
  <View style={styles.itemCard}>
    <Text style={styles.itemTitle}>{title}</Text>
  </View>
);

const CollectionsView = () => {
  const [navigationStack, setNavigationStack] = useState([]);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const collections = [
    'Shop By Brand',
    'Shop By Occasion',
    'Shop By Trend'
  ];

  const subCollections = {
    'Shop By Brand': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance'],
    'Shop By Occasion': ['Casual', 'Formal', 'Sport', 'Beach', 'Party', 'Work'],
    'Shop By Trend': ['Vintage', 'Minimalist', 'Bohemian', 'Streetwear', 'Athleisure', 'Sustainable'],
  };

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > width / 3) {
          handleBack();
        } else {
          // Reset position if not swiped far enough
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const navigateTo = (screen) => {
    setNavigationStack(prev => [...prev, screen]);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNavigationStack(prev => prev.slice(0, -1));
      slideAnim.setValue(width);
    });
  };

  const renderMainContent = () => (
    <View style={styles.mainContent}>
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <CollectionCard 
            title={item} 
            onPress={() => navigateTo({ type: 'collection', title: item })}
          />
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderCollection = (title) => (
    <Animated.View 
      style={[
        styles.subContent,
        {
          transform: [{ translateX: slideAnim }],
          opacity: slideAnim.interpolate({
            inputRange: [0, width],
            outputRange: [1, 0.3],
          }),
        }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={subCollections[title]}
        renderItem={({ item }) => (
          <SubCollectionCard
            title={item}
            // onPress={() => navigateTo({ type: 'subcollection', title: item })}
          />
        )}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </Animated.View>
  );

  const renderSubCollection = (title) => (
    <Animated.View 
      style={[
        styles.subContent,
        {
          transform: [{ translateX: slideAnim }],
          opacity: slideAnim.interpolate({
            inputRange: [0, width],
            outputRange: [1, 0.3],
          }),
        }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => <ItemCard title={item} />}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderMainContent()}
        {navigationStack.map((screen, index) => (
          <View key={index} style={StyleSheet.absoluteFill}>
            {screen.type === 'collection' && renderCollection(screen.title)}
            {/* {screen.type === 'subcollection' && renderSubCollection(screen.title)} */}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingTop: TOP_TAB_HEIGHT,
    paddingBottom: BOTTOM_NAV_HEIGHT,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  subContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  gridContainer: {
    paddingTop: 10,
  },
  collectionCard: {
    width: width - 20,
    height: (height - TOP_TAB_HEIGHT - BOTTOM_NAV_HEIGHT) / 4,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subCollectionCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  itemCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#4a0080',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default CollectionsView;