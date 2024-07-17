// import { SafeAreaView } from "react-native-safe-area-context";
// import React, { useState, useEffect } from 'react';
// import { Text, StyleSheet, View, ScrollView, Image, ActivityIndicator } from 'react-native';
// import CategoryButton from "./Buttons/CategoryButton";
// import { SuperGridExample, FeedGrid } from "./FlatGrid";
// import { getSexTrends, getTrends } from "./GetRequests";
// import { useUser } from '@clerk/clerk-expo'
// import { trackEvent } from "@aptabase/react-native";
// import { track } from '@amplitude/analytics-react-native';


// export default function Feed() {
//     const [category, setCategory] = useState(null);
//     const [trends, setTrends] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [trendContent, setTrendContent] = useState({});
//     const [count, setCount] = useState(0);
//     const [categoryStartTime, setCategoryStartTime] = useState(null);
//     const { user } = useUser();

//     const logCategoryTime = (previousCategory) => {
//         if (categoryStartTime && previousCategory) {
//             const timeSpent = (Date.now() - categoryStartTime) / 1000; // Convert to seconds
//             track("category_time_spent", { category: previousCategory, timeSpent });
//         }
//         setCategoryStartTime(Date.now());
//     };

//     const handleOutfitClick = (outfitId, action) => {
//         track("outfit_interaction", { category, outfitId, action });
//     };

//     const increment = () => {
//         setCount(count + 1);
//         trackEvent("increment", { category, count });
//         track("increment", { category: category, count: count });
//     };

//     useEffect(() => {
//         const fetchTrends = async () => {
//             try {
//                if (user) {
//                 const trendData = await getSexTrends(user.unsafeMetadata.fashionPreference);
//                 setTrends(trendData);
//                 setCategory(trendData[0]);
//                 const trendInfo = await getTrends(trendData[0])
//                 setTrendContent({ [trendData[0]]: trendInfo });
//                 // console.log(trendInfo)
//                 setIsLoading(false)
//                 setCategoryStartTime(Date.now())

//                 await Promise.all(trendData.slice(1).map(async (trend) => {
//                     const trendInfo = await getTrends(trend);
//                     setTrendContent((prevState) => ({
//                         ...prevState,
//                         [trend]: trendInfo
//                     }));
//                 }));
//                }
//                else {
//                 const trendData = await getSexTrends("F");
//                 console.log("No User Preference Found")
//                 setTrends(trendData);
//                 setCategory(trendData[0]);
                
//                 setIsLoading(false)
//                }

               

//             } catch (error) {
//                 console.error('Error fetching trends:', error);
//                 setIsLoading(false);
//             }

            
//         };

        

//         fetchTrends();
//     }, []);

//     return (
//         <View style={styles.container}>
//             <SafeAreaView style={styles.safeArea}>
//                 <View style={styles.content}>
//                     <Image source={require('../assets/fynspo_logo.jpg')} style={{width: 200, height: 50, marginBottom: 10}} />
//                     <ScrollView 
//                         horizontal={true} 
//                         showsHorizontalScrollIndicator={false}
//                         style={styles.categoriesContainer}
//                     >
//                         {trends && trends.map((trend, index) => (
//                             <CategoryButton 
//                                 key={index} 
//                                 label={trend} // Use the category property directly from the trend object
//                                 onPress={() => {
//                                     logCategoryTime(category);
//                                     setCategory(trend)
//                                     increment()
//                                 }}
//                                 active={category === trend}
//                             />
//                         ))}
//                     </ScrollView>
//                     {isLoading ? (
//                         <View style={styles.loadingContainer}>
//                             <ActivityIndicator size="large" color="#8400ff" />
//                         </View>
//                     ) : (
//                         <ScrollView showsVerticalScrollIndicator={false} style={styles.gridContainer}>
//                             <FeedGrid clothing={trendContent[category]} onOutfitClick={handleOutfitClick}/>
//                         </ScrollView>
//                     )}
//                 </View>
//             </SafeAreaView>
//         </View>
//     );
//   }

// const styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         backgroundColor: 'black',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     content: {
//         flex: 1,
//         paddingTop: 10,
//     },
//     categoriesContainer: {
//         maxHeight: 50, // Adjust this value as needed
//         borderBottomWidth: 1,
//         borderBottomColor: '#8400ff',
//     },
//     gridContainer: {
//         flex: 1,
//     },
// });

