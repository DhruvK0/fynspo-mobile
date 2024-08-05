import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import ForYouPage from '../Subcomponents/ForYou';

const { width } = Dimensions.get('window');

const TikTokStyleComponent = () => {
  const tabs = ['Saved', 'Collections', 'For You'];
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // Select the last tab on component mount
    setActiveTab(tabs[tabs.length - 1]);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'For You':
        return <ForYouPage/>;
      case 'Saved':
        return <Text style={styles.contentText}>Saved Content</Text>;
      case 'Collections':
        return <Text style={styles.contentText}>Collections Content</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.content}>
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  tab: {
    paddingVertical: 10,
    width: width / 3,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TikTokStyleComponent;