import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import CategoryButton from "./Buttons/CategoryButton";
import { SuperGridExample, FeedGrid } from "./FlatGrid";
import { getSexTrends, getTrends } from "./GetRequests";
import { useUser } from '@clerk/clerk-expo'

export default function Feed() {
    const [category, setCategory] = useState(null);
    const [trends, setTrends] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trendContent, setTrendContent] = useState({});
    const { user } = useUser();

    useEffect(() => {
        const fetchTrends = async () => {
            try {
               if (user) {
                const trendData = await getSexTrends(user.unsafeMetadata.fashionPreference);
                setTrends(trendData);
                setCategory(trendData[0]);
                const trendInfo = await getTrends(trendData[0])
                setTrendContent({ [trendData[0]]: trendInfo });
                // console.log(trendInfo)
                setIsLoading(false)
                console.log(trendData.slice(1))

                await Promise.all(trendData.slice(1).map(async (trend) => {
                    const trendInfo = await getTrends(trend);
                    setTrendContent((prevState) => ({
                        ...prevState,
                        [trend]: trendInfo
                    }));
                }));
               }
               else {
                const trendData = await getSexTrends("F");
                console.log("No User Preference Found")
                setTrends(trendData);
                setCategory(trendData[0]);
                
                setIsLoading(false)
               }

               

            } catch (error) {
                console.error('Error fetching trends:', error);
                setIsLoading(false);
            }

            
        };

        

        fetchTrends();
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Image source={require('../assets/fynspo_logo.jpg')} style={{width: 200, height: 50, marginBottom: 10}} />
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesContainer}
                    >
                        {trends && trends.map((trend, index) => (
                            <CategoryButton 
                                key={index} 
                                label={trend} // Use the category property directly from the trend object
                                onPress={() => setCategory(trend)}
                                active={category === trend}
                            />
                        ))}
                    </ScrollView>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8400ff" />
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.gridContainer}>
                            <FeedGrid clothing={trendContent[category]} />
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingTop: 10,
    },
    categoriesContainer: {
        maxHeight: 50, // Adjust this value as needed
        borderBottomWidth: 1,
        borderBottomColor: '#8400ff',
    },
    gridContainer: {
        flex: 1,
    },
});