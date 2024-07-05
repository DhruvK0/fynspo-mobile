import { StyleSheet, View } from 'react-native';
import * as React from 'react';
import { Button } from 'react-native-paper';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

export default function CategoryButton({ label, onPress, loading }) {
    return (
        <View>
            {loading ? (
                    <Button style={styles.button} buttonColor="#d3d3d3" mode="contained" onPress={() => console.log(label)}></Button>
            ) : (
            <Button style={styles.button} buttonColor="#8400FF" mode="contained" onPress={onPress} compact >
                {label}
            </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 8,
  },
});