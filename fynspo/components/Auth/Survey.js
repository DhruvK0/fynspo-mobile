import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const fashion_types = { 
  "Men's Fashion": 'M',
  "Women's Fashion": 'F',
  "Both": 'B'
};

export function SurveyScreen({ onComplete, isEditing = false }) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [fashionPreference, setFashionPreference] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [fashionTrends, setFashionTrends] = useState([]);

  useEffect(() => {
    if (isEditing && user.unsafeMetadata) {
      setFashionPreference(user.unsafeMetadata.fashionPreference || '');
      setPriceRange(user.unsafeMetadata.priceRange || [0, 1000]);
      setFashionTrends(user.unsafeMetadata.fashionTrends || []);
    }
  }, [isEditing, user.unsafeMetadata]);

  const handleSurveyComplete = async () => {
    if (fashionTrends.length === 0) {
      Alert.alert("Selection Required", "Please select at least one fashion trend before completing the survey.");
    } else {
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
  }};

  const toggleTrend = (trend) => {
    if (fashionTrends.includes(trend)) {
      setFashionTrends(fashionTrends.filter(t => t !== trend));
    } else {
      setFashionTrends([...fashionTrends, trend]);
    }
  };

  const moveToNextStep = () => {
    if (step === 1 && !fashionPreference) {
      Alert.alert("Selection Required", "Please select a fashion preference before proceeding.");
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && fashionTrends.length === 0) {
      Alert.alert("Selection Required", "Please select at least one fashion trend before completing the survey.");
    } else {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select Your Fashion Preference:</Text>
            {["Men's Fashion", "Women's Fashion", "Both"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.button, fashionPreference === fashion_types[option] && styles.selectedButton]}
                onPress={() => setFashionPreference(fashion_types[option])}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.separator} />
            <View style={styles.navigationButtons}>
              {isEditing && (
                <TouchableOpacity style={styles.cancelButton} onPress={onComplete}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.nextButton} onPress={moveToNextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select Your Price Range:</Text>
            <MultiSlider
              values={priceRange}
              sliderLength={280}
              onValuesChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
            />
            <Text style={styles.priceText}>${priceRange[0]} - ${priceRange[1]}</Text>
            <View style={styles.separator} />
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={moveToNextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        const trends = ['Casual', 'Formal', 'Streetwear', 'Vintage', 'Athleisure'];
        return (
          <View style={styles.card}>
            <Text style={styles.question}>Select Your Fashion Trends:</Text>
            {trends.map((trend) => (
              <TouchableOpacity
                key={trend}
                style={[styles.button, fashionTrends.includes(trend) && styles.selectedButton]}
                onPress={() => toggleTrend(trend)}
              >
                <Text style={styles.buttonText}>{trend}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.separator} />
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSurveyComplete}>
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Preferences' : 'Survey'}</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  question: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#8400ff',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  nextButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#8400ff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 40,
    marginTop: 10,
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    width: '80%',
    marginVertical: 20,
  },
});