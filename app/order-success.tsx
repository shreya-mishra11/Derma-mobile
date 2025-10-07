import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OrderSuccessScreen() {
  const { orderId, totalAmount } = useLocalSearchParams<{
    orderId?: string;
    totalAmount?: string;
  }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleDone = () => {
    // Navigate to home page
    router.push('/');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={Platform.OS === 'android'}
      />

      <View style={[
        styles.content,
        { paddingTop: Platform.OS === 'ios' ? insets.top + 40 : 60 }
      ]}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#28a745" />
        </View>

        {/* Success Message */}
        <ThemedText style={styles.title}>Order Placed Successfully!</ThemedText>
        <ThemedText style={styles.subtitle}>
          Thank you for your purchase. Your order has been confirmed.
        </ThemedText>

        {/* Order Details */}
        {orderId && (
          <View style={styles.orderDetails}>
            <ThemedText style={styles.orderIdLabel}>Order ID</ThemedText>
            <ThemedText style={styles.orderIdValue}>#{orderId}</ThemedText>
          </View>
        )}

        {totalAmount && (
          <View style={styles.orderDetails}>
            <ThemedText style={styles.orderIdLabel}>Total Amount</ThemedText>
            <ThemedText style={styles.totalAmountValue}>INR {totalAmount}</ThemedText>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              Order confirmation sent to your email
            </ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              Estimated delivery: 2-3 business days
            </ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              Track your order in Past Orders
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
          >
            <ThemedText style={styles.doneButtonText}>Done</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/past-orders')}
          >
            <Ionicons name="receipt-outline" size={20} color="#279989" />
            <ThemedText style={styles.secondaryButtonText}>View Orders</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  orderDetails: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderIdValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#279989',
  },
  infoContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 40,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  doneButton: {
    backgroundColor: '#279989',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#279989',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#279989',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
