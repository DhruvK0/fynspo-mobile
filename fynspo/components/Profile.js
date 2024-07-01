import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Button } from 'react-native-elements';
import { SurveyScreen } from './Auth/Survey'; // Make sure this path is correct

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => confirmDeleteAccount()
        }
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Confirm Deletion",
      "Please confirm once more that you want to permanently delete your account.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Permanently", 
          style: "destructive",
          onPress: () => deleteAccount()
        }
      ]
    );
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await user.delete();
      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const handleEditPreferences = () => {
    setShowSurvey(true);
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    // You might want to refresh the user data here
  };

  if (showSurvey) {
    return <SurveyScreen onComplete={handleSurveyComplete} isEditing={true} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.content}>
        <Button
          title="Edit Preferences"
          onPress={handleEditPreferences}
          buttonStyle={styles.editPreferencesButton}
          titleStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Sign Out"
          onPress={signOut}
          buttonStyle={styles.signOutButton}
          titleStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.buttonText}
          loading={isDeleting}
          containerStyle={styles.buttonContainer}
        />
      </View>
      <View style={styles.legalContainer}>
        <Button
          title="EULA"
          onPress={() => openLink('https://fynspo.com/eula')}
          buttonStyle={styles.legalButton}
          titleStyle={styles.legalButtonText}
        />
        <Button
          title="Privacy"
          onPress={() => openLink('https://fynspo.com/privacy')}
          buttonStyle={styles.legalButton}
          titleStyle={styles.legalButtonText}
        />
        <Button
          title="Terms"
          onPress={() => openLink('https://fynspo.com/tos')}
          buttonStyle={styles.legalButton}
          titleStyle={styles.legalButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  editPreferencesButton: {
    backgroundColor: '#8400ff',
    borderRadius: 25,
    paddingVertical: 15,
  },
  signOutButton: {
    backgroundColor: '#8400ff',
    borderRadius: 25,
    paddingVertical: 15,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  legalButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    width: 100,
  },
  legalButtonText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});