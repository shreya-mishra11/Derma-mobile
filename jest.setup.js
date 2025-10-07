// Minimal Jest setup
// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock react-native with react-native-web to avoid native modules in Jest
jest.mock('react-native', () => {
  const RNWeb = jest.requireActual('react-native-web');
  return {
    ...RNWeb,
    Platform: {
      OS: 'ios',
      select: (obj) => (obj && (obj.ios ?? obj.default)),
    },
    StyleSheet: { 
      create: (styles) => styles,
      flatten: (styles) => Array.isArray(styles) ? Object.assign({}, ...styles) : styles,
    },
  };
});

// Mock safe-area context to avoid native dependency
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock gesture handler for tests
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
}));

// Mock expo vector icons to avoid ESM issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props) => null,
}));
