export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  stock: number;
  brand: string;
  discount: number;
  createdAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  count: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
