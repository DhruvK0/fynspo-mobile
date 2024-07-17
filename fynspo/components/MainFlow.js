import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { PortalProvider } from '@gorhom/portal';
import { track } from '@amplitude/analytics-react-native';
import Feed from './Feed';
import Home from './Home';
import ProfileScreen from './Profile';
import AuthContainer from './Auth/AuthContainer';
import { SurveyScreen } from './Auth/Survey';
import SvgComponent from './NavBarIcons';

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

  useEffect(() => {
    if (user) {
      setSurveyCompleted(user.unsafeMetadata.surveyCompleted || false);
    }
  }, [user]);

  return (
    <PortalProvider>
      <SignedIn>
        {!surveyCompleted ? (
          <SurveyScreen onComplete={() => setSurveyCompleted(true)} />
        ) : (
          <NavigationContainer>
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

                  return <SvgComponent name={iconName} size={size} color={color} />;  
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
                    <Feed {...props} />
                  </TrackedScreen>
                )}
              </Tab.Screen>
              <Tab.Screen name="Camera">
                {(props) => (
                  <TrackedScreen route={props.route}>
                    <Home {...props} />
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
});