import { useHomeWizard } from '@/hooks/useHomeWizard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Test Product 1',
    description: 'Test description',
    price: 100,
    currency: 'INR',
    category: 'Electronics',
    image: '',
    rating: 4.5,
    stock: 10,
    brand: 'TestBrand',
    discount: 0,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Test Product 2',
    description: 'Test description 2',
    price: 200,
    currency: 'INR',
    category: 'Fashion',
    image: '',
    rating: 4.0,
    stock: 5,
    brand: 'TestBrand2',
    discount: 10,
    createdAt: '2025-01-02T00:00:00Z',
  },
];

// Mock the cart API
jest.mock('@/app/api/react-query/cart', () => ({
  useAddToCart: () => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock the products API
jest.mock('@/app/api/react-query/products', () => ({
  useProducts: () => ({
    data: { success: true, data: mockProducts, count: mockProducts.length },
    isLoading: false,
    error: null,
  }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useHomeWizard cart functionality', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    expect(result.current.cartItemCount).toBe(0);
    expect(result.current.getQuantity(1)).toBe(0);
    expect(result.current.isInCart(1)).toBe(false);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
    });
    
    expect(result.current.cartItemCount).toBe(1);
    expect(result.current.getQuantity(1)).toBe(1);
    expect(result.current.isInCart(1)).toBe(true);
  });

  it('increments quantity for existing item', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
      result.current.addToCart(1);
    });
    
    expect(result.current.cartItemCount).toBe(1); // Only 1 unique item
    expect(result.current.getQuantity(1)).toBe(2); // But quantity is 2
  });

  it('increments quantity using incrementQuantity', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
      result.current.incrementQuantity(1);
    });
    
    expect(result.current.getQuantity(1)).toBe(2);
  });

  it('decrements quantity using decrementQuantity', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
      result.current.addToCart(1);
      result.current.decrementQuantity(1);
    });
    
    expect(result.current.getQuantity(1)).toBe(1);
  });

  it('removes item when quantity reaches zero', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
      result.current.decrementQuantity(1);
    });
    
    expect(result.current.cartItemCount).toBe(0);
    expect(result.current.getQuantity(1)).toBe(0);
    expect(result.current.isInCart(1)).toBe(false);
  });

  it('handles multiple different items', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    
    act(() => {
      result.current.addToCart(1);
      result.current.addToCart(2);
      result.current.addToCart(1);
    });
    
    expect(result.current.cartItemCount).toBe(2); // 2 unique items
    expect(result.current.getQuantity(1)).toBe(2); // Item 1 has quantity 2
    expect(result.current.getQuantity(2)).toBe(1); // Item 2 has quantity 1
    expect(result.current.isInCart(1)).toBe(true);
    expect(result.current.isInCart(2)).toBe(true);
  });
});
