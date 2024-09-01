// ShippingForm.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AddressSheet } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ShippingForm = ({ address, setAddress }) => {
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);

  const renderAddress = () => {
    if (!address) return null;
    const { name, address: addr, phone } = address;
    return (
      <View style={styles.addressInfo}>
        <Text style={styles.addressText}>{name}</Text>
        <Text style={styles.addressText}>{addr.line1}</Text>
        {addr.line2 && <Text style={styles.addressText}>{addr.line2}</Text>}
        <Text style={styles.addressText}>{`${addr.city}, ${addr.state} ${addr.postalCode}`}</Text>
        <Text style={styles.addressText}>{addr.country}</Text>
        <Text style={styles.addressText}>{phone}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Shipping Information</Text>
      
      <AddressSheet
        appearance={{ colors: { primary: '#8400ff', background: '#ffffff' } }}
        visible={addressSheetVisible}
        onSubmit={(addressDetails) => { setAddress(addressDetails); setAddressSheetVisible(false); }}
        onError={(error) => { Alert.alert('Error', error.message); setAddressSheetVisible(false); }}
        additionalFields={{ phoneNumber: 'required' }}
        allowedCountries={['US']}
      />
      
      {renderAddress()}
      
      <TouchableOpacity style={styles.addressButton} onPress={() => setAddressSheetVisible(true)}>
        <View style={styles.iconContainer}>
          <Icon name={address ? "edit" : "add"} size={24} color="#fff" />
        </View>
        <Text style={styles.addressButtonText}>
          {address ? "Edit Shipping Address" : "Add Shipping Address"}
        </Text>
        <Icon name="arrow-forward" size={24} color="#fff" style={styles.rightIcon} />
      </TouchableOpacity>
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
  addressButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  addressInfo: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
});

export default ShippingForm;