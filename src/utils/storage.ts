const STORAGE_PREFIX = 'budget-tracker';

export const StorageKeys = {
  BUDGET: `${STORAGE_PREFIX}-budget`,
  EXPENSES: `${STORAGE_PREFIX}-expenses`,
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}
