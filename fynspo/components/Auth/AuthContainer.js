import React, { useState, useEffect } from 'react'
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Modal, Linking } from 'react-native'
import { useUser, useClerk } from '@clerk/clerk-expo'
import SignInScreen from './SignInScreen'
import SignUpScreen from './SignUpScreen'
import { SignInWithOAuthApple, SignInWithOAuthGoogle } from './SignInWithOAuth'
import SurveyComponent from './Survey'

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
          By continuing, you agree to our{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://fynspo.com/tos')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://fynspo.com/eula')}>
            End User License Agreement
          </Text>
        </Text>
        <TouchableOpacity style={[styles.modalbutton, styles.modalbuttonClose]} onPress={onAgree}>
          <Text style={styles.modalbuttonText}>Agree and Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modalbutton, styles.modalbuttonCancel]} onPress={onCancel}>
          <Text style={styles.modalbuttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)

export default function AuthContainer() {
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [isSignUp, setIsSignUp] = useState(false)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)

  useEffect(() => {
    if (isSignedIn && user) {
      setSurveyCompleted(user.publicMetadata.surveyCompleted)
      if (!user.publicMetadata.agreementAccepted) {
        setShowAgreement(true)
      }
    }
  }, [isSignedIn, user])

  const handleAgreementAccepted = async () => {
    setShowAgreement(false)
    await user.update({ publicMetadata: { agreementAccepted: true } })
  }

  const handleAgreementCancelled = async () => {
    setShowAgreement(false)
    await signOut()
    await user.destroy()
  }

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
                Alert.alert('Account already exists', 'Please sign in instead.')
                setIsSignUp(false)
              }}
            />
          ) : (
            <SignInScreen />
          )}
          <View style={styles.authToggle}>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (isSignedIn && !user.publicMetadata.agreementAccepted) {
    return (
      <SafeAreaView style={styles.container}>
        <AgreementModal
          isVisible={showAgreement}
          onAgree={handleAgreementAccepted}
          onCancel={handleAgreementCancelled}
        />
      </SafeAreaView>
    )
  }

  if (isSignedIn && !surveyCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <SurveyComponent onComplete={() => setSurveyCompleted(true)} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome! You're signed in and have completed the survey.</Text>
    </SafeAreaView>
  )
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  modalbutton: {
    borderRadius: 25,
    padding: 15,
    elevation: 2,
    width: '100%',
    marginVertical: 5,
  },
  modalbuttonClose: {
    backgroundColor: '#8400ff',
  },
  modalbuttonCancel: {
    backgroundColor: '#f44336',
  },
  modalbuttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});