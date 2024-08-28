import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Animated, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchOverlay = ({ isOpen, searchPanX, closeSearch, searchQuery, setSearchQuery, handleSearch, clearSearch, insets }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Delay focus to ensure the animation has started
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCloseSearch = () => {
    Keyboard.dismiss();
    closeSearch();
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
              onSubmitEditing={handleSearch}
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
          {/* Add search results here */}
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
});

export default SearchOverlay;