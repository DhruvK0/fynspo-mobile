import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ForYouPage from '../Subcomponents/ForYou';

const ItemsView = ({ title, onBack }) => {
  return (
    <View style={styles.subContent}>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        <ForYouPage />
    </View>
  );
};

const styles = StyleSheet.create({
  subContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backButtonContainer: {
    marginBottom: 40,
    },
  fillerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ItemsView;