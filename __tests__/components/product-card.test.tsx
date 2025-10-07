import { ProductCard } from '@/components/product-card';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('ProductCard', () => {
  const baseProps = {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 2499,
    currency: 'INR',
  };

  it('renders without crashing', () => {
    expect(() => render(<ProductCard {...baseProps} />)).not.toThrow();
  });

  it('renders with optional fields (rating, discount)', () => {
    expect(() => render(<ProductCard {...baseProps} rating={4.5} discount={10} />)).not.toThrow();
  });
});


