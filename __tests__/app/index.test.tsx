import HomeScreen from '@/app/(tabs)/index';
import React from 'react';
import { Platform } from 'react-native';
import { render, screen } from '../utils/test-utils';

// Mock the components
jest.mock('@/components/hello-wave', () => ({
  HelloWave: () => null,
}));

jest.mock('@/components/parallax-scroll-view', () => {
  const { View } = require('react-native');
  return ({ children, ...props }: any) => <View {...props}>{children}</View>;
});

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => {
    const { View, Text } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: ({ ...props }: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome title', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Welcome!')).toBeTruthy();
  });

  it('renders step 1 content', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Step 1: Try it')).toBeTruthy();
    expect(screen.getByText(/Edit.*app\/\(tabs\)\/index\.tsx.*to see changes/)).toBeTruthy();
  });

  it('renders step 2 content', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Step 2: Explore')).toBeTruthy();
    expect(screen.getByText(/Tap the Explore tab to learn more/)).toBeTruthy();
  });

  it('renders step 3 content', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Step 3: Get a fresh start')).toBeTruthy();
    expect(screen.getByText(/When you're ready, run/)).toBeTruthy();
  });

  it('shows correct platform-specific developer tools shortcut', () => {
    const originalPlatform = Platform.select;
    
    // Test iOS
    Platform.select = jest.fn((options) => options.ios);
    render(<HomeScreen />);
    expect(screen.getByText('cmd + d')).toBeTruthy();
    
    // Test Android
    Platform.select = jest.fn((options) => options.android);
    render(<HomeScreen />);
    expect(screen.getByText('cmd + m')).toBeTruthy();
    
    // Test Web
    Platform.select = jest.fn((options) => options.web);
    render(<HomeScreen />);
    expect(screen.getByText('F12')).toBeTruthy();
    
    // Restore original Platform.select
    Platform.select = originalPlatform;
  });

  it('renders all step containers', () => {
    render(<HomeScreen />);
    
    // Check that all three steps are rendered
    expect(screen.getByText('Step 1: Try it')).toBeTruthy();
    expect(screen.getByText('Step 2: Explore')).toBeTruthy();
    expect(screen.getByText('Step 3: Get a fresh start')).toBeTruthy();
  });

  it('renders reset project command', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('npm run reset-project')).toBeTruthy();
  });

  it('renders file references correctly', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('app/(tabs)/index.tsx')).toBeTruthy();
    expect(screen.getByText('app')).toBeTruthy();
    expect(screen.getByText('app-example')).toBeTruthy();
  });
});
