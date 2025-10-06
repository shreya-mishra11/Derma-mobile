import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image?: string;
  onPress?: (id: string) => void;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  onPress 
}: ProductCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(id)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <ThemedView style={styles.placeholderImage}>
              <ThemedText style={styles.placeholderText}>IMG</ThemedText>
            </ThemedView>
          )}
        </View>
        <ThemedText style={styles.name} numberOfLines={2}>
          {name}
        </ThemedText>
        <ThemedText style={styles.price}>
          {price}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#279989',
  },
});
