import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, StatusBar, Platform, TextInput, Animated, PanResponder, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ForYouPage from '../Subcomponents/ForYou';

const { width, height } = Dimensions.get('window');

const TikTokStyleComponent = () => {
  const insets = useSafeAreaInsets();
  const tabs = ['Saved', 'Collections', 'For You'];
  const [activeTab, setActiveTab] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const panY = useRef(new Animated.Value(height)).current;
  const searchPanX = useRef(new Animated.Value(width)).current;

  const resetFilterPosition = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeFilter = () => {
    Animated.timing(panY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsFilterOpen(false));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dy > 50) {
        closeFilter();
      } else {
        resetFilterPosition.start();
      }
    },
  });

  const searchPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0) {
        searchPanX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > width / 3) {
        Animated.timing(searchPanX, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsSearchOpen(false);
          searchPanX.setValue(width);
        });
      } else {
        Animated.timing(searchPanX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    setActiveTab(tabs[tabs.length - 1]);
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      resetFilterPosition.start();
    }
  }, [isFilterOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      Animated.timing(searchPanX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isSearchOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case 'For You':
        return <ForYouPage />;
      case 'Saved':
        return <Text style={styles.contentText}>Saved Content</Text>;
      case 'Collections':
        return <Text style={styles.contentText}>Collections Content</Text>;
      default:
        return null;
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderSearchOverlay = () => {
    return (
      <Animated.View
        style={[
          styles.searchOverlay,
          { 
            transform: [{ translateX: searchPanX }],
            top: Platform.OS === 'ios' ? insets.top : 0
          }
        ]}
        {...searchPanResponder.panHandlers}
      >
        <View style={styles.searchContent}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setIsSearchOpen(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products, colors, fits..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView style={styles.searchResults}>
            {/* Add search results here */}
          </ScrollView>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsFilterOpen(true)} style={styles.iconButton}>
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setIsSearchOpen(true)} style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          {renderContent()}
        </ScrollView>
      </View>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <TouchableWithoutFeedback onPress={closeFilter}>
          <View style={styles.filterOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.filterDrawer,
                  { transform: [{ translateY: panY }] }
                ]}
                {...panResponder.panHandlers}
              >
                <View style={styles.filterHandle} />
                <Text style={styles.filterTitle}>Filters</Text>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>Price: Low to High</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>Price: High to Low</Text>
                </TouchableOpacity>
                {/* Add more filter options here */}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Search Overlay */}
      {isSearchOpen && renderSearchOverlay()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    width: 50,
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  tab: {
    paddingVertical: 10,
    width: (width - 100) / 3,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  filterOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterDrawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.5,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  filterHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#666',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 18,
  },
  searchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  searchContent: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  searchResults: {
    flex: 1,
  },
});

export default TikTokStyleComponent;