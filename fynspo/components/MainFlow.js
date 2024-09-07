import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { PortalProvider } from '@gorhom/portal';
import { track } from '@amplitude/analytics-react-native';
import ProfileScreen from './Profile';
import AuthContainer from './Auth/AuthContainer';
import { SurveyScreen } from './Auth/Survey';
import SvgComponent from './NavBarIcons';
import TikTokStyleComponent from './Pages/Shopping';
import ShoppingCartPage from './Pages/Cart';
import { createUser } from '../utils/requests';

const Tab = createBottomTabNavigator();

function TrackedScreen({ children, route }) {
  useFocusEffect(
    useCallback(() => {
      const startTime = Date.now();
      track('page_view', { page: route.name });

      return () => {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        track('page_exit', { page: route.name, duration });
      };
    }, [route.name])
  );

  return children;
}

export default function MainFlow() {
  const { user } = useUser();
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [dbCreated, setDbCreated] = useState(false);

  const checkDbCreated = async () => {
    if (!user.unsafeMetadata.dbCreated) {
      try {
        await createUser(user.id);
        await user.update({ unsafeMetadata: { ...user.unsafeMetadata, dbCreated: true } });
        setDbCreated(true);
      } catch (error) {
        // Handle the error appropriately
        await createUser(user.id);
      }
    } else {
      setDbCreated(true);
    }
  };

  useEffect(() => {
    if (user) {
      //check if dbCreated is false or undefined and if so call createUser request with user.id
      //then set dbCreated to true
      checkDbCreated();
      setSurveyCompleted(user.unsafeMetadata.surveyCompleted || false);
    }
  }, [user]);

  return (
    <PortalProvider>
      <SignedIn>
        {!surveyCompleted ? (
          <SurveyScreen onComplete={() => setSurveyCompleted(true)} />
        ) : !dbCreated ? 
        (<View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8400ff" />
          </View>) : (
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Cart') {
                    iconName = focused ? 'bag' : 'bag-outline';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  }

                  if (iconName != 'bag' && iconName != 'bag-outline') {
                    // return <SvgComponent name={iconName} size={size} color={color} />;
                    return <Ionicons name={iconName} size={36} color={'white'} />;
                  } else {
                    return <Ionicons name={iconName} size={36} color={'white'} />;
                  }

                  // return <SvgComponent name={iconName} size={size} color={color} />;  
                },
                headerShown: false,
                tabBarActiveBackgroundColor: '#000',
                tabBarInactiveBackgroundColor: '#000',
                tabBarStyle: {
                  height: 75,
                  borderTopWidth: 1,
                  borderTopColor: '#8400ff',
                },
                tabBarItemStyle: {
                  paddingTop: 5,
                  backgroundColor: "black"
                },
                tabBarShowLabel: false,
              })}
            >
              <Tab.Screen name="Home">
                {(props) => (
                  <TrackedScreen route={props.route}>
                    <TikTokStyleComponent {...props} />
                  </TrackedScreen>
                )}
              </Tab.Screen>
              <Tab.Screen name="Cart">
                {(props) => (
                  <TrackedScreen route={props.route}>
                    {/* <Home {...props} /> */}
                    <ShoppingCartPage {...props} />
                  </TrackedScreen>
                )}
              </Tab.Screen>
              <Tab.Screen name="Profile">
                {(props) => (
                  <TrackedScreen route={props.route}>
                    <ProfileScreen {...props} />
                  </TrackedScreen>
                )}
              </Tab.Screen>
            </Tab.Navigator>
            <View style={styles.bottomFill}/>
          </NavigationContainer>
        )}
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
    height: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});