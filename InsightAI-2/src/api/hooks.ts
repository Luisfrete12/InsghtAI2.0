import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { Dataset, Dashboard, AnalysisJob, User, AuditLog } from '../types';

// Query keys
export const queryKeys = {
  user: ['user'] as const,
  organizations: ['organizations'] as const,
  datasets: ['datasets'] as const,
  dataset: (id: string) => ['dataset', id] as const,
  dashboards: ['dashboards'] as const,
  dashboard: (id: string) => ['dashboard', id] as const,
  analysis: (id: string) => ['analysis', id] as const,
  history: ['history'] as const,
  users: ['admin', 'users'] as const,
  auditLogs: ['admin', 'audit-logs'] as const,
} as const;

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: () => apiClient.getUserOrganizations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Dataset hooks
export function useDatasets() {
  return useQuery({
    queryKey: queryKeys.datasets,
    queryFn: () => apiClient.getDatasets(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: queryKeys.dataset(id),
    queryFn: () => apiClient.getDataset(id),
    enabled: !!id,
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { 
      file: File; 
      onProgress?: (progress: any) => void;
      signal?: AbortSignal;
    }) => 
      apiClient.uploadDataset(params.file, {
        onProgress: params.onProgress,
        signal: params.signal,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.datasets });
    },
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDataset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.datasets });
    },
  });
}

// Dashboard hooks
export function useDashboards() {
  return useQuery({
    queryKey: queryKeys.dashboards,
    queryFn: () => apiClient.getDashboards(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useDashboard(id: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(id),
    queryFn: () => apiClient.getDashboard(id),
    enabled: !!id,
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dashboard: Partial<Dashboard>) => 
      apiClient.createDashboard(dashboard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { id: string; dashboard: Partial<Dashboard> }) =>
      apiClient.updateDashboard(params.id, params.dashboard),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(variables.id) });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDashboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
    },
  });
}

// Analysis hooks
export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (datasetId: string) => apiClient.createAnalysis(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
    },
  });
}

export function useAnalysis(id: string, options?: { 
  refetchInterval?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.analysis(id),
    queryFn: () => apiClient.getAnalysis(id),
    enabled: !!id && options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 5000, // Poll every 5 seconds
  });
}

export function useHistory() {
  return useQuery({
    queryKey: queryKeys.history,
    queryFn: () => apiClient.getHistory(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

// Admin hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: Partial<User>) => apiClient.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { id: string; user: Partial<User> }) =>
      apiClient.updateUser(params.id, params.user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs,
    queryFn: () => apiClient.getAuditLogs(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}