import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { renderHook } from '@testing-library/react-native';

// Mock the useColorScheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light theme color when theme is light', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe(Colors.light.text);
  });

  it('returns dark theme color when theme is dark', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe(Colors.dark.text);
  });

  it('returns light theme color when theme is null', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue(null);

    const { result } = renderHook(() =>
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe(Colors.light.text);
  });

  it('returns custom light color when provided', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const customLightColor = '#FF0000';
    const { result } = renderHook(() =>
      useThemeColor({ light: customLightColor }, 'text')
    );

    expect(result.current).toBe(customLightColor);
  });

  it('returns custom dark color when provided', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('dark');

    const customDarkColor = '#00FF00';
    const { result } = renderHook(() =>
      useThemeColor({ dark: customDarkColor }, 'text')
    );

    expect(result.current).toBe(customDarkColor);
  });

  it('returns theme color when custom color is not provided for current theme', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ dark: '#00FF00' }, 'background')
    );

    expect(result.current).toBe(Colors.light.background);
  });

  it('works with different color names', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const colorNames: (keyof typeof Colors.light)[] = [
      'text', 'background', 'tint', 'icon', 'tabIconDefault', 'tabIconSelected'
    ];

    colorNames.forEach(colorName => {
      const { result } = renderHook(() =>
        useThemeColor({}, colorName)
      );

      expect(result.current).toBe(Colors.light[colorName]);
    });
  });

  it('prioritizes custom colors over theme colors', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('dark');

    const customLightColor = '#FF0000';
    const customDarkColor = '#00FF00';
    
    const { result } = renderHook(() =>
      useThemeColor({ 
        light: customLightColor, 
        dark: customDarkColor 
      }, 'text')
    );

    expect(result.current).toBe(customDarkColor);
  });
});
