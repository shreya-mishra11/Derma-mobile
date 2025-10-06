import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartIcon } from '@/components/cart-icon';
import { CategoryButton } from '@/components/category-button';
import { Logo } from '@/components/logo';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedView } from '@/components/themed-view';

// Mock data for products
const mockProducts = [
  {
    id: '1',
    name: 'Hydrating Face Cream',
    price: '$24.99',
    image: null,
  },
  {
    id: '2',
    name: 'Vitamin C Serum',
    price: '$19.99',
    image: null,
  },
  {
    id: '3',
    name: 'Gentle Cleanser',
    price: '$14.99',
    image: null,
  },
  {
    id: '4',
    name: 'Sunscreen SPF 50',
    price: '$16.99',
    image: null,
  },
  {
    id: '5',
    name: 'Night Repair Cream',
    price: '$29.99',
    image: null,
  },
  {
    id: '6',
    name: 'Exfoliating Scrub',
    price: '$12.99',
    image: null,
  },
];

const categories = ['All', 'Skincare', 'Makeup', 'Hair Care', 'Body Care'];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);
  const insets = useSafeAreaInsets();

  const handleProductPress = (productId: string) => {
    console.log('Product pressed:', productId);
    // Navigate to product detail screen
  };

  const handleCartPress = () => {
    console.log('Cart pressed');
    // Navigate to cart screen
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    console.log('Category selected:', category);
  };

  const renderProduct = ({ item }: { item: typeof mockProducts[0] }) => (
    <ProductCard
      id={item.id}
      name={item.name}
      price={item.price}
      image={item.image ?? undefined}
      onPress={handleProductPress}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header with notch handling */}
      <ThemedView style={[
        styles.header,
        { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }
      ]}>
        <Logo size="medium" />
        <CartIcon 
          onPress={handleCartPress} 
          itemCount={cartItemCount}
        />
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
        <FlatList
          data={mockProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          columnWrapperStyle={styles.productRow}
        />
      </ThemedView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
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
});
