import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View, Platform, ScrollView, FlatList, Dimensions} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/Auth/SignUpScreen";
import SignInScreen from "./components/Auth/SignInScreen";
import * as SecureStore from "expo-secure-store";
import AuthContainer from './components/Auth/AuthContainer';
import Example, {SuperGridExample} from './components/FlatGrid';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home';
import ProfileScreen from './components/Profile';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { CameraUnselected } from './components/Svgs';
import { PortalProvider } from '@gorhom/portal';
import { useUser } from "@clerk/clerk-expo";
import Feed from './components/Feed';
import ProductItem from './components/ProductItem';
import { Portal } from 'react-native-paper';
import MainFlow from './components/MainFlow';

const Tab = createBottomTabNavigator();
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

