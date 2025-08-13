import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Organization } from '../types';

interface AuthState {
  user: User | null;
  currentOrg: Organization | null;
  organizations: Organization[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentOrg: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentOrg: null,
      organizations: [],
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user }),
      setCurrentOrg: (org) => set({ currentOrg: org }),
      setOrganizations: (orgs) => set({ organizations: orgs }),
      setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ 
        user: null, 
        currentOrg: null, 
        organizations: [], 
        isAuthenticated: false,
        isLoading: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentOrg: state.currentOrg,
        organizations: state.organizations,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);