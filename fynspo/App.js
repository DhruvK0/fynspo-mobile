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
        {/* <SafeAreaView style={styles.safeArea}> */}  
          <SignedIn>
          <NavigationContainer>
            {/* <Tab.Navigator screenOptions={{tabBarOptions: {height: 200}, tabBarStyle: { height: 200 }, tabBarActiveBackgroundColor: '#8400ff', tabBarInactiveBackgroundColor: '#8400ff', headerShown: false, headerStyle: { backgroundColor: 'black' }, tabBarStyle: { color: 'black' }}}> */}
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Feed') {
                    iconName = focused ? 'trending-up' : 'trending-up';
                  } else if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'camera';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  }

                  // Use a different style for focused icons
                  return <MaterialIcons name={iconName} size={40} color={color} style={{ fontWeight: focused ? 'bold' : 'normal', paddingTop: 5 }} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                headerShown: false,
                tabBarActiveBackgroundColor: '#8400ff', tabBarInactiveBackgroundColor: '#8400ff',
                tabBarStyle: {
                  height: 75, // Adjust the base height as needed
                  borderTopWidth: 0,
                },
                tabBarShowLabel: false,
              })}

            > 
              <Tab.Screen name="Feed" component={Example} />
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        {/* </SafeAreaView> */}
        <View style={styles.bottomFill}/>
        <StatusBar style="auto" />
      </SignedIn>

      <SignedOut>
        <AuthContainer />
      </SignedOut>
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

