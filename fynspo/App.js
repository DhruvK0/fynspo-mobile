import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, Dimensions} from 'react-native';
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
        <NavigationContainer>
          <Tab.Navigator screenOptions={{tabBarOptions: {height: 200}, tabBarStyle: { height: 200 }, tabBarActiveBackgroundColor: '#8400ff', tabBarInactiveBackgroundColor: '#8400ff', headerShown: false, headerStyle: { backgroundColor: 'black' }, tabBarStyle: { color: 'black' }}}>
            <Tab.Screen name="Feed" component={Example} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      {/* </SignedIn> */}
{/* 
      <SignedOut>
        <AuthContainer />
      </SignedOut> */}
    </GestureHandlerRootView>
    </ClerkProvider>    
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

