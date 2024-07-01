import React, { useState, useEffect } from 'react'
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import SignInScreen from './SignInScreen'
import SignUpScreen from './SignUpScreen'
import { SignInWithOAuthApple, SignInWithOAuthGoogle } from './SignInWithOAuth'
import SurveyComponent from './Survey'


export default function AuthContainer() {
  const { isSignedIn, user } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      setSurveyCompleted(user.publicMetadata.surveyCompleted);
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          {isSignUp ? <Text style={styles.title}>Sign Up</Text> : <Text style={styles.title}>Sign In</Text>}
          <SignInWithOAuthGoogle signup={isSignUp} />
          <SignInWithOAuthApple signup={isSignUp} />
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>
          {isSignUp ? (
            <SignUpScreen
              onAccountExists={() => {
                Alert.alert("Account already exists", "Please sign in instead.");
                setIsSignUp(false);
              }}
            />
          ) : (
            <SignInScreen />
          )}
          <View style={styles.authToggle}>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isSignedIn && !surveyCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <SurveyComponent onComplete={() => setSurveyCompleted(true)} />
      </SafeAreaView>
    );
  }

  // If signed in and survey completed, render main content
  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome! You're signed in and have completed the survey.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'black',
  },
  authToggle: {
    marginTop: 20,
  },
  toggleText: {
    color: 'black',
    textAlign: 'center',
  },
});