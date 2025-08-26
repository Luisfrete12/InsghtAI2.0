import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthGuard } from '../components/auth/auth-guard';
import { AuthProvider } from '../providers/auth-provider';

// Mock the auth hook
vi.mock('../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    currentOrg: null,
    organizations: [],
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
    switchOrganization: vi.fn(),
  }),
}));

describe('AuthGuard', () => {
  it('redirects to login when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthGuard>
            <div>Protected Content</div>
          </AuthGuard>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});