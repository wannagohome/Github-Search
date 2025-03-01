import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageClient {
  static async save(key: string, value: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save data to storage: ${key}`, error);
      return false;
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load data from storage: ${key}`, error);
      return null;
    }
  }

  static async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data from storage: ${key}`, error);
    }
  }
} 