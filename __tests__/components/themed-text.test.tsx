import React from 'react';
import { ThemedText } from '../../components/themed-text';
import { render, screen } from '../utils/test-utils';

// Mock the useThemeColor hook
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#11181C'),
}));

describe('ThemedText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text with default type', () => {
    render(<ThemedText>Hello World</ThemedText>);
    
    const textElement = screen.getByText('Hello World');
    expect(textElement).toBeTruthy();
  });

  it('renders text with title type', () => {
    render(<ThemedText type="title">Title Text</ThemedText>);
    
    const textElement = screen.getByText('Title Text');
    expect(textElement).toBeTruthy();
  });

  it('renders text with subtitle type', () => {
    render(<ThemedText type="subtitle">Subtitle Text</ThemedText>);
    
    const textElement = screen.getByText('Subtitle Text');
    expect(textElement).toBeTruthy();
  });

  it('renders text with link type', () => {
    render(<ThemedText type="link">Link Text</ThemedText>);
    
    const textElement = screen.getByText('Link Text');
    expect(textElement).toBeTruthy();
  });

  it('renders text with defaultSemiBold type', () => {
    render(<ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>);
    
    const textElement = screen.getByText('SemiBold Text');
    expect(textElement).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { fontSize: 20, color: 'red' };
    render(<ThemedText style={customStyle}>Custom Style</ThemedText>);
    
    const textElement = screen.getByText('Custom Style');
    expect(textElement).toBeTruthy();
  });

  it('passes through other props', () => {
    render(<ThemedText testID="test-text" accessibilityLabel="Test Text">Test</ThemedText>);
    
    const textElement = screen.getByTestId('test-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.accessibilityLabel).toBe('Test Text');
  });

  it('calls useThemeColor with correct parameters', () => {
    const { useThemeColor } = require('@/hooks/use-theme-color');
    
    render(
      <ThemedText lightColor="#000000" darkColor="#FFFFFF">
        Themed Text
      </ThemedText>
    );
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#000000', dark: '#FFFFFF' },
      'text'
    );
  });
});
