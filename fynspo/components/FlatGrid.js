import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import { FlatGrid, SectionGrid, SimpleGrid } from 'react-native-super-grid';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import OutfitItem from './OutfitItem';
import ProductItem from './ProductItem';
import { trackEvent } from "@aptabase/react-native";

export default function Example() {
  const [items, setItems] = React.useState([
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' },
  ]);

  return (
    <SectionGrid
      itemDimension={90}
      // staticDimension={300}
      // fixed
      // spacing={20}
      sections={[
        {
          title: 'Title1',
          data: items.slice(0, 6),
        },
        {
          title: 'Title2',
          data: items.slice(6, 12),
        },
        {
          title: 'Title3',
          data: items.slice(12, 20),
        },
      ]}
      style={styles.gridView}
      renderItem={({ item, section, index }) => (
        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCode}>{item.code}</Text>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}


export function SuperGridExample({ clothing }) {
  return (
    <SimpleGrid
      itemDimension={150}
      data={clothing}
      spacing={10}
      renderItem={({ item }) => (
        <View style={[styles.itemContainerMain, { backgroundColor: '#fff' }]}>
            <Pressable onPress={() => WebBrowser.openBrowserAsync(item.product_link)}>
            <Image source={{uri: item.image}} style={{width: 150, height: 200, resizeMode: 'contain',}}/>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>${item.price}</Text>
            </Pressable>
        </View>
      )}
    />
  );
}

export function FeedGrid({ clothing, onOutfitClick }) {
  const handleBuy = (item) => {
    // Implement your buy logic here
    console.log('Buying item:', item);
    // Track the buy action
    onOutfitClick(item.id, 'buy');
  };

  const handleItemClick = (item) => {
    // Track the item click
    onOutfitClick(item.id, 'view');
  };
  return (
    <SimpleGrid
      itemDimension={150}
      data={clothing}
      spacing={10}
      renderItem={({ item }) => (     
        <View style={styles.itemContainer}>
            <OutfitItem item={item} onBuy={handleBuy} />
        </View>
      )}
    />
  );
}

export function HomeGrid({ clothing, onItemClick }) {
  const handleBuy = (item) => {
    // Implement your buy logic here
    console.log('Buying item:', item);
  };
  return (
    <SimpleGrid
      itemDimension={150}
      data={clothing}
      spacing={10}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onItemClick(item)}>     
          <View style={styles.itemContainer}>
              <ProductItem item={item} onBuy={handleBuy} id={item.id} view={"main"}/>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainerMain: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  itemContainer: {
    borderRadius: 5,
    overflow: 'hidden', // This will clip the image to the container's bounds
    aspectRatio: 3/4, // Adjust this ratio as needed (e.g., 1 for square, 4/3 for landscape)
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // This will make the image cover the entire container
  },
  itemName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000',
  },
  sectionHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    alignItems: 'center',
    backgroundColor: '#636e72',
    color: 'white',
    padding: 10,
  },
});