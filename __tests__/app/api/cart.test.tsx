import { useAddToCart } from '@/app/api/react-query/cart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock fetch
global.fetch = jest.fn();

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useAddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls POST /api/cart with correct data', async () => {
    const mockResponse = {
      success: true,
      data: {
        cartId: 'cart-123',
        items: [{ productId: 1, quantity: 2 }],
        totalItems: 1,
        totalAmount: 200,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      result.current.mutate({ productId: 1, quantity: 2 });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://98d9828fc5e9.ngrok-free.app/api/cart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ productId: 1, quantity: 2 }),
      }
    );
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      result.current.mutate({ productId: 1, quantity: 1 });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
