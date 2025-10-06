import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CategoryButtonProps {
  title: string;
  onPress?: () => void;
  isActive?: boolean;
}

export function CategoryButton({ 
  title, 
  onPress, 
  isActive = false 
}: CategoryButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={[
        styles.button,
        isActive && styles.activeButton
      ]}>
        <ThemedText style={[
          styles.text,
          isActive && styles.activeText
        ]}>
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#279989',
    borderColor: '#279989',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeText: {
    color: '#fff',
  },
});
