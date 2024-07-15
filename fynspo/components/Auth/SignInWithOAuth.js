import React, { useState } from "react";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, StyleSheet, TouchableOpacity, Image, Modal, Alert, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from "@clerk/clerk-expo";
import * as ExpoLinking from "expo-linking"

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();


const AgreementModal = ({ isVisible, onAgree, onCancel }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onCancel}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          By continuing, you agree to our {' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://fynspo.com/tos')}
              >
                Terms of Service
              </Text> and {' '} <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://fynspo.com/eula')}
              >End User License Agreement</Text>
        </Text>
        <TouchableOpacity
          style={[styles.modalbutton, styles.modalbuttonClose]}
          onPress={onAgree}
        >
          <Text style={styles.modalbuttonText}>Agree and Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalbutton, styles.modalbuttonCancel]}
          onPress={onCancel}
        >
          <Text style={styles.modalbuttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);


const OAuthButton = ({ strategy, signup, icon, color, text }) => {
  useWarmUpBrowser();
  const [showAgreement, setShowAgreement] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: strategy});

  const onPress = React.useCallback(async () => {
    setShowAgreement(true);
  }, []);

  const handleAgree = async () => {
    setShowAgreement(false);
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({ redirectUrl: "fynspo://oauth-native-callback" });
        // await startOAuthFlow({ redirectUrl: ExpoLinking.createURL("/oauth-native-callback", { scheme: "fynspo" })});
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        if (signup) {
          // Check if the account already exists during sign-up
          try {
            await signUp.create({});
          } catch (err) {
            if (err.errors && err.errors[0].code === 'form_identifier_exists') {
              Alert.alert(
                "Account Already Exists",
                "An account with this email already exists. Please sign in instead.",
                [{ text: "OK" }]
              );
            } else {
              console.error("Sign-up error", err);
              Alert.alert(
                "Sign-up Error",
                "An error occurred during sign-up. Please try again.",
                [{ text: "OK" }]
              );
            }
            return;
          }
        } else {
          // Check if the account exists during sign-in
          try {
            await signIn.create({});
          } catch (err) {
            if (err.errors && err.errors[0].code === 'form_identifier_not_found') {
              Alert.alert(
                "Account Not Found",
                "No account found with this email. Please sign up instead.",
                [{ text: "OK" }]
              );
            } else {
              console.error("Sign-in error", err);
              Alert.alert(
                "Sign-in Error",
                "An error occurred during sign-in. Please try again.",
                [{ text: "OK" }]
              );
            }
            return;
          }
        }
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const handleCancel = () => {
    setShowAgreement(false);
  };

  return (
    <>
      {signup ?
        <>
        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
          <Ionicons name={icon} size={24} color="white" />
          <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
        <AgreementModal isVisible={showAgreement} onAgree={handleAgree} onCancel={handleCancel} />
      </> :
      <>
        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handleAgree}>
          <Ionicons name={icon} size={24} color="white" />
          <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
      </>
      }
    </>
  );
};

export const SignInWithOAuthApple = ({ signup }) => (
  <OAuthButton
    strategy="oauth_apple"
    signup={signup}
    icon="logo-apple"
    color="black"
    text={signup ? "Sign up with Apple" : "Sign in with Apple"}
  />
);

export const SignInWithOAuthGoogle = ({ signup }) => (
  <OAuthButton
    strategy="oauth_google"
    signup={signup}
    icon="logo-google"
    color="#DB4437"
    text={signup ? "Sign up with Google" : "Sign in with Google"}
  />
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    padding: 12,
    marginVertical: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Set a fixed width for the modal
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18, // Increased font size
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
    fontSize: 18, // Increased font size
  },
  modalbutton: {
    borderRadius: 25,
    padding: 15,
    elevation: 2,
    width: '100%', // Make buttons full width of the modal
    marginVertical: 5, // Add some vertical margin between buttons
  },
  modalbuttonClose: {
    backgroundColor: "#8400ff",
  },
  modalbuttonCancel: {
    backgroundColor: "#f44336",
  },
  modalbuttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16, // Increased font size
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});
