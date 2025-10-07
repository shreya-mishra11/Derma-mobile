import { Colors, Fonts } from '@/constants/theme';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(),
  },
}));

describe('Theme Constants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Colors', () => {
    it('has light theme colors', () => {
      expect(Colors.light).toEqual({
        text: '#11181C',
        background: '#fff',
        tint: '#0a7ea4',
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: '#0a7ea4',
      });
    });

    it('has dark theme colors', () => {
      expect(Colors.dark).toEqual({
        text: '#ECEDEE',
        background: '#151718',
        tint: '#fff',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#fff',
      });
    });

    it('has consistent color structure between light and dark themes', () => {
      const lightKeys = Object.keys(Colors.light);
      const darkKeys = Object.keys(Colors.dark);
      
      expect(lightKeys).toEqual(darkKeys);
    });
  });

  describe('Fonts', () => {
    it('has all required font types', () => {
      const fontTypes = ['sans', 'serif', 'rounded', 'mono'];
      fontTypes.forEach(type => {
        expect(Fonts).toHaveProperty(type);
        expect(typeof Fonts[type as keyof typeof Fonts]).toBe('string');
      });
    });
  });

  describe('Color Values', () => {
    it('has valid hex color values for light theme', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{3,6}$/;
      
      Object.values(Colors.light).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('has valid hex color values for dark theme', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{3,6}$/;
      
      Object.values(Colors.dark).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('has different colors for light and dark themes', () => {
      expect(Colors.light.text).not.toBe(Colors.dark.text);
      expect(Colors.light.background).not.toBe(Colors.dark.background);
      expect(Colors.light.tint).not.toBe(Colors.dark.tint);
    });
  });
});
