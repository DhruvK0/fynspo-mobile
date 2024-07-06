import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IconButton({ icon, label, onPress, color = '#fff' }) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'red',
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconButtonLabel: {
    color: '#fff',
    marginTop: 12,
  },
});