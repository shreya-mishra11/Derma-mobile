import { Product, ProductsResponse } from '@/lib/types/product';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://268b1d2d159d.ngrok-free.app/api';

// Fetch all products
export const useProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single product by ID
export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      return data.data || data;
    },
    enabled: !!id,
  });
};