import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import CategoryButton from "./Buttons/CategoryButton";
import { FeedGrid } from "./FlatGrid";
import { getSexTrends, getTrends } from "./GetRequests";
import { useUser } from '@clerk/clerk-expo'
import { trackEvent } from "@aptabase/react-native";
import { track } from '@amplitude/analytics-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Feed() {
    const [category, setCategory] = useState(null);
    const [trends, setTrends] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trendContent, setTrendContent] = useState({});
    const [count, setCount] = useState(0);
    const [categoryStartTime, setCategoryStartTime] = useState(null);
    const { user } = useUser();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState({});
    const scrollViewRef = useRef(null);

    const logCategoryTime = (previousCategory) => {
        if (categoryStartTime && previousCategory) {
            const timeSpent = (Date.now() - categoryStartTime) / 1000;
            track("category_time_spent", { category: previousCategory, timeSpent });
        }
        setCategoryStartTime(Date.now());
    };

    const handleOutfitClick = (outfitId, action) => {
        track("outfit_interaction", { category, outfitId, action });
    };

    const increment = () => {
        setCount(count + 1);
        trackEvent("increment", { category, count });
        track("increment", { category: category, count: count });
    };

    const fetchTrends = useCallback(async (initialFetch = false, newCategory = null) => {
        try {
            if (initialFetch) {
                setIsLoading(true);
                const trendData = user 
                    ? await getSexTrends(user.unsafeMetadata.fashionPreference)
                    : await getSexTrends("F");
                setTrends(trendData);
                setCategory(trendData[0]);
                const trendInfo = await getTrends(trendData[0]);
                setTrendContent({ [trendData[0]]: trendInfo });
                setCategoryStartTime(Date.now());

                const initialLoadingState = {};
                trendData.forEach(trend => {
                    initialLoadingState[trend] = trend !== trendData[0];
                });
                setLoadingCategories(initialLoadingState);

                await Promise.all(trendData.slice(1).map(async (trend) => {
                    const trendInfo = await getTrends(trend);
                    setTrendContent((prevState) => ({
                        ...prevState,
                        [trend]: trendInfo
                    }));
                    setLoadingCategories(prev => ({...prev, [trend]: false}));
                }));
            } else if (newCategory) {
                setLoadingCategories(prev => ({...prev, [newCategory]: true}));
                const trendInfo = await getTrends(newCategory);
                setTrendContent((prevState) => ({
                    ...prevState,
                    [newCategory]: trendInfo
                }));
                setLoadingCategories(prev => ({...prev, [newCategory]: false}));
            } else {
                setIsLoadingMore(true);
                const newTrendInfo = await getTrends(category);
                setTrendContent((prevState) => ({
                    ...prevState,
                    [category]: [...prevState[category], ...newTrendInfo]
                }));
            }
        } catch (error) {
            console.error('Error fetching trends:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [user, category]);

    useEffect(() => {
        fetchTrends(true);
    }, []);

    const handleLoadMore = () => {
        if (!isLoadingMore) {
            fetchTrends();
        }
    };

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const currentScrollPosition = contentOffset.y + layoutMeasurement.height;
        const halfwayPoint = contentSize.height / 2;

        if (currentScrollPosition >= halfwayPoint && !isLoadingMore) {
            handleLoadMore();
        }
    };

    const handleCategoryChange = (newCategory) => {
        logCategoryTime(category);
        setCategory(newCategory);
        increment();
        if (!trendContent[newCategory]) {
            fetchTrends(false, newCategory);
        }
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    };

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
                                label={trend}
                                onPress={() => handleCategoryChange(trend)}
                                active={category === trend}
                            />
                        ))}
                    </ScrollView>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8400ff" />
                        </View>
                    ) : loadingCategories[category] ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8400ff" />
                        </View>
                    ) : (
                        <ScrollView 
                            ref={scrollViewRef}
                            showsVerticalScrollIndicator={false} 
                            style={styles.gridContainer}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        >
                            <FeedGrid clothing={trendContent[category]} onOutfitClick={handleOutfitClick}/>
                            {isLoadingMore && (
                                <View style={styles.loadingMoreContainer}>
                                    <ActivityIndicator size="large" color="#8400ff" />
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 10,
        // paddingHorizontal: 10,
    },
    categoriesContainer: {
        maxHeight: 50,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#8400ff',
    },
    gridContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});