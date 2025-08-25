// import React, { useRef, useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     Dimensions,
//     Animated,
//     Image,
//     TouchableOpacity,
//     ScrollView,
//     Easing,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Sound from "react-native-sound";
// import { musicImages } from "../../images";

// const { width } = Dimensions.get("window");
// const ITEM_SIZE = width * 0.7;
// const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

// const musicLibrary = [
//     {
//         id: 1,
//         url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
//         title: 'Happy Rock',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's rock",
//         genre: 'Rock',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg',
//         duration: 105,
//     },
//     {
//         id: 2,
//         url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3',
//         title: 'Punky',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's rock",
//         genre: 'Rock',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/punky.jpg',
//         duration: 126,
//     },
//     {
//         id: 3,
//         url: 'https://www.bensound.com/bensound-music/bensound-actionable.mp3',
//         title: 'Actionable',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's rock",
//         genre: 'Rock',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/actionable.jpg',
//         duration: 122,
//     },
//     {
//         id: 4,
//         url: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
//         title: 'Romantic',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's Jazz",
//         genre: 'Jazz',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/romantic.jpg',
//         duration: 236,
//     },
//     {
//         id: 5,
//         url: 'https://www.bensound.com/bensound-music/bensound-allthat.mp3',
//         title: 'All That',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's Jazz",
//         genre: 'Jazz',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/allthat.jpg',
//         duration: 146,
//     },
//     {
//         id: 6,
//         url: 'https://www.bensound.com/bensound-music/bensound-love.mp3',
//         title: 'Love',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's Jazz",
//         genre: 'Jazz',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/love.jpg',
//         duration: 335,
//     },
//     {
//         id: 7,
//         url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
//         title: 'Dreams',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's Electronica",
//         genre: 'Electronica',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/dreams.jpg',
//         duration: 310,
//     },
//     {
//         id: 8,
//         url: 'https://www.bensound.com/bensound-music/bensound-dance.mp3',
//         title: 'Dance',
//         artist: 'Benjamin Tissot',
//         album: "Bensound's Electronica",
//         genre: 'Electronica',
//         date: '2014-05-20T07:00:00+00:00',
//         artwork: 'https://www.bensound.com/bensound-img/dance.jpg',
//         duration: 177,
//     },
// ];

// Sound.setCategory("Playback");

// const MusicCarousel = () => {
//     const flatListRef = useRef<Animated.FlatList<any>>(null);
//     const scrollX = useRef(new Animated.Value(0)).current;
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const progressInterval = useRef<NodeJS.Timeout | null>(null);

//     const infiniteData = [
//         musicLibrary[musicLibrary.length - 1],
//         ...musicLibrary,
//         musicLibrary[0],
//     ];

//     const [currentIndex, setCurrentIndex] = useState(1);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentSound, setCurrentSound] = useState<Sound | null>(null);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration] = useState(0);

//     useEffect(() => {
//         flatListRef.current?.scrollToIndex({ index: 1, animated: false });
//     }, []);

//     const startProgressTimer = (sound: Sound) => {
//         if (progressInterval.current) clearInterval(progressInterval.current);
//         progressInterval.current = setInterval(() => {
//             sound.getCurrentTime((seconds) => setCurrentTime(seconds));
//         }, 1000);
//     };

//     useEffect(() => {
//         if (isPlaying) {
//             Animated.loop(
//                 Animated.timing(rotateValue, {
//                     toValue: 1,
//                     duration: 5000,
//                     easing: Easing.linear,
//                     useNativeDriver: true,
//                 })
//             ).start();
//         } else {
//             rotateValue.stopAnimation();
//             rotateValue.setValue(0);
//         }
//     }, [isPlaying]);

//     const onEnd = (success: boolean) => {
//         if (success) handleNext();
//         setIsPlaying(true);
//     };

//     useEffect(() => {
//         const track = musicLibrary[currentIndex - 1];
//         if (!track?.url) return;

//         setCurrentTime(0);

//         if (currentSound) {
//             currentSound.stop();
//             currentSound.release();
//         }
//         if (progressInterval.current) clearInterval(progressInterval.current);

//         const sound = new Sound(track.url, null, (error) => {
//             if (error) return console.log("Failed to load sound", error);
//             setDuration(sound.getDuration());

//             if (isPlaying) {
//                 sound.play(onEnd);
//                 startProgressTimer(sound);
//             }
//         });

//         setCurrentSound(sound);

//         return () => {
//             if (progressInterval.current) clearInterval(progressInterval.current);
//             sound.release();
//         };
//     }, [currentIndex]);

//     useEffect(() => {
//         if (!currentSound) return;
//         if (isPlaying) {
//             currentSound.play(onEnd);
//             startProgressTimer(currentSound);
//         } else {
//             currentSound.pause();
//             if (progressInterval.current) clearInterval(progressInterval.current);
//         }
//     }, [isPlaying, currentSound]);

//     const handlePlayPause = () => setIsPlaying((prev) => !prev);

//     const handleNext = () => {
//         let nextIndex = currentIndex + 1;
//         if (nextIndex > musicLibrary.length) {
//             nextIndex = 1;
//             flatListRef.current?.scrollToIndex({ index: nextIndex, animated: false });
//         } else {
//             flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//         }
//         setCurrentIndex(nextIndex);
//     };

//     const handlePrevious = () => {
//         let prevIndex = currentIndex - 1;
//         if (prevIndex === 0) {
//             prevIndex = musicLibrary.length;
//             flatListRef.current?.scrollToIndex({ index: prevIndex, animated: false });
//         } else {
//             flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
//         }
//         setCurrentIndex(prevIndex);
//     };

//     const handleSeek = (percentage: number) => {
//         if (currentSound) {
//             const newPosition = duration * percentage;
//             currentSound.setCurrentTime(newPosition);
//             setCurrentTime(newPosition);
//         }
//     };

//     const formatTime = (seconds: number) => {
//         if (isNaN(seconds)) return "0:00";
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//     };

//     const renderItem = ({ item, index }) => {
//         const inputRange = [(index - 1) * ITEM_SIZE, index * ITEM_SIZE, (index + 1) * ITEM_SIZE];

//         const scale = scrollX.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: "clamp" });
//         const opacity = scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: "clamp" });
//         const translateX = scrollX.interpolate({ inputRange, outputRange: [-ITEM_SIZE * 0.1, 0, ITEM_SIZE * 0.1], extrapolate: 'clamp' });
//         const rotateY = scrollX.interpolate({ inputRange, outputRange: ["20deg", "0deg", "-20deg"], extrapolate: "clamp" });

//         const isCurrent = index === currentIndex;

//         return (
//             <View style={{ width: ITEM_SIZE }}>
//                 <Animated.View style={[styles.albumContainer, { transform: [{ perspective: ITEM_SIZE }, { translateX }, { rotateY }, { scale }], opacity }]}>
//                     <Image source={{ uri: item.artwork }} style={styles.albumArt} resizeMode="cover" />
//                     {isCurrent && (
//                         <Animated.View style={[styles.vinyl, { transform: [{ rotate: rotateValue.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]} />
//                     )}
//                 </Animated.View>
//             </View>
//         );
//     };

//     return (
//         <LinearGradient colors={["#2c0c16", "#5a2432", "#8a3a4f"]} style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <Text style={[styles.trackTitle, { textAlign: "center" }]}>Groove</Text>

//                 <Animated.FlatList
//                     ref={flatListRef}
//                     contentContainerStyle={{ alignItems: 'center', paddingHorizontal: SPACER_ITEM_SIZE }}
//                     data={infiniteData}
//                     keyExtractor={(item, index) => `${item.id}-${index}`}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     snapToInterval={ITEM_SIZE}
//                     decelerationRate="fast"
//                     bounces={false}
//                     renderItem={renderItem}
//                     onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
//                     onMomentumScrollEnd={(ev) => {
//                         let index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
//                         if (index === 0) index = musicLibrary.length;
//                         else if (index === musicLibrary.length + 1) index = 1;
//                         flatListRef.current?.scrollToIndex({ index, animated: false });
//                         setCurrentIndex(index);
//                     }}
//                     scrollEventThrottle={16}
//                     getItemLayout={(data, index) => ({ length: ITEM_SIZE, offset: ITEM_SIZE * index, index })}
//                 />

//                 {musicLibrary[currentIndex - 1] && (
//                     <View style={styles.trackInfo}>
//                         <Text style={styles.trackTitle}>{musicLibrary[currentIndex - 1].title}</Text>
//                         <Text style={styles.trackArtist}>{musicLibrary[currentIndex - 1].artist}</Text>
//                         <Text style={styles.trackAlbum}>{musicLibrary[currentIndex - 1].album}</Text>
//                     </View>
//                 )}

//                 <View style={styles.progressContainer}>
//                     <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
//                     <TouchableOpacity style={styles.progressBar} onPress={(e) => handleSeek(e.nativeEvent.locationX / (width - 100))} activeOpacity={1}>
//                         <View style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]} />
//                     </TouchableOpacity>
//                     <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                 </View>

//                 <View style={styles.controls}>
//                     <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
//                         <Image source={musicImages.previous} style={styles.controlIcon} />
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
//                         <Image source={isPlaying ? musicImages.pause : musicImages.play} style={styles.playIcon} />
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
//                         <Image source={musicImages.next} style={styles.controlIcon} />
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     scrollContainer: { flexGrow: 1, justifyContent: "center", paddingVertical: 40 },
//     albumContainer: {
//         marginTop: 20,
//         borderRadius: 20,
//         overflow: "hidden",
//         alignItems: "center",
//         justifyContent: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.5,
//         shadowRadius: 15,
//         shadowOffset: { width: 0, height: 5 },
//         elevation: 10,
//         width: ITEM_SIZE * 0.9,
//         height: ITEM_SIZE * 0.9,
//         alignSelf: "center",
//     },
//     albumArt: { width: "100%", height: "100%", borderRadius: 20, zIndex: 2, backgroundColor: '#1a0a0e' },
//     vinyl: { position: "absolute", width: "100%", height: "100%", borderRadius: 20, backgroundColor: "#1a0a0e", borderWidth: 10, borderColor: "#32151d", zIndex: 1 },
//     trackInfo: { alignItems: "center", marginVertical: 25, paddingHorizontal: 20 },
//     trackTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 5, textAlign: 'center' },
//     trackArtist: { fontSize: 16, color: "#e6b8c1", marginBottom: 3, textAlign: 'center' },
//     trackAlbum: { fontSize: 14, color: "#e6b8c1", opacity: 0.8, textAlign: 'center' },
//     progressContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 30 },
//     progressBar: { flex: 1, height: 4, backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 2, marginHorizontal: 10, overflow: "hidden" },
//     progress: { height: "100%", backgroundColor: "#e6b8c1", borderRadius: 2 },
//     timeText: { color: "#e6b8c1", fontSize: 12, minWidth: 40, textAlign: "center" },
//     controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30 },
//     controlButton: { padding: 15 },
//     controlIcon: { width: 30, height: 30, tintColor: "#fff" },
//     playButton: { backgroundColor: "#fff", width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", marginHorizontal: 25, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
//     playIcon: { width: 30, height: 30, tintColor: "#5a2432" },
// });

// export default MusicCarousel;

import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Image,
    TouchableOpacity,
    ScrollView,
    Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Sound from "react-native-sound";
import { musicImages } from "../../images";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.7;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const musicLibrary = [
    {
        id: 1,
        url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
        title: 'Happy Rock',
        artist: 'Benjamin Tissot',
        album: "Bensound's rock",
        genre: 'Rock',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg',
        duration: 105,
    },
    {
        id: 2,
        url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3',
        title: 'Punky',
        artist: 'Benjamin Tissot',
        album: "Bensound's rock",
        genre: 'Rock',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/punky.jpg',
        duration: 126,
    },
    {
        id: 3,
        url: 'https://www.bensound.com/bensound-music/bensound-actionable.mp3',
        title: 'Actionable',
        artist: 'Benjamin Tissot',
        album: "Bensound's rock",
        genre: 'Rock',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/actionable.jpg',
        duration: 122,
    },
    {
        id: 4,
        url: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
        title: 'Romantic',
        artist: 'Benjamin Tissot',
        album: "Bensound's Jazz",
        genre: 'Jazz',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/romantic.jpg',
        duration: 236,
    },
    {
        id: 5,
        url: 'https://www.bensound.com/bensound-music/bensound-allthat.mp3',
        title: 'All That',
        artist: 'Benjamin Tissot',
        album: "Bensound's Jazz",
        genre: 'Jazz',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/allthat.jpg',
        duration: 146,
    },
    {
        id: 6,
        url: 'https://www.bensound.com/bensound-music/bensound-love.mp3',
        title: 'Love',
        artist: 'Benjamin Tissot',
        album: "Bensound's Jazz",
        genre: 'Jazz',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/love.jpg',
        duration: 335,
    },
    {
        id: 7,
        url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
        title: 'Dreams',
        artist: 'Benjamin Tissot',
        album: "Bensound's Electronica",
        genre: 'Electronica',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/dreams.jpg',
        duration: 310,
    },
    {
        id: 8,
        url: 'https://www.bensound.com/bensound-music/bensound-dance.mp3',
        title: 'Dance',
        artist: 'Benjamin Tissot',
        album: "Bensound's Electronica",
        genre: 'Electronica',
        date: '2014-05-20T07:00:00+00:00',
        artwork: 'https://www.bensound.com/bensound-img/dance.jpg',
        duration: 177,
    },
];

