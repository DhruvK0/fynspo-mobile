import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import * as SecureStore from "expo-secure-store";
import MainFlow from './components/MainFlow';
import * as ScreenOrientation from 'expo-screen-orientation';

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    lockOrientation();
  }, []);

  return (
    <ClerkProvider 
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
      tokenCache={tokenCache}
    >
    <GestureHandlerRootView style={styles.container}>
      <MainFlow />
    </GestureHandlerRootView>
    </ClerkProvider>    
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  bottomFill: {
    backgroundColor: '#8400ff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32, // Adjust this value based on your device's bottom safe area
  },
});

