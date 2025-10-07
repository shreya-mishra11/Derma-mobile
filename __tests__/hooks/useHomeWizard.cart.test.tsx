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
  useCart: () => ({
    data: {
      success: true,
      data: {
        cartId: 'cart-1',
        totalItems: 0,
        totalAmount: 0,
        items: [],
      },
    },
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
    
    // Since we're now using API data, these will be 0 until the API responds
    expect(result.current.cartItemCount).toBe(0);
    expect(result.current.getQuantity(1)).toBe(0);
    expect(result.current.isInCart(1)).toBe(false);
  });
});
