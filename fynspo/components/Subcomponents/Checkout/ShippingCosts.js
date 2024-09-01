// ShippingCosts.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShippingCosts = ({ shippingInfo, costPerBrand }) => {
  const renderCostPerBrand = () => {
    if (shippingInfo.length === 0 || Object.keys(costPerBrand).length === 0) return null;
    
    const finalCosts = shippingInfo.map(brandInfo => {
      const brandTotal = costPerBrand[brandInfo.brand] || 0;
      let shippingFee = brandInfo.fee;
      
      if (brandInfo.threshold_avail && brandTotal >= brandInfo.threshold) {
        shippingFee = 0;
      }

      return {
        brand: brandInfo.brand,
        subtotal: brandTotal,
        shippingFee: shippingFee,
        total: brandTotal + shippingFee,
        deliveryDays: `${brandInfo.delivery_days_min}-${brandInfo.delivery_days_max} days`
      };
    });

    return (
      <View style={styles.costPerBrandContainer}>
        {finalCosts.map(({ brand, shippingFee, deliveryDays }) => (
          <View key={brand} style={styles.brandCostItem}>
            <View>
              <Text style={styles.brandName}>{brand}</Text>
              <Text style={styles.deliveryDays}>{deliveryDays}</Text>
            </View>
            <View>
              <Text style={styles.shippingFee}>${shippingFee.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Shipping Costs</Text>
      {renderCostPerBrand()}
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
  costPerBrandContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
  },
  brandCostItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  brandName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryDays: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  shippingFee: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'right',
  },
});

export default ShippingCosts;