import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForYouPage from '../Subcomponents/ForYou';
import CollectionsView from '../Subcomponents/Collections';
import SavedPage from '../Subcomponents/Saved';
import FilterDrawer from '../Subcomponents/FilterDrawer';
import SearchOverlay from '../Subcomponents/SearchOverlay';

const { width, height } = Dimensions.get('window');

const TikTokStyleComponent = () => {
  const insets = useSafeAreaInsets();
  const tabs = ['Saved', 'Collections', 'For You'];
  const [activeTab, setActiveTab] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const animateSearchOverlay = (toValue) => {
    Animated.timing(searchPanX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const memoizedForYou = useMemo(() => <ForYouPage filters={selectedFilters} />, [selectedFilters]);
  const memoizedSaved = useMemo(() => <SavedPage />, []);
  const memoizedCollections = useMemo(() => <CollectionsView />, []);

  const openFilter = () => {
    setIsFilterOpen(true);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    animateSearchOverlay(0);
  };

  const closeSearch = () => {
    animateSearchOverlay(width);
    setTimeout(() => {
      setIsSearchOpen(false);
    }, 300); // Wait for animation to complete before closing
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
          <TouchableOpacity onPress={openSearch} style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={[styles.page, activeTab === 'For You' ? styles.activePage : styles.inactivePage]}>
            {memoizedForYou}
          </View>
          <View style={[styles.page, activeTab === 'Saved' ? styles.activePage : styles.inactivePage]}>
            {memoizedSaved}
          </View>
          <View style={[styles.page, activeTab === 'Collections' ? styles.activePage : styles.inactivePage]}>
            {memoizedCollections}
          </View>
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

      <SearchOverlay
        isOpen={isSearchOpen}
        searchPanX={searchPanX}
        closeSearch={closeSearch}
        insets={insets}
      />
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
    position: 'relative',
  },
  page: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  activePage: {
    opacity: 1,
    zIndex: 1,
  },
  inactivePage: {
    opacity: 0,
    zIndex: 0,
  },
});

export default TikTokStyleComponent;