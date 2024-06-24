import { StyleSheet, Image, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;


export default function ImageViewer({ placeholderImageSource, selectedImage, height }) {
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
    
    return (
        <Image source={imageSource} style={styles.image} />
    );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: screenHeight / 3.5,
    borderRadius: 18,
  },
});
