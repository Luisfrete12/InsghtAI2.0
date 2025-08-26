import type { 
  Organization, 
  User, 
  Dataset, 
  Dashboard, 
  AnalysisJob, 
  AuditLog,
  QueryResult,
  Tile 
} from '../types';

// Mock data generators
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Corporation',
    plan: 'enterprise',
    createdAt: '2024-01-15T10:00:00Z',
    domain: 'acme.com',
    settings: {
      branding: {
        logo: '/logos/acme.png',
        primaryColor: '#2563EB',
        secondaryColor: '#10B981',
      },
      features: {
        billing: true,
        audit: true,
        webhooks: true,
      },
    },
  },
  {
    id: 'org-2',
    name: 'TechStart Ltd',
    plan: 'pro',
    createdAt: '2024-02-01T14:30:00Z',
    domain: 'techstart.io',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao.silva@acme.com',
    roles: [{ id: 'role-1', name: 'owner', permissions: ['*'] }],
    orgId: 'org-1',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-12-20T09:15:00Z',
    preferences: {
      theme: 'dark',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
    },
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria.santos@acme.com',
    roles: [{ id: 'role-2', name: 'admin', permissions: ['dashboard:*', 'dataset:*', 'user:read'] }],
    orgId: 'org-1',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-12-19T16:45:00Z',
  },
  {
    id: 'user-3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@acme.com',
    roles: [{ id: 'role-3', name: 'analyst', permissions: ['dashboard:read', 'dashboard:create', 'dataset:*'] }],
    orgId: 'org-1',
    lastLogin: '2024-12-20T08:30:00Z',
  },
];

export const mockDatasets: Dataset[] = [
  {
    id: 'dataset-1',
    orgId: 'org-1',
    name: 'Vendas Q4 2024',
    sourceFileName: 'vendas_q4_2024.csv',
    mime: 'text/csv',
    rows: 15420,
    columns: ['data', 'produto', 'vendedor', 'valor', 'regiao', 'categoria'],
    uploadedAt: '2024-12-18T14:22:00Z',
    uploadedBy: 'user-1',
    size: 2048576, // 2MB
    tags: ['vendas', 'q4', '2024'],
    description: 'Dados de vendas do quarto trimestre de 2024',
  },
  {
    id: 'dataset-2',
    orgId: 'org-1',
    name: 'Clientes Ativos',
    sourceFileName: 'clientes_ativos.json',
    mime: 'application/json',
    rows: 8750,
    columns: ['id', 'nome', 'email', 'segmento', 'valor_total', 'ultima_compra'],
    uploadedAt: '2024-12-17T10:15:00Z',
    uploadedBy: 'user-2',
    size: 1245184, // 1.2MB
    tags: ['clientes', 'ativos'],
  },
  {
    id: 'dataset-3',
    orgId: 'org-1',
    name: 'Inventário Produtos',
    sourceFileName: 'inventario_dez_2024.csv',
    mime: 'text/csv',
    rows: 3200,
    columns: ['sku', 'nome', 'categoria', 'estoque', 'preco', 'fornecedor'],
    uploadedAt: '2024-12-16T16:45:00Z',
    uploadedBy: 'user-3',
    size: 524288, // 512KB
    tags: ['inventário', 'produtos', 'estoque'],
  },
];

const mockTiles: Tile[] = [
  {
    id: 'tile-1',
    type: 'line',
    title: 'Vendas por Mês',
    config: {
      datasetId: 'dataset-1',
      xAxis: 'data',
      yAxis: 'valor',
      aggregation: 'sum',
      colors: ['#2563EB'],
    },
    position: { x: 0, y: 0, w: 6, h: 4 },
  },
  {
    id: 'tile-2',
    type: 'pie',
    title: 'Vendas por Região',
    config: {
      datasetId: 'dataset-1',
      groupBy: 'regiao',
      aggregation: 'sum',
      colors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
    },
    position: { x: 6, y: 0, w: 6, h: 4 },
  },
  {
    id: 'tile-3',
    type: 'bar',
    title: 'Top 10 Produtos',
    config: {
      datasetId: 'dataset-1',
      xAxis: 'produto',
      yAxis: 'valor',
      aggregation: 'sum',
      colors: ['#8B5CF6'],
    },
    position: { x: 0, y: 4, w: 12, h: 4 },
  },
];

