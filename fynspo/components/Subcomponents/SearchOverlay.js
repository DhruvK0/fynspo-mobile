import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Animated, Keyboard, ActivityIndicator, Dimensions, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemGrid from '../Reusable/ItemGrid';
import { search } from '../../utils/requests';

const { width, height } = Dimensions.get('window');

const SearchOverlay = ({ isOpen, searchPanX, closeSearch, insets }) => {
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [shownIds, setShownIds] = useState(new Set());

  const mapApiItemToCarouselItem = useCallback((apiItem) => ({
    apiItem,
    id: apiItem.fynspo_id,
    image: apiItem.display_image,
    brand: apiItem.brand,
    name: apiItem.title,
    price: apiItem.price,
  }), []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCloseSearch = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setPage(1);
    setShownIds(new Set());
    closeSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setPage(1);
    setShownIds(new Set());
  };

  const performSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const results = await search(searchQuery, Array.from(shownIds));
      if (Array.isArray(results) && results.length > 0) {
        const mappedResults = results.map(mapApiItemToCarouselItem);
        setSearchResults(mappedResults);
        setPage(2);
        const newShownIds = new Set([...shownIds, ...mappedResults.map(item => item.id)]);
        setShownIds(newShownIds);
      } else {
        setSearchResults([]);
        setError('No results found');
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSearch = () => {
    Keyboard.dismiss();
    setShownIds(new Set()); // Reset shown IDs for new search
    performSearch();
  };

  const fetchMoreItems = async (currentPage) => {
    if (currentPage === 1) return searchResults;
    
    setIsLoading(true);
    try {
      const moreResults = await search(searchQuery, Array.from(shownIds));
      if (Array.isArray(moreResults) && moreResults.length > 0) {
        const mappedResults = moreResults.map(mapApiItemToCarouselItem);
        setPage(currentPage + 1);
        const newShownIds = new Set([...shownIds, ...mappedResults.map(item => item.id)]);
        setShownIds(newShownIds);
        return mappedResults;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

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
          <TouchableOpacity onPress={handleCloseSearch} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search products, colors, fits..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSubmitSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.searchResults}>
          {isLoading && searchResults.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8400ff" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <ItemGrid
              fetchItems={fetchMoreItems}
              onRemoveItem={() => {}} // Not needed for search results
              isCartView={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Search for products</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchOverlay;