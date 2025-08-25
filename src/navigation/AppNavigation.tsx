import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import MusicApp from '../screens/music/MusicApp';
import TodoApp from '../screens/todo/TodoApp';
import { musicAppColors } from '../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="SplashScreen"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationDuration: 300,
                }}
            >
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen
                    name="Groove"
                    component={MusicApp}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Groove" />
                    }}
                />
                <Stack.Screen
                    name="Notes"
                    component={TodoApp}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Notes" />
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets(); // Get safe area insets

    const isMusicScreen = route.name === 'Groove';
    const targetScreen = isMusicScreen ? 'Notes' : 'Groove';
    const buttonText = isMusicScreen ? 'Go to Notes' : 'Go to Music';

    const handleSwitch = () => {
        navigation.navigate(targetScreen as never);
    };

    return (
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity
                style={styles.switchButton}
                onPress={handleSwitch}
                activeOpacity={0.7}
            >
                <Text style={styles.switchButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: musicAppColors.background,
        borderBottomWidth: 1,
        borderBottomColor: musicAppColors.textSecondary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: musicAppColors.textPrimary,
    },
    switchButton: {
        backgroundColor: musicAppColors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    switchButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: musicAppColors.textPrimary,
    },
});