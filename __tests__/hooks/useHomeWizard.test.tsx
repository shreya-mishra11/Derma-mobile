import { useHomeWizard } from '@/hooks/useHomeWizard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';

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
    data: { success: true, data: [], count: 0 },
    isLoading: false,
    error: null,
  }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useHomeWizard', () => {
  it('initializes with defaults and updates category', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    expect(result.current.selectedCategory).toBe('All');
    act(() => {
      result.current.handleCategoryPress('Electronics');
    });
    expect(result.current.selectedCategory).toBe('Electronics');
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useHomeWizard(), { wrapper });
    act(() => {
      result.current.setSearchQuery('watch');
    });
    expect(result.current.searchQuery).toBe('watch');
  });
});