export const mockDashboards: Dashboard[] = [
  {
    id: 'dashboard-1',
    orgId: 'org-1',
    name: 'Dashboard de Vendas Q4',
    description: 'Visão completa das vendas do último trimestre',
    tiles: mockTiles,
    createdAt: '2024-12-18T15:00:00Z',
    createdBy: 'user-1',
    updatedAt: '2024-12-20T09:30:00Z',
    tags: ['vendas', 'q4', 'executivo'],
    isPublic: false,
    favorites: 5,
  },
  {
    id: 'dashboard-2',
    orgId: 'org-1',
    name: 'Análise de Clientes',
    description: 'Segmentação e comportamento dos clientes',
    tiles: [
      {
        id: 'tile-4',
        type: 'kpi',
        title: 'Total de Clientes Ativos',
        config: {
          datasetId: 'dataset-2',
          aggregation: 'count',
        },
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: 'tile-5',
        type: 'bar',
        title: 'Clientes por Segmento',
        config: {
          datasetId: 'dataset-2',
          xAxis: 'segmento',
          aggregation: 'count',
          colors: ['#06B6D4'],
        },
        position: { x: 3, y: 0, w: 9, h: 4 },
      },
    ],
    createdAt: '2024-12-17T11:00:00Z',
    createdBy: 'user-2',
    tags: ['clientes', 'segmentação'],
    isPublic: true,
    favorites: 3,
  },
  {
    id: 'dashboard-3',
    orgId: 'org-1',
    name: 'Controle de Estoque',
    tiles: [
      {
        id: 'tile-6',
        type: 'table',
        title: 'Produtos com Baixo Estoque',
        config: {
          datasetId: 'dataset-3',
          filters: { estoque: { lt: 10 } },
        },
        position: { x: 0, y: 0, w: 12, h: 6 },
      },
    ],
    createdAt: '2024-12-16T17:00:00Z',
    createdBy: 'user-3',
    tags: ['estoque', 'operacional'],
    isPublic: false,
    favorites: 1,
  },
];

export const mockAnalysisJobs: AnalysisJob[] = [
  {
    id: 'job-1',
    orgId: 'org-1',
    datasetId: 'dataset-1',
    status: 'succeeded',
    startedAt: '2024-12-20T09:00:00Z',
    finishedAt: '2024-12-20T09:05:32Z',
    summary: 'Análise concluída com sucesso. Identificados padrões sazonais e tendências de crescimento.',
    progress: 100,
    createdBy: 'user-1',
  },
  {
    id: 'job-2',
    orgId: 'org-1',
    datasetId: 'dataset-2',
    status: 'running',
    startedAt: '2024-12-20T10:15:00Z',
    progress: 65,
    logs: [
      'Iniciando análise de segmentação...',
      'Processando dados de comportamento...',
      'Aplicando algoritmos de clustering...',
    ],
    createdBy: 'user-2',
  },
  {
    id: 'job-3',
    orgId: 'org-1',
    datasetId: 'dataset-3',
    status: 'failed',
    startedAt: '2024-12-20T08:30:00Z',
    finishedAt: '2024-12-20T08:31:15Z',
    summary: 'Erro na análise: dados incompletos na coluna "fornecedor".',
    progress: 15,
    createdBy: 'user-3',
  },
  {
    id: 'job-4',
    orgId: 'org-1',
    datasetId: 'dataset-1',
    status: 'queued',
    startedAt: '2024-12-20T11:00:00Z',
    progress: 0,
    createdBy: 'user-1',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    orgId: 'org-1',
    actorUserId: 'user-1',
    actorName: 'João Silva',
    action: 'CREATE_DASHBOARD',
    targetType: 'dashboard',
    targetId: 'dashboard-1',
    targetName: 'Dashboard de Vendas Q4',
    createdAt: '2024-12-18T15:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    meta: { tiles: 3, tags: ['vendas', 'q4', 'executivo'] },
  },
  {
    id: 'audit-2',
    orgId: 'org-1',
    actorUserId: 'user-2',
    actorName: 'Maria Santos',
    action: 'UPLOAD_DATASET',
    targetType: 'dataset',
    targetId: 'dataset-2',
    targetName: 'Clientes Ativos',
    createdAt: '2024-12-17T10:15:00Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    meta: { fileSize: 1245184, rows: 8750 },
  },
  {
    id: 'audit-3',
    orgId: 'org-1',
    actorUserId: 'user-1',
    actorName: 'João Silva',
    action: 'UPDATE_USER_ROLE',
    targetType: 'user',
    targetId: 'user-3',
    targetName: 'Carlos Oliveira',
    createdAt: '2024-12-16T14:20:00Z',
    ipAddress: '192.168.1.100',
    meta: { previousRole: 'viewer', newRole: 'analyst' },
  },
];

export const mockQueryResult: QueryResult = {
  columns: ['data', 'produto', 'vendedor', 'valor', 'regiao', 'categoria'],
  rows: [
    ['2024-12-01', 'Laptop Pro', 'João Silva', 2500.00, 'Sudeste', 'Eletrônicos'],
    ['2024-12-01', 'Mouse Wireless', 'Maria Santos', 89.90, 'Sul', 'Acessórios'],
    ['2024-12-01', 'Monitor 4K', 'Carlos Oliveira', 1200.00, 'Nordeste', 'Eletrônicos'],
    ['2024-12-02', 'Teclado Mecânico', 'Ana Costa', 350.00, 'Sudeste', 'Acessórios'],
    ['2024-12-02', 'Smartphone', 'Pedro Lima', 1800.00, 'Centro-Oeste', 'Eletrônicos'],
    // More mock data...
  ],
  stats: {
    totalRecords: 15420,
    avgValue: 856.45,
    maxValue: 5000.00,
    minValue: 15.50,
  },
};