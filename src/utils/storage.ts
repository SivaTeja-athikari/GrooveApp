import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage

export const storeInAsyncStorage = async (key: string, value: string): Promise<boolean> => {
    console.log("thisicalsldsladlsa", key, value)
    try {
        await AsyncStorage.setItem(key, value);
        console.log(`Stored ${key} => ${value} successfully in AsyncStorage.`);
        return true;
    } catch (error) {
        console.error(`Failed to store ${key} in AsyncStorage:`, error);
        return false;
    }
};

export const getFromAsyncStorage = async (key: string): Promise<string | false> => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log(`Retrieved ${key} successfully from AsyncStorage.`);
            return value;
        }
        console.log(`${key} not found in AsyncStorage.`);
        return false;
    } catch (error) {
        console.error(`Failed to retrieve ${key} from AsyncStorage:`, error);
        return false;
    }
};

export const deleteFromAsyncStorage = async (key: string): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`Deleted ${key} successfully from AsyncStorage.`);
        return true;
    } catch (error) {
        console.error(`Failed to delete ${key} from AsyncStorage:`, error);
        return false;
    }
};
export const deleteAllKeys = async () => {
    const keys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(keys)
}
export const getAllStorageItems = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const keyValuePairs = await AsyncStorage.multiGet(keys);
        keyValuePairs.forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
        return keyValuePairs;
    } catch (error) {
        console.error('Error reading AsyncStorage:', error);
    }
};