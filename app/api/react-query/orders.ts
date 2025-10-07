import { authHeaders } from '@/lib/auth-session';
import { getCartId, hydrateCartIdIfNeeded, setCartId } from '@/lib/cart-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://98d9828fc5e9.ngrok-free.app/api';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CreateOrderRequest {
  // Cart-based order
  customerInfo?: CustomerInfo;
  paymentMethod?: 'cash' | 'card' | 'upi';
  // Direct order (no cart)
  productId?: number;
  quantity?: number;
}

export interface OrderResponse {
  success: boolean;
  data: {
    orderId: string;
    cartId: string;
    customerInfo: CustomerInfo;
    paymentMethod: string;
    items: Array<{
      productId: number;
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
  };
  message: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: Array<{
    orderId: string;
    cartId: string;
    customerInfo: CustomerInfo;
    paymentMethod: string;
    items: Array<{
      productId: number;
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  count: number;
}

// Create order from current cart
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, CreateOrderRequest>({
    mutationFn: async (args) => {
      const isDirectOrder =
        typeof args.productId === 'number' && typeof args.quantity === 'number';

      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...authHeaders(),
      };

      let body: any = {};

      if (isDirectOrder) {
        // Direct order: send productId, quantity, and paymentMethod if provided
        body = {
          // productId: args.productId,
          // quantity: args.quantity,
          ...(args.paymentMethod ? { paymentMethod: args.paymentMethod as 'cash' | 'card' | 'upi' } : {}),
        };
      } else {
        // Cart-based order: ensure cartId and send customer info + payment method
        await hydrateCartIdIfNeeded();
        let cartId = getCartId();
        if (!cartId) {
          const cachedCart: any = queryClient.getQueryData(['cart']);
          const cachedCartId = cachedCart?.data?.cartId;
          if (cachedCartId) {
            setCartId(cachedCartId);
            cartId = cachedCartId;
          }
        }
        if (!cartId) {
          try {
            const cartResponse = await fetch(`${API_BASE_URL}/cart`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (cartResponse.ok) {
              const cartJson = await cartResponse.json();
              const fetchedCartId = cartJson?.data?.cartId;
              if (fetchedCartId) {
                setCartId(fetchedCartId);
                cartId = fetchedCartId;
              }
            }
          } catch {}
        }
        // if (!cartId) throw new Error('No cart found. Please add items to cart first.');

        headers = { ...headers, 'X-Cart-ID': String(cartId) };
        body = {
          customerInfo: args.customerInfo,
          paymentMethod: args.paymentMethod as 'cash' | 'card' | 'upi',
        };
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate cart and orders queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Get all orders
export const useOrders = () => {
  return useQuery<OrdersListResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...authHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return response.json();
    },
    staleTime: 60_000, // 1 minute
  });
};
