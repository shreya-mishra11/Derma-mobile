import { QuantityControls } from '@/components/quantity-controls';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('QuantityControls', () => {
  const defaultProps = {
    quantity: 1,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<QuantityControls {...defaultProps} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('calls onIncrement when + button is pressed', () => {
    const onIncrement = jest.fn();
    const { getByLabelText } = render(<QuantityControls {...defaultProps} onIncrement={onIncrement} />);
    fireEvent.press(getByLabelText('increment'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrement when - button is pressed', () => {
    const onDecrement = jest.fn();
    const { getByLabelText } = render(<QuantityControls {...defaultProps} onDecrement={onDecrement} />);
    fireEvent.press(getByLabelText('decrement'));
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });

  it('renders with different quantities', () => {
    const { UNSAFE_root: root1 } = render(<QuantityControls {...defaultProps} quantity={3} />);
    const { UNSAFE_root: root2 } = render(<QuantityControls {...defaultProps} quantity={5} />);
    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
