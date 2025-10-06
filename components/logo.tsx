import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ size = 'medium' }: LogoProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { mainText: 16, smallText: 10, crossSize: 12 };
      case 'large':
        return { mainText: 32, smallText: 16, crossSize: 20 };
      default:
        return { mainText: 24, smallText: 12, crossSize: 16 };
    }
  };

  const { mainText, smallText, crossSize } = getSizeStyles();

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.theText, { fontSize: smallText }]}>THE</ThemedText>
      <ThemedText style={[styles.dermaText, { fontSize: mainText }]}>derma</ThemedText>
      <View style={[styles.crossContainer, { width: crossSize, height: crossSize }]}>
        <View style={[styles.crossHorizontal, { height: crossSize * 0.3 }]} />
        <View style={[styles.crossVertical, { width: crossSize * 0.3 }]} />
        <ThemedText style={[styles.coText, { fontSize: smallText }]}>co</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  theText: {
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
    letterSpacing: 1,
  },
  dermaText: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 2,
  },
  crossContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossHorizontal: {
    position: 'absolute',
    backgroundColor: '#4db6ac',
    borderRadius: 2,
    width: '100%',
  },
  crossVertical: {
    position: 'absolute',
    backgroundColor: '#279989',
    borderRadius: 2,
    height: '100%',
  },
  coText: {
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 1,
  },
});
