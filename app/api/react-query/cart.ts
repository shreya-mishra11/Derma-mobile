import { getCartId, setCartId } from '@/lib/cart-session';
import { AddToCartRequest, AddToCartResponse, CartResponse } from '@/lib/types/cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://98d9828fc5e9.ngrok-free.app/api';

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: async ({ productId, quantity }) => {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...(getCartId() ? { 'X-Cart-ID': String(getCartId()) } : {}),
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const json = await response.json();
      const newCartId = json?.data?.cartId;
      if (newCartId) setCartId(newCartId);
      return json;
    },
    onSuccess: () => {
      // Invalidate and refetch cart-related queries
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
