// ContactForm.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ContactForm = ({ email, setEmail }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Contact</Text>
      <TextInput
        style={styles.emailInput}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emailInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});

export default ContactForm;