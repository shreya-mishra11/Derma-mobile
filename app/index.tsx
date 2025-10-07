import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartIcon } from '@/components/cart-icon';
import { CategoryButton } from '@/components/category-button';
import { Logo } from '@/components/logo';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHomeWizard } from '@/hooks/useHomeWizard';
import { getCurrentUser, signOut } from '@/lib/auth-session';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = getCurrentUser();
  if (!user) return <Redirect href="/login" />;
  const {
    searchQuery,
    selectedCategory,
    cartItemCount,
    products,
    categories,
    isLoading,
    error,
    setSearchQuery,
    handleProductPress,
    handleCartPress,
    handleCategoryPress,
    addToCart,
    getQuantity,
    isInCart,
  } = useHomeWizard();

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      id={item.id}
      name={item.name}
      price={item.price}
      currency={item.currency}
      image={item.image}
      rating={item.rating}
      discount={item.discount}
      onPress={handleProductPress}
      onAddToCart={addToCart}
      isInCart={isInCart(item.id)}
      quantity={getQuantity(item.id)}
    />
  );

  const renderLoading = () => (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#279989" />
      <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
    </ThemedView>
  );

  const renderError = () => (
    <ThemedView style={styles.errorContainer}>
      <ThemedText style={styles.errorText}>
        Failed to load products. Please try again.
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
    <ThemedView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header with notch handling */}
      <ThemedView style={[
        styles.header,
        { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }
      ]}>
        <Logo size="medium" />
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.pastOrdersButton}
            onPress={() => { signOut(); router.replace('/login'); }}
          >
            <Ionicons name="log-out-outline" size={24} color="#279989" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.pastOrdersButton}
            onPress={() => router.push('/past-orders')}
          >
            <Ionicons name="receipt-outline" size={24} color="#279989" />
          </TouchableOpacity>
          <CartIcon
            onPress={() => router.push('/cart')}
            itemCount={cartItemCount}
          />
        </View>
      </ThemedView>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category}
            title={category}
            isActive={selectedCategory === category}
            onPress={() => handleCategoryPress(category)}
          />
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ThemedView style={[
        styles.productsContainer,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }
      ]}>
        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.productRow}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  // Refresh will be handled by React Query
                }}
                colors={['#279989']}
                tintColor="#279989"
              />
            }
          />
        )}
      </ThemedView>
    </ThemedView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffffEE',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pastOrdersButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#279989',
  },
  categoriesContainer: {
    maxHeight: 50,
    marginTop: 8,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productsList: {
    paddingBottom: 24,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});
