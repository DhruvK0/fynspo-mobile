import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, Dimensions, SafeAreaView, ActivityIndicator, Alert} from 'react-native';
import ImageViewer from './ImageViewer';
import Button from './Buttons/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef, useEffect } from 'react';
import CircleButton from './Buttons/CircleButton';
import IconButton from './Buttons/IconButton';
import EmojiPicker from "./EmojiPicker";
import EmojiList from './EmojiList';
import EmojiSticker from './EmojiSticker';
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./Auth/SignUpScreen";
import SignInScreen from "./Auth/SignInScreen";
import * as SecureStore from "expo-secure-store";
import AuthContainer from './Auth/AuthContainer';
import { makeApiCall } from './GetRequests';
import CategoryButton from './Buttons/CategoryButton';
import Example, {SuperGridExample, FeedGrid, HomeGrid } from './FlatGrid';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useUser } from "@clerk/clerk-expo";

const PlaceholderImage = require('../assets/images/background-image.png');
const screenHeight = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export default function Home() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
    const [clothing, setClothing] = useState(null);
    const [category, setCategory] = useState("Select Category");
    const [loading, setLoading] = useState(true);
    const imageRef = useRef();
    const [isSticky, setIsSticky] = useState(false);
    const scrollViewRef = useRef(null);
    const { user } = useUser();

    //create a useeffect to console log cateogry changes
    useEffect(() => {
        console.log(category);
    }, [category]);
    //create a useefffect that console logs changes to the clothing state
    useEffect(() => {
        //if cltohing is not null set loading to false
        if (clothing) {

        //set the category as the first key in the clothing object
        setCategory(Object.keys(clothing)[0]);

        setLoading(false);
        }
    }, [clothing]);

    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.y;
      setIsSticky(scrollPosition >= screenHeight / 190);  // Adjust based on your image height
    };

    const onReset = () => {
      // Implement your reset logic here
      setSelectedImage(null);
      setShowAppOptions(false);
      setClothing(null);
      setLoading(true);

    }; 
    
    const pickCameraImageAsync = async () => {
        let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.2,
        base64: true,
        });

        if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowAppOptions(true);
        try {
            const searchResults = await makeApiCall(result.assets[0].base64, user.unsafeMetadata);
            setClothing(searchResults);
        } catch (error) {
            console.log('API Error:', error);
            Alert.alert(
            'Error',
            'Failed to get matching clothes. Please upload another image or try again.',
            [
                {
                text: 'OK',
                onPress: () => {
                    setSelectedImage(null);
                    setShowAppOptions(false);
                    setClothing(null);
                },
                },
            ]
            );
        }
        } else {
        // alert('You did not select any image.');
        }
    };

    const pickLibraryImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.2,
        base64: true,
        });

        if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowAppOptions(true);
        try {
            const searchResults = await makeApiCall(result.assets[0].base64, user.unsafeMetadata);
            setClothing(searchResults);
        } catch (error) {
            console.log('API Error:', error);
            Alert.alert(
            'Error',
            'Failed to get matching clothes. Please upload another image or try again.',
            [
                {
                text: 'OK',
                onPress: () => {
                    setSelectedImage(null);
                    setShowAppOptions(false);
                    setClothing(null);
                },
                },
            ]
            );
        }
        } else {
        // alert('You did not select any image.');
        }
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
        <View style={{backgroundColor: '000'}}>
        {showAppOptions ? (
          <View style={[styles.container, showAppOptions]}>
            <View style={styles.optionsContainer}>
              {loading ? 
                <SafeAreaView>
                  <ScrollView
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    stickyHeaderIndices={isSticky ? [1] : []}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
                      {/* <View style={styles.resetButtonContainer}>
                        <IconButton icon="close" color="red" onPress={onReset} />
                      </View> */}
                      <ImageViewer 
                        placeholderImageSource={PlaceholderImage} 
                        selectedImage={selectedImage} 
                        style={showAppOptions && { height: '100%', width: '100%' }} 
                        height={screenHeight / 2}
                      />
                      {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
                    </View>
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="large" color="#8400ff"/> 
                      <Text style={{color: 'white', textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Getting Your Matches</Text>           
                    </View>
                  </ScrollView>
                </SafeAreaView> :
                <SafeAreaView>
                  <ScrollView
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    stickyHeaderIndices={isSticky ? [1] : []}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
                      <View style={styles.resetButtonContainer}>
                        <IconButton icon="close" color="white" onPress={onReset} />
                      </View>
                      <ImageViewer 
                        placeholderImageSource={PlaceholderImage} 
                        selectedImage={selectedImage} 
                        style={showAppOptions && { height: '100%', width: '100%' }} 
                        height={screenHeight / 3.5}
                      />
                      {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
                    </View>


                    <ScrollView 
                      horizontal={true} 
                      showsHorizontalScrollIndicator={false}
                      style={styles.categoriesContainer}
                    >
                      {Object.keys(clothing).map((key, index) => (
                        <CategoryButton 
                          key={index} 
                          label={key} 
                          onPress={() => setCategory(key)}
                        />
                      ))}
                    </ScrollView>

                    <View style={styles.gridContainer}>
                      <HomeGrid clothing={clothing[category][0]} />
                    </View>
                  </ScrollView>
                </SafeAreaView>
              }
            </View>
          </View>
        ) : (
          <View style={[styles.container, showAppOptions]}>
            <View style={styles.optionsContainer}>
              <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                  <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} style={showAppOptions && {  height: '100%', width: '100%' }} height={screenHeight / 2}/>
                  {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
                </View>
              </View>
              <View>
                  <View style={styles.footerContainer}>
                    <View style={styles.buttonContainer}>
                      <CircleButton theme="primary" label="Choose a photo" onPress={pickLibraryImageAsync} iconName={"image"} />
                      <CircleButton theme="primary" label="Take a photo" onPress={pickCameraImageAsync} iconName={"camera-alt"}/>            
                    </View>
                  </View>
              </View>
            </View>
          </View>
        )}
        </View>
    )
    
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    footerContainer: {
    },},
    optionsContainer: {
      // flex: 1
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // width: '100%',
      paddingTop: 20,
    },
    resetButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 50,
      zIndex: 1,
    },
    optionsRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 100,
    },
    categoryContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    categoriesContainer: {
      backgroundColor: 'black',
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 2,
    },
    loaderContainer: {
      justifyContent: 'center',
      paddingTop: 50,
    },
});