Sound.setCategory("Playback");

const MusicCarousel = () => {
    const flatListRef = useRef<Animated.FlatList<any>>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const infiniteData = [
        musicLibrary[musicLibrary.length - 1],
        ...musicLibrary,
        musicLibrary[0],
    ];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSound, setCurrentSound] = useState<Sound | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false); // ✅ NEW

    useEffect(() => {
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, []);

    const startProgressTimer = (sound: Sound) => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            sound.getCurrentTime((seconds) => setCurrentTime(seconds));
        }, 1000);
    };

    useEffect(() => {
        if (isPlaying) {
            Animated.loop(
                Animated.timing(rotateValue, {
                    toValue: 1,
                    duration: 5000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateValue.stopAnimation();
            rotateValue.setValue(0);
        }
    }, [isPlaying]);

    const onEnd = (success: boolean) => {
        if (success) handleNext();
        setIsPlaying(true);
    };

    // 🔥 Load track
    useEffect(() => {
        const track = musicLibrary[currentIndex - 1];
        if (!track?.url) return;

        setCurrentTime(0);
        setIsReady(false);

        if (currentSound) {
            currentSound.stop();
            currentSound.release();
        }
        if (progressInterval.current) clearInterval(progressInterval.current);

        const sound = new Sound(track.url, null, (error) => {
            if (error) return console.log("Failed to load sound", error);
            setDuration(sound.getDuration());
            setIsReady(true); // ✅ mark as ready

            // If user already pressed play before ready, start now
            if (isPlaying) {
                sound.play(onEnd);
                startProgressTimer(sound);
            }
        });

        setCurrentSound(sound);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            sound.release();
        };
    }, [currentIndex]);

    // 🔥 Control play/pause when sound + isReady
    useEffect(() => {
        if (!currentSound || !isReady) return;
        if (isPlaying) {
            currentSound.play(onEnd);
            startProgressTimer(currentSound);
        } else {
            currentSound.pause();
            if (progressInterval.current) clearInterval(progressInterval.current);
        }
    }, [isPlaying, currentSound, isReady]);

    const handlePlayPause = () => setIsPlaying((prev) => !prev);

    const handleNext = () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex > musicLibrary.length) {
            nextIndex = 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: false });
        } else {
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
        setCurrentIndex(nextIndex);
    };

    const handlePrevious = () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex === 0) {
            prevIndex = musicLibrary.length;
            flatListRef.current?.scrollToIndex({ index: prevIndex, animated: false });
        } else {
            flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
        }
        setCurrentIndex(prevIndex);
    };

    const handleSeek = (percentage: number) => {
        if (currentSound) {
            const newPosition = duration * percentage;
            currentSound.setCurrentTime(newPosition);
            setCurrentTime(newPosition);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const renderItem = ({ item, index }) => {
        const inputRange = [(index - 1) * ITEM_SIZE, index * ITEM_SIZE, (index + 1) * ITEM_SIZE];

        const scale = scrollX.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: "clamp" });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: "clamp" });
        const translateX = scrollX.interpolate({ inputRange, outputRange: [-ITEM_SIZE * 0.1, 0, ITEM_SIZE * 0.1], extrapolate: 'clamp' });
        const rotateY = scrollX.interpolate({ inputRange, outputRange: ["20deg", "0deg", "-20deg"], extrapolate: "clamp" });

        const isCurrent = index === currentIndex;

        return (
            <View style={{ width: ITEM_SIZE }}>
                <Animated.View style={[styles.albumContainer, { transform: [{ perspective: ITEM_SIZE }, { translateX }, { rotateY }, { scale }], opacity }]}>
                    <Image source={{ uri: item.artwork }} style={styles.albumArt} resizeMode="cover" />
                    {isCurrent && (
                        <Animated.View style={[styles.vinyl, { transform: [{ rotate: rotateValue.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]} />
                    )}
                </Animated.View>
            </View>
        );
    };

    return (
        <LinearGradient colors={["#2c0c16", "#5a2432", "#8a3a4f"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={[styles.trackTitle, { textAlign: "center" }]}>Groove</Text>

                <Animated.FlatList
                    ref={flatListRef}
                    contentContainerStyle={{ alignItems: 'center', paddingHorizontal: SPACER_ITEM_SIZE }}
                    data={infiniteData}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={ITEM_SIZE}
                    decelerationRate="fast"
                    bounces={false}
                    renderItem={renderItem}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                    onMomentumScrollEnd={(ev) => {
                        let index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
                        if (index === 0) index = musicLibrary.length;
                        else if (index === musicLibrary.length + 1) index = 1;
                        flatListRef.current?.scrollToIndex({ index, animated: false });
                        setCurrentIndex(index);
                    }}
                    scrollEventThrottle={16}
                    getItemLayout={(data, index) => ({ length: ITEM_SIZE, offset: ITEM_SIZE * index, index })}
                />

                {musicLibrary[currentIndex - 1] && (
                    <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle}>{musicLibrary[currentIndex - 1].title}</Text>
                        <Text style={styles.trackArtist}>{musicLibrary[currentIndex - 1].artist}</Text>
                        <Text style={styles.trackAlbum}>{musicLibrary[currentIndex - 1].album}</Text>
                        {!isReady && <Text style={{ color: "#e6b8c1", marginTop: 5 }}>Loading...</Text>}
                    </View>
                )}

                <View style={styles.progressContainer}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <TouchableOpacity style={styles.progressBar} onPress={(e) => handleSeek(e.nativeEvent.locationX / (width - 100))} activeOpacity={1}>
                        <View style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]} />
                    </TouchableOpacity>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
                        <Image source={musicImages.previous} style={styles.controlIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePlayPause} style={styles.playButton} disabled={!isReady}>
                        <Image source={isPlaying ? musicImages.pause : musicImages.play} style={styles.playIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
                        <Image source={musicImages.next} style={styles.controlIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: "center", paddingVertical: 40 },
    albumContainer: {
        marginTop: 20,
        borderRadius: 20,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 5 },
        elevation: 10,
        width: ITEM_SIZE * 0.9,
        height: ITEM_SIZE * 0.9,
        alignSelf: "center",
    },
    albumArt: { width: "100%", height: "100%", borderRadius: 20, zIndex: 2, backgroundColor: '#1a0a0e' },
    vinyl: { position: "absolute", width: "100%", height: "100%", borderRadius: 20, backgroundColor: "#1a0a0e", borderWidth: 10, borderColor: "#32151d", zIndex: 1 },
    trackInfo: { alignItems: "center", marginVertical: 25, paddingHorizontal: 20 },
    trackTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 5, textAlign: 'center' },
    trackArtist: { fontSize: 16, color: "#e6b8c1", marginBottom: 3, textAlign: 'center' },
    trackAlbum: { fontSize: 14, color: "#e6b8c1", opacity: 0.8, textAlign: 'center' },
    progressContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 30 },
    progressBar: { flex: 1, height: 4, backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 2, marginHorizontal: 10, overflow: "hidden" },
    progress: { height: "100%", backgroundColor: "#e6b8c1", borderRadius: 2 },
    timeText: { color: "#e6b8c1", fontSize: 12, minWidth: 40, textAlign: "center" },
    controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30 },
    controlButton: { padding: 15 },
    controlIcon: { width: 30, height: 30, tintColor: "#fff" },
    playButton: { backgroundColor: "#fff", width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", marginHorizontal: 25, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
    playIcon: { width: 30, height: 30, tintColor: "#5a2432" },
});

export default MusicCarousel;
