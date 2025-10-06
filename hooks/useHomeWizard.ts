import { useProducts } from '@/app/api/react-query/products';
import { useMemo, useState } from 'react';

export const useHomeWizard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch all products once; apply filters on the client for instant UX
  const { data: productsResponse, isLoading, error } = useProducts();

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
