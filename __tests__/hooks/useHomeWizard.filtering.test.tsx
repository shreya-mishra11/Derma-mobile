import { useHomeWizard } from '@/hooks/useHomeWizard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 2499,
    currency: 'INR',
    category: 'Electronics',
    image: '',
    rating: 4.5,
    stock: 23,
    brand: 'SoundMagic',
    discount: 10,
    createdAt: '2025-09-01T10:30:00Z',
  },
  {
    id: 2,
    name: 'Cotton Oversized T-Shirt',
    description: 'Organic cotton',
    price: 799,
    currency: 'INR',
    category: 'Fashion',
    image: '',
    rating: 4.2,
    stock: 50,
    brand: 'UrbanThreads',
    discount: 5,
    createdAt: '2025-09-03T15:10:00Z',
  },
  {
    id: 3,
    name: 'Smart Watch Series 6',
    description: 'Fitness tracking watch',
    price: 8999,
    currency: 'INR',
    category: 'Wearables',
    image: '',
    rating: 4.7,
    stock: 12,
    brand: 'TechPro',
    discount: 15,
    createdAt: '2025-09-05T08:00:00Z',
  },
  {
    id: 4,
    name: 'Ceramic Coffee Mug Set',
    description: 'Matte-finish ceramic mugs',
    price: 499,
    currency: 'INR',
    category: 'Home & Kitchen',
    image: '',
    rating: 4.1,
    stock: 35,
    brand: 'CasaCraft',
    discount: 0,
    createdAt: '2025-09-07T11:20:00Z',
  },
  {
    id: 5,
    name: 'Laptop Backpack 25L',
    description: 'Water-resistant backpack with laptop sleeve',
    price: 1699,
    currency: 'INR',
    category: 'Accessories',
    image: '',
    rating: 4.6,
    stock: 18,
    brand: 'Skyline',
    discount: 20,
    createdAt: '2025-09-10T09:15:00Z',
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

jest.mock('@/app/api/react-query/products', () => ({
  useProducts: () => ({
    data: { success: true, data: mockProducts, count: mockProducts.length },
    isLoading: false,
    error: undefined,
  }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useHomeWizard filtering', () => {
  it('returns all products when All category and empty search', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    expect(result.current.products.length).toBe(mockProducts.length);
  });

  it('filters by category only', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    act(() => {
      result.current.handleCategoryPress('Electronics');
    });
    expect(result.current.selectedCategory).toBe('Electronics');
    expect(result.current.products.every(p => p.category === 'Electronics')).toBe(true);
  });

  it('filters by search query only', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    act(() => {
      result.current.setSearchQuery('watch');
    });
    expect(result.current.products.every(p => /watch/i.test(p.name) || /watch/i.test(p.description) || /watch/i.test(p.brand))).toBe(true);
  });

  it('applies both category and search filters', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    act(() => {
      result.current.handleCategoryPress('Accessories');
      result.current.setSearchQuery('backpack');
    });
    expect(result.current.products.length).toBe(1);
    expect(result.current.products[0].name).toMatch(/Backpack/i);
  });
});


