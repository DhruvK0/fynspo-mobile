import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import CategoryButton from "./Buttons/CategoryButton";
import { SuperGridExample, FeedGrid } from "./FlatGrid";
import { getSexTrends } from "./GetRequests";
import { useUser } from '@clerk/clerk-expo'


const trendings = {
  "boho": [
    {
      "image": "https://i.pinimg.com/236x/c4/26/90/c42690d92c96536967abbd2a83d429e1.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/55/6f/9a/556f9afacbd32e1528c3b4d068324b59.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/18/bc/c5/18bcc55b42ecd0ef50bdaa6c8b790612.jpg"
    }
  ],
  "Preppy": [
    {
      "image": "https://i.pinimg.com/236x/3e/3a/89/3e3a89ac7ca4ad2a711c7eb70b71f3cf.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/9f/21/6a/9f216afb23af04b8b15d67a5dce53028.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/17/52/6b/17526bb30625780d98001922540b1f08.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/19/46/96/194696c8c90649864621c47706b175d8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/18/ea/27/18ea27464c9d18417cb365316cf6d594.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/42/68/64/4268642d53336f7a4fce62c9813cad90.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/95/30/29/9530299990edca83d6428757a290f397.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/a8/29/be/a829be89baacf0a3e219004efd2fc36e.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/6e/a0/a2/6ea0a23d9f1be795a7f3bfa64023eb87.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/3e/a1/aa/3ea1aabebccf26026566417b2d9c83a6.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/91/ec/7a/91ec7a11be8020f57d19111f11db6ff0.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/d0/cc/d4/d0ccd482408056f7d004e2b5f64806c2.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/0d/3b/aa/0d3baafd67421d61b11d5f5f31afde39.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/c3/36/bb/c336bbf726648b2d6f6cb8f222e2966d.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/e7/63/ed/e763ed686602f0b45cfb02de4c7c5efc.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/bc/62/1a/bc621a034c8939e24176a2369015517f.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/65/b7/2a/65b72a3927597dab7238f35db3e5caed.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/7d/ee/38/7dee38dff1e0f5fb5516ce9a3972e92a.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/fa/3d/84/fa3d8479b628d37834c03596e2bd449a.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/be/c9/53/bec953972b36280ded62315c1190aafe.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/21/07/cf/2107cf107a2360057f4d2800db7be0e3.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/c0/b8/68/c0b8680bbf31b62f15ae24869bcbd5a4.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/89/dd/06/89dd06196d82c5ce723b8ca55835b1c8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/09/7f/00/097f004ac4f7ec4ae0ee65caf05c6bb7.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/d5/16/ea/d516ea9ee763692a34cb53c7001492d8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/a1/26/ca/a126ca5b24c26627eed6f4d53a6260cd.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/4b/64/35/4b6435ffc939fa86aa8896cdc64c69b6.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/8c/80/5c/8c805cd2367796f1627cce1048191a82.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/75/01/a3/7501a3b5e8e0aeae902ad28391cf1e4c.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/fd/51/e7/fd51e74766d11070a553a92e359528ff.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/3b/e7/42/3be74269b47c4c29566bf9c15277a8e3.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/a9/f4/e8/a9f4e8495b5c4655a54f4609cf1e25bf.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/55/6f/9a/556f9afacbd32e1528c3b4d068324b59.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/1f/c6/7b/1fc67ba0e9e6dfda2296f80760facdc4.jpg"
    }
  ],
  "Streetwear": [
    {
      "image": "https://i.pinimg.com/236x/72/26/c1/7226c1d5024a648783305554720f9fcf.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/89/51/d2/8951d27176fc3f7341e6cb662e187b86.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/f9/b8/0f/f9b80f044b162c2102eebe64ec43e811.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/3e/3a/89/3e3a89ac7ca4ad2a711c7eb70b71f3cf.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/47/34/61/473461590e0e5372877e95922a81246a.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/61/2e/5f/612e5f555a2f6860aacdaf52e21190e1.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/9f/21/6a/9f216afb23af04b8b15d67a5dce53028.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/4d/21/a1/4d21a169a85d164376a15f85adf17302.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/19/46/96/194696c8c90649864621c47706b175d8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/63/a9/9e/63a99e52a51d10ff672baa5af6062014.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/3d/11/17/3d11172dc4693d6e95e4203656ce8466.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/51/2b/1b/512b1b61b18708af605fd5576d1b8d0a.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/35/43/9d/35439de7a6ca31c77861b5e35f0e1313.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/83/b1/b5/83b1b5548f3983072b161e226f685373.jpg"
    }
  ],
  "christmas outfits": [
    {
      "image": "https://i.pinimg.com/236x/19/46/96/194696c8c90649864621c47706b175d8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/a6/74/d0/a674d09b891a72f1491da9bfe6112e27.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/e7/53/60/e7536073ac88119b6c6f0c352117a045.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/6e/a0/a2/6ea0a23d9f1be795a7f3bfa64023eb87.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/12/f3/01/12f3011392f512333a707917652e30f0.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/c6/b6/c1/c6b6c169d598b6939524f4c3e7e42477.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/e7/63/ed/e763ed686602f0b45cfb02de4c7c5efc.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/f3/2a/6f/f32a6fc89c40ae25212de6fde6b89e6c.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/bc/62/1a/bc621a034c8939e24176a2369015517f.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/28/ef/46/28ef4685dd48c7909d6615f747d8aa6e.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/be/c9/53/bec953972b36280ded62315c1190aafe.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/bb/ae/05/bbae052bc8fd8d2caacf80ddcd2903b3.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/d2/6f/5c/d26f5c5d85f27dffeadca77bebb2061b.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/09/7f/00/097f004ac4f7ec4ae0ee65caf05c6bb7.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/d5/16/ea/d516ea9ee763692a34cb53c7001492d8.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/4b/64/35/4b6435ffc939fa86aa8896cdc64c69b6.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/fd/51/e7/fd51e74766d11070a553a92e359528ff.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/e3/1e/13/e31e131a1bbb244958a8f9f0968eb3d6.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/f2/b7/7f/f2b77fc56b542173a26f52a57ee464d3.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/dd/0a/f4/dd0af4892738f025cf65c8cc4110b386.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/55/6f/9a/556f9afacbd32e1528c3b4d068324b59.jpg"
    }
  ],
  "european summer": [
    {
      "image": "https://i.pinimg.com/236x/df/0f/5a/df0f5a7063a97fa11f2a614ca7e76a8f.jpg"
    },
    {
      "image": "https://i.pinimg.com/236x/cc/45/94/cc45943c40431d52b76e99055b5c277b.jpg"
    }]
}


export default function Feed() {
    const [category, setCategory] = useState(null);
    const [trends, setTrends] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trendContent, setTrendContent] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchTrends = async () => {
            try {
               if (user) {
                const trendData = await getSexTrends(user.unsafeMetadata.fashionPreference);
                setTrends(trendData);
                setCategory(trendData[0]);
                setIsLoading(false)
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
                            <FeedGrid clothing={trends[category]} />
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