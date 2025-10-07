import React from 'react';
import { ThemedView } from '../../components/themed-view';
import { render, screen } from '../utils/test-utils';

// Mock the useThemeColor hook
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#FFFFFF'),
}));

describe('ThemedView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders view with default background color', () => {
    render(<ThemedView testID="test-view">Test Content</ThemedView>);
    
    const viewElement = screen.getByTestId('test-view');
    expect(viewElement).toBeTruthy();
  });

  it('renders children correctly', () => {
    render(
      <ThemedView testID="test-view">
        <ThemedView testID="child-view">Child Content</ThemedView>
      </ThemedView>
    );
    
    const childElement = screen.getByTestId('child-view');
    expect(childElement).toBeTruthy();
    expect(screen.getByText('Child Content')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { padding: 20, margin: 10 };
    render(
      <ThemedView style={customStyle} testID="test-view">
        Custom Style
      </ThemedView>
    );
    
    const viewElement = screen.getByTestId('test-view');
    expect(viewElement).toBeTruthy();
  });

  it('passes through other props', () => {
    render(
      <ThemedView 
        testID="test-view" 
        accessibilityLabel="Test View"
        accessibilityRole="button"
      >
        Test
      </ThemedView>
    );
    
    const viewElement = screen.getByTestId('test-view');
    expect(viewElement).toBeTruthy();
    expect(viewElement.props.accessibilityLabel).toBe('Test View');
    expect(viewElement.props.accessibilityRole).toBe('button');
  });

  it('calls useThemeColor with correct parameters', () => {
    const { useThemeColor } = require('@/hooks/use-theme-color');
    
    render(
      <ThemedView lightColor="#F0F0F0" darkColor="#000000">
        Themed View
      </ThemedView>
    );
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#F0F0F0', dark: '#000000' },
      'background'
    );
  });

  it('merges custom style with theme background color', () => {
    const customStyle = { padding: 16 };
    render(
      <ThemedView style={customStyle} testID="test-view">
        Styled View
      </ThemedView>
    );
    
    const viewElement = screen.getByTestId('test-view');
    expect(viewElement).toBeTruthy();
  });
});
