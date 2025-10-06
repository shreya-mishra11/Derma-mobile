export interface CartItem {
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    currency: string;
    image?: string;
  };
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
  data: {
    cartId: string;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
  };
  message?: string;
}

export interface CartResponse {
  success: boolean;
  data: {
    cartId: string;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
  };
}
