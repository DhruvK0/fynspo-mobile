import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CheckBox } from 'react-native-elements';

export function SurveyScreen({ onComplete }) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [fashionPreference, setFashionPreference] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [fashionTrends, setFashionTrends] = useState([]);

  const handleSurveyComplete = async () => {
    try {
      await user.update({
        unsafeMetadata: { 
          surveyCompleted: true,
          fashionPreference,
          priceRange,
          fashionTrends
        },
      });
      onComplete();
    } catch (error) {
      console.error("Failed to update user metadata", error);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select your fashion preference:</Text>
            {['Men\'s Fashion', 'Women\'s Fashion', 'Both'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.button, fashionPreference === option && styles.selectedButton]}
                onPress={() => setFashionPreference(option)}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select your price range:</Text>
            <MultiSlider
              values={priceRange}
              sliderLength={280}
              onValuesChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
            />
            <Text style={styles.priceText}>${priceRange[0]} - ${priceRange[1]}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        const trends = ['Casual', 'Formal', 'Streetwear', 'Vintage', 'Athleisure'];
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select your fashion trends:</Text>
            {trends.map((trend) => (
              <CheckBox
                key={trend}
                title={trend}
                checked={fashionTrends.includes(trend)}
                onPress={() => {
                  if (fashionTrends.includes(trend)) {
                    setFashionTrends(fashionTrends.filter(t => t !== trend));
                  } else {
                    setFashionTrends([...fashionTrends, trend]);
                  }
                }}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleSurveyComplete}>
              <Text style={styles.buttonText}>Complete Survey</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#6200ea',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    marginTop: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '80%',
  },
  checkboxText: {
    fontSize: 16,
  },
});
