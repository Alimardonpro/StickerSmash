import AsyncStorage from '@react-native-async-storage/async-storage';

export type CreationItem = {
  id: string;
  uri: string;
  createdAt: number;
  stickersCount: number;
  title?: string;
};

const STORAGE_KEY = '@sticker_smash_creations';

export async function getSavedCreations(): Promise<CreationItem[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load creations', e);
    return [];
  }
}

export async function saveCreation(item: Omit<CreationItem, 'id' | 'createdAt'>): Promise<CreationItem> {
  try {
    const existing = await getSavedCreations();
    const newItem: CreationItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    const updated = [newItem, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error('Failed to save creation', e);
    throw e;
  }
}

export async function deleteCreation(id: string): Promise<void> {
  try {
    const existing = await getSavedCreations();
    const updated = existing.filter(c => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete creation', e);
  }
}

