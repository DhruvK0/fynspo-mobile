import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, StatusBar, Platform, TextInput, Animated, PanResponder, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ForYouPage from '../Subcomponents/ForYou';
import CollectionsView from '../Subcomponents/Collections';
import ItemGrid from '../Reusable/ItemGrid';

const { width, height } = Dimensions.get('window');

const DRAWER_HEIGHT = height * 0.75;

const TikTokStyleComponent = () => {
  const insets = useSafeAreaInsets();
  const tabs = ['Saved', 'Collections', 'For You'];
  const [activeTab, setActiveTab] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const panY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const searchPanX = useRef(new Animated.Value(width)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'New',
    'Best Seller',
    'Highest Rated'
  ];

  const filterOptions = ['Size', 'Price', 'Gender', 'Sale', 'Color'];

  const resetFilterPosition = Animated.spring(panY, {
    toValue: 0,
    tension: 50,
    friction: 10,
    useNativeDriver: true,
  });

  const openFilter = () => {
    setIsFilterOpen(true);
    Animated.parallel([
      resetFilterPosition,
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFilter = () => {
    Animated.parallel([
      Animated.spring(panY, {
        toValue: DRAWER_HEIGHT,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFilterOpen(false);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      panY.setValue(Math.max(0, gestureState.dy));
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dy > DRAWER_HEIGHT / 3) {
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
        return <ItemGrid fetchItems={fetchSavedItems} />;
      case 'Collections':
        return <CollectionsView />;
      default:
        return null;
    }
  };

  const fetchSavedItems = async (page) => {
    // Implement your API call here
    // This is a placeholder implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${page}-${i}`,
      image: 'https://example.com/image.jpg',
      brand: `Brand ${page}-${i}`,
      name: `Item ${page}-${i}`,
      price: Math.floor(Math.random() * 100) + 20,
    }));
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleSort = (option) => {
    setSelectedSort(selectedSort === option ? '' : option);
  };

  const toggleFilter = (option) => {
    setSelectedFilters(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
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

  const renderFilterDrawer = () => (
    <Animated.View 
      style={[
        styles.filterOverlay,
        { opacity: overlayOpacity }
      ]}
    >
      <TouchableWithoutFeedback onPress={closeFilter}>
        <View style={styles.filterOverlayBackground} />
      </TouchableWithoutFeedback>
      <Animated.View 
        style={[
          styles.filterDrawer,
          { transform: [{ translateY: panY }] }
        ]}
      >
        <TouchableWithoutFeedback>
          <View>
            <View {...panResponder.panHandlers}>
              <View style={styles.filterHandle} />
              <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter and Sort</Text>
              <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            </View>
            
            <ScrollView style={styles.filterScrollView}>
              <Text style={styles.subHeader}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    selectedSort === option && styles.selectedOption
                  ]}
                  onPress={() => toggleSort(option)}
                >
                  <Text style={styles.filterOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.subHeader}>Filter</Text>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    selectedFilters.includes(option) && styles.selectedOption
                  ]}
                  onPress={() => toggleFilter(option)}
                >
                  <Text style={styles.filterOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openFilter} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#fff" />
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
      {isFilterOpen && renderFilterDrawer()}

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
  },
  filterOverlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterDrawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  closeButton: {
    padding: 5,
  },
  // filterScrollView: {
  //   flex: 1,
  // },
  subHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#8400ff',
    borderRadius: 5,
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