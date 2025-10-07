import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export function QuantityControls({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 1,
  maxQuantity = 99,
}: QuantityControlsProps) {
  const canDecrement = quantity > minQuantity;
  const canIncrement = quantity < maxQuantity;

  return (
    <View style={styles.container} testID="quantityControls">
      <TouchableOpacity
        style={[styles.button, !canDecrement && styles.disabledButton]}
        onPress={onDecrement}
        disabled={!canDecrement}
        activeOpacity={0.7}
        testID="decrementButton"
        accessibilityLabel="decrement"
      >
        <ThemedText style={[styles.buttonText, !canDecrement && styles.disabledText]}>
          −
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.quantityContainer} testID="quantityValue">
        <ThemedText style={styles.quantityText}>{String(quantity)}</ThemedText>
      </View>

      <TouchableOpacity
        style={[styles.button, !canIncrement && styles.disabledButton]}
        onPress={onIncrement}
        disabled={!canIncrement}
        activeOpacity={0.7}
        testID="incrementButton"
        accessibilityLabel="increment"
      >
        <ThemedText style={[styles.buttonText, !canIncrement && styles.disabledText]}>
          +
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#279989',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#adb5bd',
  },
  quantityContainer: {
    minWidth: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
