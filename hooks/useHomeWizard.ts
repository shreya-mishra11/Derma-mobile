import { useAddToCart } from '@/app/api/react-query/cart';
import { useProducts } from '@/app/api/react-query/products';
import { useMemo, useState } from 'react';

export const useHomeWizard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  // Fetch all products once; apply filters on the client for instant UX
  const { data: productsResponse, isLoading, error } = useProducts();
  const addToCartMutation = useAddToCart();

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
    // Navigation will be handled by tab navigation
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    console.log('Category selected:', category);
  };

  const addToCart = (productId: number) => {
    setCartQuantities(prev => {
      const current = prev[productId] || 0;
      const next = current + 1;
      if (current === 0) {
        setCartItemCount(c => c + 1);
      }
      addToCartMutation.mutate({ productId, quantity: next });
      console.log('Added to cart:', productId, 'quantity:', next);
      return { ...prev, [productId]: next };
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartQuantities(prev => {
      const current = prev[productId] || 0;
      if (newQuantity <= 0) {
        const { [productId]: _removed, ...rest } = prev;
        if (current > 0) {
          setCartItemCount(c => Math.max(0, c - 1));
        }
        addToCartMutation.mutate({ productId, quantity: 0 });
        return rest;
      }
      if (current === 0) {
        setCartItemCount(c => c + 1);
      }
      addToCartMutation.mutate({ productId, quantity: newQuantity });
      return { ...prev, [productId]: newQuantity };
    });
  };

  const incrementQuantity = (productId: number) => {
    setCartQuantities(prev => {
      const current = prev[productId] || 0;
      const next = current + 1;
      if (current === 0) {
        setCartItemCount(c => c + 1);
      }
      addToCartMutation.mutate({ productId, quantity: next });
      return { ...prev, [productId]: next };
    });
  };

  const decrementQuantity = (productId: number) => {
    setCartQuantities(prev => {
      const current = prev[productId] || 0;
      const next = current - 1;
      if (next <= 0) {
        const { [productId]: _removed, ...rest } = prev;
        if (current > 0) {
          setCartItemCount(c => Math.max(0, c - 1));
        }
        addToCartMutation.mutate({ productId, quantity: 0 });
        return rest;
      }
      addToCartMutation.mutate({ productId, quantity: next });
      return { ...prev, [productId]: next };
    });
  };

  const getQuantity = (productId: number) => {
    return cartQuantities[productId] || 0;
  };

  const isInCart = (productId: number) => {
    return (cartQuantities[productId] || 0) > 0;
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
    incrementQuantity,
    decrementQuantity,
    getQuantity,
    isInCart,
  };
};
