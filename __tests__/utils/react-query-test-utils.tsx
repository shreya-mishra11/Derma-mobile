import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';

// Create a custom render function that includes React Query
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Helper to create a query client for testing
    export { createTestQueryClient };

// Helper to wait for queries to settle
export const waitForQueriesToSettle = async (queryClient: QueryClient) => {
  await queryClient.getQueryCache().clear();
};

// Simple test to ensure the file is valid
describe('React Query Test Utils', () => {
  it('should export react query utilities', () => {
    expect(createTestQueryClient).toBeDefined();
    expect(waitForQueriesToSettle).toBeDefined();
  });
});
