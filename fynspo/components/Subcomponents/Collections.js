import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, SafeAreaView, Animated, PanResponder } from 'react-native';
import CollectionCard from '../Reusable/CollectionCard';
import SubCollectionsView from '../Reusable/SubCollectionsView';
import ItemsView from '../Reusable/ItemsView';

const { width, height } = Dimensions.get('window');

const BOTTOM_NAV_HEIGHT = 50;
const TOP_TAB_HEIGHT = 50;

const CollectionsView = () => {
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentItemView, setCurrentItemView] = useState(null);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const itemSlideAnim = useRef(new Animated.Value(width)).current;

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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          if (currentItemView) {
            itemSlideAnim.setValue(gestureState.dx);
          } else {
            slideAnim.setValue(gestureState.dx);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > width / 3) {
          handleBack();
        } else {
          if (currentItemView) {
            Animated.spring(itemSlideAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;

  const navigateTo = (screen) => {
    if (screen.type === 'subcollection') {
      setCurrentItemView(screen);
      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setNavigationStack(prev => [...prev, screen]);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBack = () => {
    if (currentItemView) {
      Animated.timing(itemSlideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentItemView(null);
        itemSlideAnim.setValue(width);
      });
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setNavigationStack(prev => prev.slice(0, -1));
        slideAnim.setValue(width);
      });
    }
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

  const renderScreen = (screen, index) => {
    const animatedStyle = {
      transform: [{ translateX: slideAnim }],
      opacity: slideAnim.interpolate({
        inputRange: [0, width],
        outputRange: [1, 0.3],
      }),
    };

    return (
      <Animated.View key={index} style={[StyleSheet.absoluteFill, animatedStyle]} {...panResponder.panHandlers}>
        {screen.type === 'collection' && (
          <SubCollectionsView
            title={screen.title}
            subCollections={subCollections[screen.title]}
            onItemPress={(item) => navigateTo({ type: 'subcollection', title: item })}
            onBack={handleBack}
          />
        )}
      </Animated.View>
    );
  };

  const renderItemView = () => {
    if (!currentItemView) return null;

    const animatedStyle = {
      transform: [{ translateX: itemSlideAnim }],
      opacity: itemSlideAnim.interpolate({
        inputRange: [0, width],
        outputRange: [1, 0.3],
      }),
    };

    return (
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} {...panResponder.panHandlers}>
        <ItemsView
          title={currentItemView.title}
          onBack={handleBack}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderMainContent()}
        {navigationStack.map((screen, index) => renderScreen(screen, index))}
        {renderItemView()}
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
  listContainer: {
    paddingVertical: 10,
  },
});

export default CollectionsView;