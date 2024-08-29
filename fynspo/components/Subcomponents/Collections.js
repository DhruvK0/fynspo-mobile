import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import CollectionCard from '../Reusable/CollectionCard';
import SubCollectionsView from '../Reusable/SubCollectionsView';
import ItemsView from '../Reusable/ItemsView';
import { getCollections } from '../../utils/requests';

const { width, height } = Dimensions.get('window');

const BOTTOM_NAV_HEIGHT = 50;
const TOP_TAB_HEIGHT = 20;

const CollectionsView = () => {
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentItemView, setCurrentItemView] = useState(null);
  const [subCollections, setSubCollections] = useState({});
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const itemSlideAnim = useRef(new Animated.Value(width)).current;

  const collections = [
    'Shop By Brand',
    'Shop By Occasion',
    'Shop By Trend'
  ];

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      // Simulating an API call with setTimeout
      const liveBrands = await getCollections('brand');
      setSubCollections(prev => ({
        ...prev,
        'Shop By Brand': liveBrands
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const navigateTo = useCallback((screen) => {
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
  }, [itemSlideAnim, slideAnim]);

  const handleBack = useCallback(() => {
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
  }, [currentItemView, itemSlideAnim, slideAnim]);

  const renderMainContent = useCallback(() => (
    <View style={styles.mainContent}>
      {loading ? (
        <ActivityIndicator size="large" color="#8400ff" />
      ) : (
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
      )}
    </View>
  ), [collections, navigateTo, loading]);

  const renderScreen = useCallback((screen, index) => {
    const animatedStyle = {
      transform: [{ translateX: slideAnim }],
      opacity: slideAnim.interpolate({
        inputRange: [0, width],
        outputRange: [1, 0.3],
      }),
    };

    return (
      <Animated.View key={index} style={[StyleSheet.absoluteFill, animatedStyle]}>
        {screen.type === 'collection' && (
          <SubCollectionsView
            title={screen.title}
            subCollections={subCollections[screen.title] || []}
            onItemPress={(item) => navigateTo({ type: 'subcollection', title: item })}
            onBack={handleBack}
          />
        )}
      </Animated.View>
    );
  }, [slideAnim, subCollections, navigateTo, handleBack]);

  const renderItemView = useCallback(() => {
    if (!currentItemView) return null;

    const animatedStyle = {
      transform: [{ translateX: itemSlideAnim }],
      opacity: itemSlideAnim.interpolate({
        inputRange: [0, width],
        outputRange: [1, 0.3],
      }),
    };

    return (
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <ItemsView
          title={currentItemView.title}
          onBack={handleBack}
        />
      </Animated.View>
    );
  }, [currentItemView, itemSlideAnim, handleBack]);

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
    justifyContent: 'center',
  },
  listContainer: {
    // paddingVertical: 10,
  },
});

export default CollectionsView;