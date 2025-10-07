import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/app/api/react-query/cart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const cartItems = data?.data?.items ?? [];


  const handleIncrement = (itemId: string, currentQuantity: number) => {
    updateCartItem.mutate({ itemId, quantity: currentQuantity + 1 });
  };

  const handleDecrement = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem.mutate({ itemId, quantity: currentQuantity - 1 });
    } else {
      // If quantity is 1, remove the item completely
      removeFromCart.mutate({ itemId });
    }
  };

  const handleDelete = (itemId: string) => {
    removeFromCart.mutate({ itemId });
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <CartItem
      product={item.product ?? item}
      quantity={item.quantity ?? 1}
      itemId={item.itemId ?? item.id}
      onIncrement={() => handleIncrement(item.itemId ?? item.id, item.quantity ?? 1)}
      onDecrement={() => handleDecrement(item.itemId ?? item.id, item.quantity ?? 1)}
      onDelete={() => handleDelete(item.itemId ?? item.id)}
    />
  );

  const totalItems = data?.data?.totalItems ?? cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalAmount = data?.data?.totalAmount ?? cartItems.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity ?? 1)), 0);

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={Platform.OS === 'android'}
      />

      {/* Header with notch handling */}
      {/* <ThemedView style={[
        styles.header,
        { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }
      ]}>
        <ThemedText style={styles.headerTitle}>Cart</ThemedText>
      </ThemedView> */}

      {/* Delivery Address Section */}
      {/* <ThemedView style={styles.deliverySection}>
        <View style={styles.deliveryAddressContainer}>
          <ThemedText style={styles.deliveryLabel}>Delivery Address</ThemedText>
          <ThemedText style={styles.deliveryAddress}>
            123 Main Street, City, State 12345
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.changeButton}>
          <ThemedText style={styles.changeText}>change</ThemedText>
        </TouchableOpacity>
      </ThemedView> */}

      {/* Bag Items Section */}
      <ThemedView style={styles.bagSection}>
        <ThemedText style={styles.bagTitle}>
          Bag Items 
        </ThemedText>
        
        {isLoading ? (
          <ThemedView style={styles.emptyCart}>
            <ThemedText style={styles.emptyCartText}>Loading cart...</ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.emptyCart}>
            <ThemedText style={styles.emptyCartText}>Failed to load cart</ThemedText>
          </ThemedView>
        ) : cartItems.length > 0 ? (
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => (item.itemId ?? item.id).toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itemsList}
          />
        ) : (
          <ThemedView style={styles.emptyCart}>
            <ThemedText style={styles.emptyCartText}>Your cart is empty</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      {/* Proceed to Pay Button */}
      {cartItems.length > 0 && (
        <ThemedView style={[
          styles.bottomSection,
          { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20 }
        ]}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalLabel}>Total: INR {totalAmount}</ThemedText>
          </View>
          <TouchableOpacity style={styles.proceedButton}>
            <ThemedText style={styles.proceedButtonText}>Proceed to Pay</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

interface CartItemProps {
  product: any;
  quantity: number;
  itemId: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

function CartItem({ product, quantity, itemId, onIncrement, onDecrement, onDelete }: CartItemProps) {
  return (
    <ThemedView style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.itemImage} />
        ) : (
          <ThemedView style={styles.itemImagePlaceholder}>
            <ThemedText style={styles.placeholderText}>IMG</ThemedText>
          </ThemedView>
        )}
      </View>
      
      <View style={styles.itemDetails}>
        <ThemedText style={styles.itemName} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.itemDescription} numberOfLines={1}>
          {product.description}
        </ThemedText>
        <ThemedText style={styles.itemPrice}>
          INR {product.price}
        </ThemedText>
        
        <View style={styles.quantityRow}>
          <ThemedText style={styles.quantityLabel}>Quantity</ThemedText>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
              onPress={onDecrement}
              disabled={quantity <= 1}
            >
              <ThemedText style={[styles.quantityButtonText, quantity <= 1 && styles.disabledText]}>
                −
              </ThemedText>
            </TouchableOpacity>
            
            <ThemedText style={styles.quantityValue}>{quantity}</ThemedText>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrement}
            >
              <ThemedText style={styles.quantityButtonText}>+</ThemedText>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.itemActions}> */}
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  deliverySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  deliveryAddressContainer: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: {
    fontSize: 14,
    color: '#279989',
    fontWeight: '600',
  },
  bagSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bagTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
  },
  itemsList: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
    // paddingVertical: 0,
    height: 80,
    paddingRight: 8,
    paddingBottom: 0,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    // marginBottom: 6,
    lineHeight: 20,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    // marginBottom: 6,
    // lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#279989',
    // marginBottom: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingBottom: 0,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#279989',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#adb5bd',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 8,
    minWidth: 40,
    height: 80,
    paddingBottom: 0,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  proceedButton: {
    backgroundColor: '#279989',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
