import { create } from 'zustand';

interface FeatureFlags {
  billing: boolean;
  auditLogs: boolean;
  webhooks: boolean;
  realTimeNotifications: boolean;
  advancedAnalytics: boolean;
  exportToPdf: boolean;
  teamCollaboration: boolean;
  customBranding: boolean;
}

interface FeatureFlagsState {
  flags: FeatureFlags;
  setFlags: (flags: Partial<FeatureFlags>) => void;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
  flags: {
    billing: false,
    auditLogs: false,
    webhooks: false,
    realTimeNotifications: true,
    advancedAnalytics: true,
    exportToPdf: true,
    teamCollaboration: true,
    customBranding: false,
  },
  
  setFlags: (newFlags) => set(state => ({
    flags: { ...state.flags, ...newFlags }
  })),
  
  isFeatureEnabled: (feature) => get().flags[feature],
}));