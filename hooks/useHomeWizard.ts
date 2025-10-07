import { useAddToCart, useCart } from '@/app/api/react-query/cart';
import { useProducts } from '@/app/api/react-query/products';
import { useMemo, useState } from 'react';

export const useHomeWizard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all products once; apply filters on the client for instant UX
  const { data: productsResponse, isLoading, error } = useProducts();
  const addToCartMutation = useAddToCart();
  const { data: cartResponse } = useCart();

  const allProducts = productsResponse?.data || [];

  // Derived list based on UI filters
  const products = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const activeCategory = selectedCategory;

    return allProducts.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, searchQuery, selectedCategory]);
  const categories = ['All', 'Electronics', 'Fashion', 'Wearables', 'Home & Kitchen', 'Accessories'];

  // Get cart data from API
  const cartItems = cartResponse?.data?.items || [];
  const cartItemCount = cartResponse?.data?.totalItems || 0;

  const handleProductPress = (productId: number) => {
    console.log('Product pressed:', productId);
    // Navigate to product detail screen
  };

  const handleCartPress = () => {
    console.log('Cart pressed');
    // Navigation will be handled by tab navigation
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    console.log('Category selected:', category);
  };

  const addToCart = (productId: number) => {
    const existingItem = cartItems.find(item => item.productId === productId);
    const currentQuantity = existingItem?.quantity || 0;
    
    addToCartMutation.mutate(
      { productId, quantity: currentQuantity + 1 },
      {
        onSuccess: (data) => {
          console.log('Add to cart success:', data);
        },
        onError: (error) => {
          console.error('Add to cart error:', error);
        }
      }
    );
  };

  const getQuantity = (productId: number) => {
    const item = cartItems.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const isInCart = (productId: number) => {
    return getQuantity(productId) > 0;
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
    getQuantity,
    isInCart,
  };
};
