import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mock theme context
const mockTheme = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

// Mock theme context provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test utilities
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

export const createMockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

export const createMockTheme = (overrides = {}) => ({
  ...mockTheme,
  ...overrides,
});

// Async utilities
export const waitFor = (callback: () => void, options = {}) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for callback'));
    }, 1000);

    const check = () => {
      try {
        callback();
        clearTimeout(timeout);
        resolve(undefined);
      } catch (error) {
        setTimeout(check, 10);
      }
    };

    check();
  });
};

// Mock functions
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Test data factories
export const TestDataFactory = {
  user: createMockUser,
  theme: createMockTheme,
  navigation: createMockNavigation,
  route: createMockRoute,
};

// Simple test to ensure the file is valid
describe('Test Utils', () => {
  it('should export test utilities', () => {
    expect(TestDataFactory).toBeDefined();
    expect(createMockUser).toBeDefined();
    expect(createMockTheme).toBeDefined();
  });
});
