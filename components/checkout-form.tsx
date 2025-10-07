import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CheckoutFormProps {
  totalAmount: number;
  onProceed: (customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }, paymentMethod: 'cash' | 'card' | 'upi') => void;
  isLoading?: boolean;
}

export function CheckoutForm({ totalAmount, onProceed, isLoading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('upi');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone must be 10 digits';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (!validateForm()) {
      onProceed(formData, paymentMethod);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.form}>
        {/* <ThemedText style={styles.sectionTitle}>Customer Information</ThemedText>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Full Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email *</ThemedText>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <ThemedText style={styles.errorText}>{errors.email}</ThemedText>}
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Phone Number *</ThemedText>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.phone && <ThemedText style={styles.errorText}>{errors.phone}</ThemedText>}
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Delivery Address *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, errors.address && styles.inputError]}
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            placeholder="Enter your complete address"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.address && <ThemedText style={styles.errorText}>{errors.address}</ThemedText>}
        </View> */}

        <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
        
        <View style={styles.paymentOptions}>
          {[
            { key: 'upi', label: 'UPI', icon: '📱' },
            { key: 'card', label: 'Card', icon: '💳' },
            { key: 'cash', label: 'Cash on Delivery', icon: '💵' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.paymentOption,
                paymentMethod === option.key && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod(option.key as any)}
            >
              <ThemedText style={styles.paymentIcon}>{option.icon}</ThemedText>
              <ThemedText style={[
                styles.paymentLabel,
                paymentMethod === option.key && styles.paymentLabelSelected
              ]}>
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total Amount</ThemedText>
            <ThemedText style={styles.totalAmount}>INR {totalAmount}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.proceedButton, isLoading && styles.proceedButtonDisabled]}
          onPress={handleProceed}
          disabled={isLoading}
        >
          <ThemedText style={styles.proceedButtonText}>
            {isLoading ? 'Processing...' : 'Proceed to Pay'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  textArea: {
    height: 80,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  paymentOptions: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#279989',
    backgroundColor: '#f0f9f7',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#333',
  },
  paymentLabelSelected: {
    color: '#279989',
    fontWeight: '600',
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#279989',
  },
  proceedButton: {
    backgroundColor: '#279989',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  proceedButtonDisabled: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
