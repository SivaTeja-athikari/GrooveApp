import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Image,
    ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { musicAppColors } from "../utils/colors";
import { musicImages, notesImages } from "../images";
import {
    storeInAsyncStorage,
    getFromAsyncStorage,
} from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import { height, scaleSizeMultiplied, width } from "../utils/responsive";


const SplashScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [showTiles, setShowTiles] = useState(false);

    // Animations
    const titleY = useRef(new Animated.Value(0)).current;
    const tilesOpacity = useRef(new Animated.Value(0)).current;
    const tilesSlide = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        const checkAppSelection = async () => {
            const selectedApp = await getFromAsyncStorage("selectedApp");
            if (selectedApp) {
                setTimeout(() => {
                    navigation.replace(selectedApp);
                }, 2000)
            } else {
                setShowTiles(true);
                setLoading(false);

                const timer = setTimeout(() => {
                    Animated.sequence([
                        Animated.timing(titleY, {
                            toValue: -height * 0.15,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.parallel([
                            Animated.timing(tilesOpacity, {
                                toValue: 1,
                                duration: 800,
                                useNativeDriver: true,
                            }),
                            Animated.timing(tilesSlide, {
                                toValue: 0,
                                duration: 800,
                                useNativeDriver: true,
                            }),
                        ]),
                    ]).start();
                }, 1200);

                return () => clearTimeout(timer);
            }
        };

        checkAppSelection();
    }, []);

    const tiles = [
        { id: "Groove", label: "Groove", image: musicImages.headphones },
        { id: "Notes", label: "Notes", image: notesImages.noteSplash },
    ];

    const handleSelectApp = async (appId: string) => {
        await storeInAsyncStorage("selectedApp", appId);
        navigation.replace(appId);
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <Animated.Text
                    style={[
                        styles.title,
                        { transform: [{ translateY: titleY }] },
                    ]}
                >
                    Groove Notes
                </Animated.Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={["#0F0817", "#3e3747"]}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            {/* Title */}
            <Animated.Text
                style={[
                    styles.title,
                    { transform: [{ translateY: titleY }] },
                ]}
            >
                Groove Notes
            </Animated.Text>

            {/* Tiles */}
            {showTiles && (
                <Animated.View
                    style={[
                        styles.tilesContainer,
                        {
                            opacity: tilesOpacity,
                            transform: [{ translateY: tilesSlide }],
                        },
                    ]}
                >
                    {tiles.map((tile, index) => (
                        <TouchableOpacity
                            key={tile.id}
                            style={styles.tile}
                            onPress={() => handleSelectApp(tile.id)}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={tile.image}
                                style={styles.tileImage}
                                resizeMode="contain"
                                tintColor={"#726d79"}
                            />
                            <Text style={styles.tileText}>{tile.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F0817",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: musicAppColors.textPrimary,
        position: "absolute",
    },
    tilesContainer: {
        flexDirection: "row",
        gap: 20,
        marginTop: height * 0.1,
    },
    tile: {
        width: width * 0.35,
        height: width * 0.35,
        backgroundColor: musicAppColors.surface,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 10,
        gap: scaleSizeMultiplied(10)
    },
    tileImage: {
        width: scaleSizeMultiplied(60),
        height: scaleSizeMultiplied(60),
    },
    tileText: {
        color: musicAppColors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default SplashScreen;
