import React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      if (err.errors && err.errors[0].code === 'form_identifier_not_found') {
        // Handle the case when the account doesn't exist
        Alert.alert(
          'Account Not Found',
          'The account you are trying to sign in with does not exist.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      } else {
        // Handle other errors
        console.log('Sign-in error:', err);
        Alert.alert(
          'Sign-In Error',
          'An error occurred during sign-in. Please try again.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          placeholderTextColor="black"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          placeholder="Password..."
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8A2BE2', // Purple background
    borderRadius: 10,
    padding: 15,
  },
  inputContainer: {
    marginBottom: 10,
    color: 'black',
  },
  input: {
    backgroundColor: '#e6e6e6',
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#8A2BE2', // Purple background
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    color: 'black',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});