import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Button, Dimensions } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import Slider from '@react-native-community/slider'

const SurveyComponent = ({ onComplete }) => {
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [fashion, setFashion] = useState('')
  const [trends, setTrends] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1000])

  const saveSurveyData = async () => {
    try {
      await user.update({
        publicMetadata: {
          surveyCompleted: true,
          fashion,
          trends,
          priceRange,
        },
      })
      onComplete()
    } catch (err) {
      console.error('Failed to save survey data:', err)
    }
  }

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>Select your fashion preference:</Text>
        <TouchableOpacity style={styles.button} onPress={() => { setFashion('mens'); setStep(2) }}>
          <Text style={styles.buttonText}>Men's Fashion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setFashion('womens'); setStep(2) }}>
          <Text style={styles.buttonText}>Women's Fashion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setFashion('both'); setStep(2) }}>
          <Text style={styles.buttonText}>Both</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (step === 2) {
    const trendOptions = ['Casual', 'Formal', 'Streetwear', 'Vintage', 'Athletic']
    return (
      <View style={styles.container}>
        <Text style={styles.question}>Select fashion trends:</Text>
        {trendOptions.map((trend) => (
          <TouchableOpacity
            key={trend}
            style={[styles.button, trends.includes(trend) && styles.selectedButton]}
            onPress={() => {
              if (trends.includes(trend)) {
                setTrends(trends.filter(t => t !== trend))
              } else {
                setTrends([...trends, trend])
              }
            }}
          >
            <Text style={styles.buttonText}>{trend}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>Select price range:</Text>
        <Text>Min: ${priceRange[0]}</Text>
        <Slider
          style={styles.slider}
          value={priceRange[0]}
          onValueChange={(value) => setPriceRange([value, priceRange[1]])}
          minimumValue={0}
          maximumValue={1000}
          step={1}
        />
        <Text>Max: ${priceRange[1]}</Text>
        <Slider
          style={styles.slider}
          value={priceRange[1]}
          onValueChange={(value) => setPriceRange([priceRange[0], value])}
          minimumValue={0}
          maximumValue={1000}
          step={1}
        />
        <TouchableOpacity style={styles.submitButton} onPress={saveSurveyData}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export function SurveyScreen({ onComplete }) {
  const { user } = useUser();

  const handleSurveyComplete = async () => {
    try {
      await user.update({
        unsafeMetadata: { surveyCompleted: true },
      });
      onComplete();
    } catch (error) {
      console.error("Failed to update user metadata", error);
    }
  };

  return (
    <View style={surveystyles.container}>
      {/* Your survey questions and UI would go here */}
      <Text style={surveystyles.text}>Survey Questions Would Go Here</Text>
      
      <TouchableOpacity 
        style={surveystyles.button} 
        onPress={handleSurveyComplete}
      >
        <Text style={surveystyles.buttonText}>Complete Survey</Text>
      </TouchableOpacity>
    </View>
  );
}

const surveystyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Assuming you want to keep the black background
    marginTop: 250,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8400ff', // Purple background
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CD964',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  slider: {
    width: '80%',
    height: 40,
  },
})

export default SurveyComponent