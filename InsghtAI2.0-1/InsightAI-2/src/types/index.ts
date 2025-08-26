export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  domain?: string;
  settings?: {
    branding?: {
      logo?: string;
      primaryColor?: string;
      secondaryColor?: string;
    };
    features?: {
      billing?: boolean;
      audit?: boolean;
      webhooks?: boolean;
    };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  orgId: string;
  avatar?: string;
  lastLogin?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en';
    timezone?: string;
  };
}

export interface Role {
  id: string;
  name: 'owner' | 'admin' | 'analyst' | 'viewer';
  permissions: string[];
}

export interface Dataset {
  id: string;
  orgId: string;
  name: string;
  sourceFileName: string;
  mime: 'text/csv' | 'application/json';
  rows: number;
  columns: string[];
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  tags?: string[];
  description?: string;
}

export interface AnalysisJob {
  id: string;
  orgId: string;
  datasetId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  startedAt: string;
  finishedAt?: string;
  summary?: string;
  progress?: number;
  logs?: string[];
  createdBy: string;
}

export interface Dashboard {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  tiles: Tile[];
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  tags?: string[];
  isPublic?: boolean;
  favorites?: number;
}

export interface Tile {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'table' | 'kpi';
  title: string;
  queryId?: string;
  config: {
    datasetId?: string;
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
    filters?: Record<string, any>;
    colors?: string[];
  };
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  stats?: Record<string, number>;
  totalRows?: number;
}

export interface AuditLog {
  id: string;
  orgId: string;
  actorUserId: string;
  actorName: string;
  action: string;
  targetType: 'dashboard' | 'dataset' | 'user' | 'organization';
  targetId: string;
  targetName?: string;
  createdAt: string;
  meta?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface Notification {
  id: string;
  orgId: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface PreviewData {
  columns: string[];
  rows: any[][];
  totalRows: number;
  hasHeaders: boolean;
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  status?: string[];
  search?: string;
}