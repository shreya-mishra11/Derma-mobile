import { useProducts } from '@/app/api/react-query/products';
import { useMemo, useState } from 'react';

export const useHomeWizard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);

  const filters = useMemo(() => ({
    search: searchQuery.trim() || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
  }), [searchQuery, selectedCategory]);

  const { data: productsResponse, isLoading, error } = useProducts(filters);

  const products = productsResponse?.data || [];
  const categories = ['All', 'Electronics', 'Fashion', 'Wearables', 'Home & Kitchen', 'Accessories'];

  const handleProductPress = (productId: number) => {
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

  const addToCart = (productId: number) => {
    setCartItemCount(prev => prev + 1);
    console.log('Added to cart:', productId);
  };

  return {
    // State
    searchQuery,
    selectedCategory,
    cartItemCount,
    
    // Data
    products,
    categories,
    isLoading,
    error,
    
    // Actions
    setSearchQuery,
    handleProductPress,
    handleCartPress,
    handleCategoryPress,
    addToCart,
  };
};
