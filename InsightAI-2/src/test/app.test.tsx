import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock providers for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders login page by default', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Should show login form since user is not authenticated
    expect(screen.getByText(/InsightAI/i)).toBeInTheDocument();
  });
});