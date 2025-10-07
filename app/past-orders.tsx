import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOrders } from '@/app/api/react-query/orders';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Orders will be fetched via API

export default function PastOrdersScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = useOrders();
  const orders = data?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#28a745';
      case 'Shipped':
        return '#007bff';
      case 'Processing':
        return '#ffc107';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'checkmark-circle';
      case 'Shipped':
        return 'car';
      case 'Processing':
        return 'time';
      case 'Cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderId}>Order #{item.orderId ?? item.id}</ThemedText>
          <ThemedText style={styles.orderDate}>{item.createdAt?.slice(0,10) ?? item.date}</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.itemsSection}>
        <ThemedText style={styles.itemsTitle}>Items ({item.items?.length ?? 0})</ThemedText>
        {item.items?.map((orderItem: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <ThemedText style={styles.itemName} numberOfLines={1}>
              {orderItem.name ?? `#${orderItem.productId}`}
            </ThemedText>
            <View style={styles.itemDetails}>
              <ThemedText style={styles.itemQuantity}>Qty: {orderItem.quantity}</ThemedText>
              <ThemedText style={styles.itemPrice}>INR {orderItem.price}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <ThemedText style={styles.totalLabel}>Total Amount</ThemedText>
        <ThemedText style={styles.totalAmount}>INR {item.totalAmount}</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={Platform.OS === 'android'}
      />

      {/* Header */}
      <ThemedView style={[
        styles.header,
        { paddingTop: Platform.OS === 'ios' ? insets.top + 10 : 20 }
      ]}>
        <ThemedText style={styles.headerTitle}>Past Orders</ThemedText>
        {isLoading ? (
          <ThemedText style={styles.headerSubtitle}>Loading orders...</ThemedText>
        ) : error ? (
          <ThemedText style={styles.headerSubtitle}>Failed to load orders</ThemedText>
        ) : (
          <ThemedText style={styles.headerSubtitle}>
            {orders.length} orders found
          </ThemedText>
        )}
      </ThemedView>

      {/* Orders List */}
      {isLoading ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="time-outline" size={24} color="#999" />
          <ThemedText style={styles.emptyStateSubtitle}>Loading...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="warning-outline" size={24} color="#ff4444" />
          <ThemedText style={styles.emptyStateTitle}>Failed to load orders</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => (item.orderId ?? item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.ordersList,
            { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20 }
          ]}
          ListEmptyComponent={() => (
            <ThemedView style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#ccc" />
              <ThemedText style={styles.emptyStateTitle}>No Orders Yet</ThemedText>
              <ThemedText style={styles.emptyStateSubtitle}>
                Your past orders will appear here
              </ThemedText>
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#279989',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#279989',
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#279989',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
