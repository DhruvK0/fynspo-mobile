import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Buttons/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef, useEffect } from 'react';
import CircleButton from './components/Buttons/CircleButton';
import IconButton from './components/Buttons/IconButton';
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/Auth/SignUpScreen";
import SignInScreen from "./components/Auth/SignInScreen";
import * as SecureStore from "expo-secure-store";
import AuthContainer from './components/Auth/AuthContainer';
import { makeApiCall } from './components/GetRequests';

const PlaceholderImage = require('./assets/images/background-image.png');

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

const SignOut = () => {
  const { isLoaded,signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <IconButton icon="logout" label="Logout" onPress={() => {
          signOut();
        }} />
    </View>
  );
};

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [clothing, setClothing] = useState(null);
  const [category, setCategory] = useState("Select Category");
  const imageRef = useRef();

  
  //create a useefffect that console logs changes to the clothing state
  useEffect(() => {
    console.log(clothing);
  }, [clothing]);


  const pickCameraImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      const searchResults = await makeApiCall(result.assets[0].base64);
      setClothing(searchResults);
      setShowAppOptions(true);
    } else {
      // alert('You did not select any image.');
    }
  };

  const pickLibraryImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      const searchResults = await makeApiCall(result.assets[0].base64);
      setClothing(searchResults);
      setShowAppOptions(true);
    } else {
      // alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  if (status === null) {
    requestPermission();
  }

  if (cameraPermission === null) {
    requestCameraPermission();
  }


  return (
    <ClerkProvider 
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
      tokenCache={tokenCache}
    >
    <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      {/* <SignedIn> */}
        
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} iconName={"add"} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />

            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <View style={styles.buttonContainer}>
            <CircleButton theme="primary" label="Choose a photo" onPress={pickLibraryImageAsync} iconName={"image"} />
            <CircleButton theme="primary" label="Take a photo" onPress={pickCameraImageAsync} iconName={"camera-alt"}/>
            {/* <Button label="Use this photo" onPress={() => setShowAppOptions(true)} /> */}
            
          </View>
          <View>
          <SignOut />
        </View>
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
        
        
        <StatusBar style="auto" />
      {/* </SignedIn> */}
{/* 
      <SignedOut>
        <AuthContainer />
      </SignedOut> */}
    </View>
    </GestureHandlerRootView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    footerContainer: {
      // flex: 1 / 3,
      alignItems: 'center',
      marginTop: 20,
    },},
    optionsContainer: {
      position: 'absolute',
      bottom: 80,
    },
    optionsRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%', // Adjust the width as needed
    marginTop: 20,
    },
});