import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View, Platform, ScrollView, FlatList, Dimensions} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./Auth/SignUpScreen";
import SignInScreen from "./Auth/SignInScreen";
import * as SecureStore from "expo-secure-store";
import AuthContainer from './Auth/AuthContainer';
import Example, {SuperGridExample} from './FlatGrid';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import ProfileScreen from './Profile';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { CameraUnselected } from './components/Svgs';
import { PortalProvider } from '@gorhom/portal';
import { useUser } from "@clerk/clerk-expo";
import Feed from './Feed';
import ProductItem from './ProductItem';
import { Portal } from 'react-native-paper';
import { SurveyScreen } from './Auth/Survey';
import { useState, useEffect } from 'react';
import SvgComponent from './NavBarIcons';

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

export default function MainFlow() {
  const { user } = useUser();
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the user has completed the survey
      // This is an unsafe way to store this information, but as per your request:
      setSurveyCompleted(user.unsafeMetadata.surveyCompleted || false);
    }
  }, [user]);
  return (
        <PortalProvider>
        {/* <SafeAreaView style={styles.safeArea}> */}  
          <SignedIn>
            {!surveyCompleted ? (<SurveyScreen onComplete={() => setSurveyCompleted(true)} /> ) : (
                <NavigationContainer>
                    {/* <Tab.Navigator screenOptions={{tabBarOptions: {height: 200}, tabBarStyle: { height: 200 }, tabBarActiveBackgroundColor: '#8400ff', tabBarInactiveBackgroundColor: '#8400ff', headerShown: false, headerStyle: { backgroundColor: 'black' }, tabBarStyle: { color: 'black' }}}> */}
                    <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Camera') {
                            iconName = focused ? 'camera' : 'camera-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        // Use a different style for focused icons
                        // return <MaterialIcons name={iconName} size={40} color={color} style={{ fontWeight: focused ? 'bold' : 'normal', paddingTop: 5 }} />;
                        return <SvgComponent name={iconName} size={size} color={color} />;  
                      },
                        // tabBarActiveTintColor: 'white',
                        // tabBarInactiveTintColor: 'white',
                        headerShown: false,
                        tabBarActiveBackgroundColor: '#000', tabBarInactiveBackgroundColor: '#000',
                        tabBarStyle: {
                        height: 75, // Adjust the base height as needed
                        borderTopWidth: 1,
                        borderTopColor: '#8400ff',
                        },
                        tabBarItemStyle: {
                          paddingTop: 5, // Add this line to adjust icon position
                          backgroundColor: "black"
                        },
                        tabBarShowLabel: false,
                    })}

                    > 
                    <Tab.Screen name="Home" component={Feed} />
                    <Tab.Screen name="Camera" component={Home} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                    </Tab.Navigator>
                    <View style={styles.bottomFill}/>
                </NavigationContainer>
            )}
                
                {/* <StatusBar style="auto" /> */}

      </SignedIn>

      <SignedOut>
        <AuthContainer />
      </SignedOut>
      </PortalProvider>
            
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
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32, // Adjust this value based on your device's bottom safe area
  },
});
