import React from 'react';
import { render } from '../utils/test-utils';

// Mock useHomeWizard to control cart data
jest.mock('@/hooks/useHomeWizard', () => ({
  useHomeWizard: jest.fn(() => ({
    cartItemCount: 3,
    incrementQuantity: jest.fn(),
    decrementQuantity: jest.fn(),
  })),
}));

// Mock cart API hooks
jest.mock('@/app/api/react-query/cart', () => ({
  useCart: jest.fn(() => ({
    data: {
      success: true,
      data: {
        cartId: 'cart-1',
        totalItems: 3,
        totalAmount: 400,
        items: [
          {
            itemId: 'item-1',
            quantity: 2,
            product: {
              id: 1,
              name: 'Test Product 1',
              description: 'Test description 1',
              price: 100,
              currency: 'INR',
              image: 'https://example.com/image1.jpg',
            },
          },
          {
            itemId: 'item-2',
            quantity: 1,
            product: {
              id: 2,
              name: 'Test Product 2',
              description: 'Test description 2',
              price: 200,
              currency: 'INR',
              image: 'https://example.com/image2.jpg',
            },
          },
        ],
      },
    },
    isLoading: false,
    error: null,
  })),
  useUpdateCartItem: jest.fn(() => ({
    mutate: jest.fn(),
  })),
  useRemoveFromCart: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

// Mock orders API hooks
jest.mock('@/app/api/react-query/orders', () => ({
  useCreateOrder: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock CheckoutForm component
jest.mock('@/components/checkout-form', () => ({
  CheckoutForm: ({ onProceed, totalAmount }: any) => null,
}));

import CartScreen from '@/app/cart';

describe('CartScreen', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<CartScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with cart items', () => {
    const { UNSAFE_root } = render(<CartScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with empty cart', () => {
    const { useCart } = require('@/app/api/react-query/cart');
    useCart.mockReturnValueOnce({ data: { success: true, data: { cartId: 'c', totalItems: 0, totalAmount: 0, items: [] } }, isLoading: false, error: null });

    const { UNSAFE_root } = render(<CartScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
