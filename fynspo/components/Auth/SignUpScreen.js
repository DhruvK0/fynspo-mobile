import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      {!pendingVerification ? (
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={firstName}
              placeholder="First Name..."
              placeholderTextColor="black"
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={lastName}
              placeholder="Last Name..."
              placeholderTextColor="black"
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              placeholderTextColor="black"
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Password..."
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Verification Code..."
              placeholderTextColor="black"
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify} style={styles.button}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  input: {
    backgroundColor: '#e6e6e6',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    color: 'black', // Ensure text input color is black
  },
  button: {
    backgroundColor: '#8A2BE2', // Purple background
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});