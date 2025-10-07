import { getCartId, setCartId } from '@/lib/cart-session';
import { AddToCartRequest, AddToCartResponse, CartResponse } from '@/lib/types/cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://98d9828fc5e9.ngrok-free.app/api';

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: async ({ productId, quantity }) => {
      const cartId = getCartId();
      const requestBody = { productId, quantity };
      const requestHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(cartId ? { 'X-Cart-ID': String(cartId) } : {}),
      };
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AddToCart - Error response:', errorText);
        console.error('AddToCart - Error status:', response.status);
        console.error('AddToCart - Error statusText:', response.statusText);
        throw new Error(`Failed to add item to cart: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const json = await response.json();
      const bodyCartId = json?.data?.cartId;
      const headerCartId = response.headers?.get?.('x-cart-id') || response.headers?.get?.('X-Cart-ID');
      const newCartId = bodyCartId || headerCartId;
      if (newCartId) setCartId(String(newCartId));
      return json;
    },
    onSuccess: () => {
      // Invalidate and refetch cart-related queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook for updating cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, { itemId: string; quantity: number }>({
    mutationFn: async ({ itemId, quantity }) => {
      const cartId = getCartId();
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...(cartId ? { 'X-Cart-ID': String(cartId) } : {}),
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update cart item: ${errorText}`);
      }

      const json = await response.json();
      const bodyCartId = json?.data?.cartId;
      const headerCartId = response.headers?.get?.('x-cart-id') || response.headers?.get?.('X-Cart-ID');
      const newCartId = bodyCartId || headerCartId;
      if (newCartId) setCartId(String(newCartId));
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook for removing item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, { itemId: string }>({
    mutationFn: async ({ itemId }) => {
      const cartId = getCartId();
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...(cartId ? { 'X-Cart-ID': String(cartId) } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove item from cart: ${errorText}`);
      }

      const json = await response.json();
      const bodyCartId = json?.data?.cartId;
      const headerCartId = response.headers?.get?.('x-cart-id') || response.headers?.get?.('X-Cart-ID');
      const newCartId = bodyCartId || headerCartId;
      if (newCartId) setCartId(String(newCartId));
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Fetch cart contents
export const useCart = () => {
  return useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...(getCartId() ? { 'X-Cart-ID': String(getCartId()) } : {}),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const json = await response.json();
      // Persist cartId from server if present (body or header)
      const bodyCartId = (json as any)?.data?.cartId;
      const headerCartId = response.headers?.get?.('x-cart-id') || response.headers?.get?.('X-Cart-ID');
      const newCartId = bodyCartId || headerCartId;
      if (newCartId) setCartId(String(newCartId));
      return json;
    },
    staleTime: 60_000,
  });
};
