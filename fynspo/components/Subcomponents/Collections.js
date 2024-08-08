// // CollectionsView.js
// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const SectionHeader = ({ title }) => (
//   <View style={styles.sectionHeader}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     <TouchableOpacity>
//       <Ionicons name="chevron-forward" size={24} color="#fff" />
//     </TouchableOpacity>
//   </View>
// );

// const CollectionsView = () => {
//   const sections = [
//     'For You',
//     'On Sale',
//     'Shop By Brand',
//     'Shop By Occasion',
//     'Shop By Trend'
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {sections.map((section, index) => (
//         <View key={index} style={styles.section}>
//           <SectionHeader title={section} />
//           {/* Add content for each section here */}
//           <Text style={styles.placeholder}>Content for {section}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   sectionTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   placeholder: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default CollectionsView;

// CollectionsView.js


// CollectionsView.js
// CollectionsView.js
// CollectionsView.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CollectionCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.collectionCard} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const CollectionsView = () => {
  const collections = [
    'For You',
    'On Sale',
    'Shop By Brand',
    'Shop By Occasion',
    'Shop By Trend'
  ];

  const handleCardPress = (title) => {
    console.log(`Pressed ${title} card`);
    // Add your navigation or other logic here
  };

  return (
    <ScrollView style={styles.container}>
      {collections.map((collection, index) => (
        <CollectionCard 
          key={index} 
          title={collection} 
          onPress={() => handleCardPress(collection)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  collectionCard: {
    width: width - 20,
    height: height / 4,
    backgroundColor: '#8400ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CollectionsView;