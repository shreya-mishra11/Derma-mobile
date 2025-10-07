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
      console.log('AddToCart - Cart ID:', cartId);
      console.log('AddToCart - Request:', { productId, quantity });
      console.log('AddToCart - API URL:', `${API_BASE_URL}/cart`);
      
      const requestBody = { productId, quantity };
      const requestHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(cartId ? { 'X-Cart-ID': String(cartId) } : {}),
      };
      
      console.log('AddToCart - Request headers:', requestHeaders);
      console.log('AddToCart - Request body:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      console.log('AddToCart - Response status:', response.status);
      console.log('AddToCart - Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AddToCart - Error response:', errorText);
        console.error('AddToCart - Error status:', response.status);
        console.error('AddToCart - Error statusText:', response.statusText);
        throw new Error(`Failed to add item to cart: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const json = await response.json();
      console.log('AddToCart - Response data:', json);
      
      const newCartId = json?.data?.cartId;
      if (newCartId) {
        console.log('AddToCart - Setting new cart ID:', newCartId);
        setCartId(newCartId);
      }
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
  return useMutation<CartResponse, Error, AddToCartRequest>({
    mutationFn: async (item: AddToCartRequest) => {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...(getCartId() ? { 'X-Cart-ID': String(getCartId()) } : {}),
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const json = await response.json();
      const newCartId = json?.data?.cartId;
      if (newCartId) setCartId(newCartId);
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
  return useMutation<CartResponse, Error, { productId: number }>({
    mutationFn: async ({ productId }) => {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...(getCartId() ? { 'X-Cart-ID': String(getCartId()) } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const json = await response.json();
      const newCartId = json?.data?.cartId;
      if (newCartId) setCartId(newCartId);
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
      return response.json();
    },
    staleTime: 60_000,
  });
};
