import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  currency: string;
  image?: string;
  rating?: number;
  discount?: number;
  onPress?: (id: number) => void;
  onAddToCart?: (id: number) => void;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  currency,
  image, 
  rating,
  discount,
  onPress,
  onAddToCart
}: ProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(id)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card}>
        <View style={styles.imageContainer}>
          {image && !hasImageError ? (
            <Image 
              source={{ uri: image }} 
              style={styles.image} 
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ThemedView style={styles.placeholderImage}>
              <ThemedText style={styles.placeholderText}>IMG</ThemedText>
            </ThemedView>
          )}
        </View>
        <ThemedText style={styles.name} numberOfLines={2}>
          {name}
        </ThemedText>
        
        {rating && (
          <ThemedText style={styles.rating}>
            ⭐ {rating.toFixed(1)}
          </ThemedText>
        )}
        
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>
            {currency} {discount ? Math.round(price * (1 - discount / 100)) : price}
          </ThemedText>
          <View>
          {discount && discount > 0 && (
            <ThemedText style={styles.originalPrice}>
              {currency} {price}
            </ThemedText>
          )}
          </View>
        
        </View>
        
        {onAddToCart && (
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => onAddToCart(id)}
          >
            <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
          </TouchableOpacity>
        )}
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
    minHeight: 230,
    justifyContent: 'space-between',
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
    lineHeight: 18,
    minHeight: 36, // reserve space for 2 lines
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#279989',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    minHeight: 16,
  },
  addToCartButton: {
    backgroundColor: '#279989',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
