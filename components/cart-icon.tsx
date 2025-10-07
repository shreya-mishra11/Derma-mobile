import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface CartIconProps {
  onPress?: () => void;
  itemCount?: number;
}

export function CartIcon({ onPress, itemCount = 0 }: CartIconProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
      <Ionicons name="cart" size={28} color="#279989" />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{itemCount}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#279989',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
