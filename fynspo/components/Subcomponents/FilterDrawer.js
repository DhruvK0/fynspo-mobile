import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions, PanResponder, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getCollections } from '../../utils/requests';
import { saveFilterState, getFilterState } from '../../utils/storage';

const { height, width } = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.75;

const FilterDrawer = ({ isOpen, closeFilter, selectedSort, setSelectedSort, selectedFilters, setSelectedFilters }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [tempFilters, setTempFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAWER_HEIGHT / 3) {
          closeFilter();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
      loadFilters();
      fetchBrands();
    } else {
      Animated.spring(translateY, {
        toValue: DRAWER_HEIGHT,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [isOpen]);

  const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    // 'New',
    // 'Best Seller',
    // 'Highest Rated'
  ];

  const filterOptions = {
    Brand: brands,
    // Size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    // Gender: ['Men', 'Women', 'Unisex'],
    // Sale: ['On Sale', 'Regular Price'],
    // Color: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow']
  };

  const toggleSort = (option) => {
    setSelectedSort(selectedSort === option ? '' : option);
    saveFilters({ ...selectedFilters, sort: selectedSort === option ? '' : option });
  };

  const loadFilters = async () => {
    setLoading(true);
    try {
      const savedFilters = await getFilterState();
      setSelectedSort(savedFilters.sort || '');
      setSelectedFilters(savedFilters.filters || {});
      setTempFilters(savedFilters.filters || {});
      setPriceRange(savedFilters.filters?.Price || [0, 1000]);
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (category, value) => {
    setTempFilters(prev => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[category]) {
        updatedFilters[category] = [value];
      } else if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(v => v !== value);
        if (updatedFilters[category].length === 0) {
          delete updatedFilters[category];
        }
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    const updatedFilters = { ...tempFilters, Price: priceRange };
    setSelectedFilters(updatedFilters);
    saveFilters(updatedFilters);
    setActiveFilter(null);
  };

  const saveFilters = async (filters) => {
    try {
      console.log({ sort: selectedSort, filters: filters });
      await saveFilterState({ sort: selectedSort, filters: filters });
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const live_brands = await getCollections("brand");
      setBrands(live_brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFilterModal = () => {
    if (!activeFilter) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!activeFilter}
        onRequestClose={() => setActiveFilter(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{activeFilter}</Text>
              {activeFilter === 'Price' ? (
                <View style={styles.priceRangeContainer}>
                  <Text style={styles.priceRangeText}>
                    ${priceRange[0]} - ${priceRange[1]}
                  </Text>
                  <MultiSlider
                    values={[priceRange[0], priceRange[1]]}
                    sliderLength={width * 0.5}
                    onValuesChange={(values) => setPriceRange(values)}
                    min={0}
                    max={1000}
                    step={10}
                    allowOverlap={false}
                    snapped
                    selectedStyle={{
                      backgroundColor: '#8400ff',
                    }}
                    unselectedStyle={{
                      backgroundColor: '#3a3a3c',
                    }}
                    containerStyle={{
                      height: 40,
                    }}
                    trackStyle={{
                      height: 4,
                      backgroundColor: '#3a3a3c',
                    }}
                    markerStyle={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: '#8400ff',
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  />
                </View>
              ) : (
                <ScrollView> 
                {filterOptions[activeFilter].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modalOption,
                      tempFilters[activeFilter]?.includes(option) && styles.selectedOption
                    ]}
                    onPress={() => toggleFilter(activeFilter, option)}
                  >
                    <Text style={styles.modalOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
                </ScrollView>
              )}
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setActiveFilter(null)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.applyButton]} onPress={applyFilters}>
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Filter and Sort</Text>
          <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selectedSort === option && styles.selectedOption]}
            onPress={() => toggleSort(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Filters</Text>
        {Object.keys(filterOptions).concat('Price').map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, (Object.keys(selectedFilters).includes(option) || option === 'Price') && styles.selectedOption]}
            onPress={() => setActiveFilter(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
            {option === 'Price' && selectedFilters.Price && (
              <Text style={styles.selectedCount}>${selectedFilters.Price[0]} - ${selectedFilters.Price[1]}</Text>
            )}
            {option !== 'Price' && selectedFilters[option] && (
              <Text style={styles.selectedCount}>{selectedFilters[option].length} selected</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {renderFilterModal()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#3a3a3c',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  selectedOption: {
    backgroundColor: '#8400ff',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedCount: {
    color: '#8400ff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    maxHeight: height * 0.7,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3a3a3c',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  applyButton: {
    backgroundColor: '#8400ff',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceRangeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  priceRangeText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default FilterDrawer;