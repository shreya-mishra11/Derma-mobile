let currentCartId: string | null = null;
let hasTriedHydrate = false;

// Optional AsyncStorage support (no-op in tests/web)
let AsyncStorage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {}

const STORAGE_KEY = 'dermatouch.cartId';

export const getCartId = () => currentCartId;

export const setCartId = (id?: string | null) => {
  if (id) {
    currentCartId = String(id);
    if (AsyncStorage) {
      AsyncStorage.setItem(STORAGE_KEY, String(id)).catch(() => {});
    }
  }
};

export const clearCartId = () => {
  currentCartId = null;
  if (AsyncStorage) {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }
};

export const hydrateCartIdIfNeeded = async () => {
  if (hasTriedHydrate) return currentCartId;
  hasTriedHydrate = true;
  if (!AsyncStorage) return currentCartId;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) currentCartId = stored;
  } catch {}
  return currentCartId;
};

