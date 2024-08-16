// import React, { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { getAllItemStates, subscribeToChanges } from '../../utils/storage';
// import ItemGrid from '../Reusable/ItemGrid';

// const SavedPage = () => {
//   const [savedItems, setSavedItems] = useState([]);
  

//   useEffect(() => {
//     loadSavedItems();

//     const unsubscribe = subscribeToChanges((data) => {
//       if (data.favoritesObject) {
//         const updatedItems = Object.values(data.favoritesObject);
//         setSavedItems(updatedItems);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const loadSavedItems = async (page) => {
//     const { favoritesObject } = await getAllItemStates();
//     const savedItemsArray = Object.values(favoritesObject);
//     // Simulating pagination for saved items
//     const itemsPerPage = 10;
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return savedItemsArray.slice(startIndex, endIndex);
//   };

//   const fetchSavedItems = useCallback(async (page) => {
//     const { favoritesObject } = await getAllItemStates();
//     const savedItemsArray = Object.values(favoritesObject);
//     // Simulating pagination for saved items
//     const itemsPerPage = 10;
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return savedItemsArray.slice(startIndex, endIndex);
//   }, []);


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Saved Items</Text>
//       <ItemGrid
//         fetchItems={fetchSavedItems}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     // margin: 20,   
//   },
// });

// export default SavedPage;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAllItemStates, subscribeToChanges } from '../../utils/storage';
import SavedItemGrid from '../Reusable/SavedItemGrid';

const SavedPage = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    loadSavedItems();

    const unsubscribe = subscribeToChanges((data) => {
      if (data.favoritesObject) {
        const updatedItems = Object.values(data.favoritesObject);
        setSavedItems(updatedItems);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadSavedItems = async () => {
    const { favoritesObject } = await getAllItemStates();
    const savedItemsArray = Object.values(favoritesObject);
    setSavedItems(savedItemsArray);
  };

  return (
    <View style={styles.container}>
      <SavedItemGrid items={savedItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,   
  },
});

export default SavedPage;