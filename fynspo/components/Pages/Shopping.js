import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Platform, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForYouPage from '../Subcomponents/ForYou';
import CollectionsView from '../Subcomponents/Collections';
import SavedPage from '../Subcomponents/Saved';
import FilterDrawer from '../Subcomponents/FilterDrawer';

const { width, height } = Dimensions.get('window');

const TikTokStyleComponent = () => {
  const insets = useSafeAreaInsets();
  const tabs = ['Saved', 'Collections', 'For You'];
  const [activeTab, setActiveTab] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const searchPanX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    setActiveTab(tabs[tabs.length - 1]);
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem('filters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setSelectedFilters(parsedFilters);
        if (parsedFilters.sort) {
          setSelectedSort(parsedFilters.sort);
        }
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

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
        return <ForYouPage filters={selectedFilters} />;
      case 'Saved':
        return <SavedPage />;
      case 'Collections':
        return <CollectionsView />;
      default:
        return null;
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const openFilter = () => {
    setIsFilterOpen(true);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
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
          <View style={styles.searchResults}>
            {/* Add search results here */}
          </View>
        </View>
      </Animated.View>
    );
  };

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
        <View style={styles.content}>
          {renderContent()}
        </View>
      </View>

      <FilterDrawer 
        isOpen={isFilterOpen}
        closeFilter={closeFilter}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    paddingHorizontal: 15,
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
  searchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    height: '100%',
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