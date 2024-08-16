import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ItemComponent from './Item';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15;

const SavedItemGrid = ({ items }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <ItemComponent
              item={{...item, style: { width: COLUMN_WIDTH, marginBottom: 10 }}}
              style={{ width: COLUMN_WIDTH}}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 20,
  },
});

export default SavedItemGrid;