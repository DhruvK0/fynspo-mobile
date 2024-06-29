import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import CategoryButton from "./Buttons/CategoryButton";
import { useState } from "react";
import { SuperGridExample } from "./FlatGrid";

const fashion_trends = 
{
    "Sustainable Fashion": [
        {"name": 201}, {"name": 202}, {"name": 203}, {"name": 204}, {"name": 205}
    ],
    "Oversized Silhouettes": [
        {"name": 301}, {"name": 302}, {"name": 303}, {"name": 304}, {"name": 305}
    ],
    "Cottagecore": [
        {"name": 401}, {"name": 402}, {"name": 403}, {"name": 404}, {"name": 405}
    ],
    "Athleisure": [
        {"name": 501}, {"name": 502}, {"name": 503}, {"name": 504}, {"name": 505}
    ],
    "Minimalism": [
        {"name": 601}, {"name": 602}, {"name": 603}, {"name": 604}, {"name": 605}
    ],
    "Vintage Inspired": [
        {"name": 701}, {"name": 702}, {"name": 703}, {"name": 704}, {"name": 705}
    ],
    "Neon Colors": [
        {"name": 801}, {"name": 802}, {"name": 803}, {"name": 804}, {"name": 805}
    ],
    "Gender-Neutral Fashion": [
        {"name": 901}, {"name": 902}, {"name": 903}, {"name": 904}, {"name": 905}
    ],
    "Monochromatic Looks": [
        {"name": 1001}, {"name": 1002}, {"name": 1003}, {"name": 1004}, {"name": 1005}
    ],
    "Streetwear": [
        {"name": 1101}, {"name": 1102}, {"name": 1103}, {"name": 1104}, {"name": 1105}
    ],
    "Retro Futurism": [
        {"name": 1201}, {"name": 1202}, {"name": 1203}, {"name": 1204}, {"name": 1205}
    ],
    "Bohemian Chic": [
        {"name": 1301}, {"name": 1302}, {"name": 1303}, {"name": 1304}, {"name": 1305}
    ],
    "Utility Wear": [
        {"name": 1401}, {"name": 1402}, {"name": 1403}, {"name": 1404}, {"name": 1405}
    ],
    "Pastel Palette": [
        {"name": 1501}, {"name": 1502}, {"name": 1503}, {"name": 1504}, {"name": 1505}
    ],
    "Digital Prints": [
        {"name": 1601}, {"name": 1602}, {"name": 1603}, {"name": 1604}, {"name": 1605}
    ],
    "Logomania": [
        {"name": 1701}, {"name": 1702}, {"name": 1703}, {"name": 1704}, {"name": 1705}
    ],
    "Tailoring": [
        {"name": 1801}, {"name": 1802}, {"name": 1803}, {"name": 1804}, {"name": 1805}
    ],
    "Metallics": [
        {"name": 1901}, {"name": 1902}, {"name": 1903}, {"name": 1904}, {"name": 1905}
    ],
    "Eco-Friendly Materials": [
        {"name": 2001}, {"name": 2002}, {"name": 2003}, {"name": 2004}, {"name": 2005}
    ]
}

export default function Feed() {
    const [category, setCategory] = useState("Sustainable Fashion");

    return (
        // <View style={styles.safeArea}>
        // <SafeAreaView style={styles.container}>
        //     <Text style={styles.text}>Feed!</Text>
        // </SafeAreaView>
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                     <ScrollView 
                      horizontal={true} 
                      showsHorizontalScrollIndicator={false}
                      style={styles.categoriesContainer}
                    >
                      {Object.keys(fashion_trends).map((key, index) => (
                        <CategoryButton 
                          key={index} 
                          label={key} 
                          onPress={() => setCategory(key)}
                        />
                      ))}
                    </ScrollView>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.gridContainer}>
                      <SuperGridExample clothing={fashion_trends[category]} />
                    </ScrollView>
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
    },
    gridContainer: {
        flex: 1,
    },
});