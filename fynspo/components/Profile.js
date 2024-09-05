// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
// import { useUser, useAuth } from '@clerk/clerk-expo';
// import { Button } from 'react-native-elements';
// import { SurveyScreen } from './Auth/Survey';
// import { track } from '@amplitude/analytics-react-native';

// export default function ProfileScreen() {
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showSurvey, setShowSurvey] = useState(false);

//   const handleDeleteAccount = () => {
//     track('delete_account_initiated', { userId: user.id });
//     Alert.alert(
//       "Delete Account",
//       "Are you sure you want to delete your account? This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive",
//           onPress: () => confirmDeleteAccount()
//         }
//       ]
//     );
//   };

//   const confirmDeleteAccount = () => {
//     track('delete_account_confirmed', { userId: user.id });
//     Alert.alert(
//       "Confirm Deletion",
//       "Please confirm once more that you want to permanently delete your account.",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete Permanently", 
//           style: "destructive",
//           onPress: () => deleteAccount()
//         }
//       ]
//     );
//   };

//   const deleteAccount = async () => {
//     setIsDeleting(true);
//     try {
//       await user.delete();
//       track('account_deleted', { userId: user.id });
//       await signOut();
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       track('delete_account_error', { userId: user.id, error: error.message });
//       Alert.alert("Error", "Failed to delete account. Please try again.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const openLink = (url) => {
//     track('legal_link_opened', { userId: user.id, url });
//     Linking.openURL(url).catch((err) => {
//       console.error('An error occurred', err);
//       track('legal_link_error', { userId: user.id, url, error: err.message });
//     });
//   };

//   const handleEditPreferences = () => {
//     try {
//       track('edit_preferences_click', { userId: user.id });
//       setShowSurvey(true);
//     } catch (error) {
//       track('edit_preferences_error', { userId: user.id, error: error.message });
//       Alert.alert("Error", "Failed to open preferences. Please try again.");
//     }
//   };

//   const handleSurveyComplete = () => {
//     setShowSurvey(false);
//     track('edit_preferences_complete', { userId: user.id });
//     // You might want to refresh the user data here
//   };

//   const handleSignOut = () => {
//     track('sign_out_click', { userId: user.id });
//     signOut();
//   };

//   if (showSurvey) {
//     return <SurveyScreen onComplete={handleSurveyComplete} isEditing={true} />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
//       <View style={styles.content}>
//         <Button
//           title="Edit Preferences"
//           onPress={handleEditPreferences}
//           buttonStyle={styles.editPreferencesButton}
//           titleStyle={styles.buttonText}
//           containerStyle={styles.buttonContainer}
//         />
//         <Button
//           title="Sign Out"
//           onPress={handleSignOut}
//           buttonStyle={styles.signOutButton}
//           titleStyle={styles.buttonText}
//           containerStyle={styles.buttonContainer}
//         />
//         <Button
//           title="Delete Account"
//           onPress={handleDeleteAccount}
//           buttonStyle={styles.deleteButton}
//           titleStyle={styles.buttonText}
//           loading={isDeleting}
//           containerStyle={styles.buttonContainer}
//         />
//       </View>
//       <View style={styles.legalContainer}>
//         <Button
//           title="EULA"
//           onPress={() => openLink('https://fynspo.com/eula')}
//           buttonStyle={styles.legalButton}
//           titleStyle={styles.legalButtonText}
//         />
//         <Button
//           title="Privacy"
//           onPress={() => openLink('https://fynspo.com/privacy')}
//           buttonStyle={styles.legalButton}
//           titleStyle={styles.legalButtonText}
//         />
//         <Button
//           title="Terms"
//           onPress={() => openLink('https://fynspo.com/tos')}
//           buttonStyle={styles.legalButton}
//           titleStyle={styles.legalButtonText}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 60,
//     marginBottom: 20,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     width: '80%',
//     marginVertical: 10,
//   },
//   editPreferencesButton: {
//     backgroundColor: '#8400ff',
//     borderRadius: 25,
//     paddingVertical: 15,
//   },
//   signOutButton: {
//     backgroundColor: '#8400ff',
//     borderRadius: 25,
//     paddingVertical: 15,
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     borderRadius: 25,
//     paddingVertical: 15,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   legalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingBottom: 20,
//     paddingHorizontal: 10,
//   },
//   legalButton: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginHorizontal: 5,
//     width: 100,
//   },
//   legalButtonText: {
//     color: 'black',
//     fontSize: 14,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Modal } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Button } from 'react-native-elements';
import { SurveyScreen } from './Auth/Survey';
import { track } from '@amplitude/analytics-react-native';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showPastOrdersModal, setShowPastOrdersModal] = useState(false);

  const handleDeleteAccount = () => {
    track('delete_account_initiated', { userId: user.id });
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
    track('delete_account_confirmed', { userId: user.id });
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
      track('account_deleted', { userId: user.id });
      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      track('delete_account_error', { userId: user.id, error: error.message });
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openLink = (url) => {
    track('legal_link_opened', { userId: user.id, url });
    Linking.openURL(url).catch((err) => {
      console.error('An error occurred', err);
      track('legal_link_error', { userId: user.id, url, error: err.message });
    });
  };

  const handleEditPreferences = () => {
    try {
      track('edit_preferences_click', { userId: user.id });
      setShowSurvey(true);
    } catch (error) {
      track('edit_preferences_error', { userId: user.id, error: error.message });
      Alert.alert("Error", "Failed to open preferences. Please try again.");
    }
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    track('edit_preferences_complete', { userId: user.id });
    // You might want to refresh the user data here
  };

  const handleSignOut = () => {
    track('sign_out_click', { userId: user.id });
    signOut();
  };

  const handlePastOrders = () => {
    track('past_orders_click', { userId: user.id });
    setShowPastOrdersModal(true);
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
          title="Past Orders"
          onPress={handlePastOrders}
          buttonStyle={styles.pastOrdersButton}
          titleStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={showPastOrdersModal}
        onRequestClose={() => setShowPastOrdersModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              For information about your past orders, please email contact@fynspo.com or call +1 (310) 400-6994.
              Order confirmations will be sent directly to your email. If you would like to return an item, please contact the fynspo team.
            </Text>
            <Button
              title="Close"
              onPress={() => setShowPastOrdersModal(false)}
              buttonStyle={styles.closeButton}
              titleStyle={styles.buttonText}
            />
          </View>
        </View>
      </Modal>
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
  pastOrdersButton: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#8400ff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});