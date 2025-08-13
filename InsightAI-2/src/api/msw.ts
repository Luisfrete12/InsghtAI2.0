import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import {
  mockOrganizations,
  mockUsers,
  mockDatasets,
  mockDashboards,
  mockAnalysisJobs,
  mockAuditLogs,
  mockQueryResult,
} from './mocks';
import type { ApiResponse } from '../types';

// Utility function to create API responses
function createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    status: 'success',
    ...(message && { message }),
  };
}

// Utility function to simulate network latency
function delay(ms: number = Math.random() * 500 + 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handlers = [
  // Auth endpoints
  http.get('/auth/me', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockUsers[0]));
  }),

  http.get('/auth/organizations', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockOrganizations));
  }),

  // Dataset endpoints
  http.get('/datasets', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockDatasets));
  }),

  http.get('/datasets/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const dataset = mockDatasets.find(d => d.id === id);
    
    if (!dataset) {
      return HttpResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    return HttpResponse.json(createApiResponse({
      dataset,
      preview: mockQueryResult,
    }));
  }),

  http.post('/upload', async ({ request }) => {
    await delay(2000); // Simulate longer upload time
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return HttpResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate file validation
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return HttpResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const allowedTypes = ['text/csv', 'application/json'];
    if (!allowedTypes.includes(file.type)) {
      return HttpResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Create mock dataset
    const newDatasetId = `dataset-${Date.now()}`;
    const newDataset = {
      id: newDatasetId,
      orgId: 'org-1',
      name: file.name.replace(/\.[^/.]+$/, ''),
      sourceFileName: file.name,
      mime: file.type as 'text/csv' | 'application/json',
      rows: Math.floor(Math.random() * 10000) + 1000,
      columns: ['col1', 'col2', 'col3', 'col4'],
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'user-1',
      size: file.size,
    };

    // Add to mock datasets
    mockDatasets.unshift(newDataset);

    return HttpResponse.json(createApiResponse({
      datasetId: newDatasetId,
      preview: {
        columns: newDataset.columns,
        rows: [
          ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
          ['Another 1', 'Another 2', 'Another 3', 'Another 4'],
        ],
      },
    }));
  }),

  http.delete('/datasets/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const index = mockDatasets.findIndex(d => d.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    mockDatasets.splice(index, 1);
    return HttpResponse.json(createApiResponse(null, 'Dataset deleted successfully'));
  }),

  // Dashboard endpoints
  http.get('/dashboards', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockDashboards));
  }),

  http.get('/dashboards/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const dashboard = mockDashboards.find(d => d.id === id);
    
    if (!dashboard) {
      return HttpResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    return HttpResponse.json(createApiResponse(dashboard));
  }),

  http.post('/dashboards', async ({ request }) => {
    await delay();
    const dashboardData = await request.json() as any;
    
    const newDashboard = {
      id: `dashboard-${Date.now()}`,
      orgId: 'org-1',
      createdAt: new Date().toISOString(),
      createdBy: 'user-1',
      tiles: [],
      ...dashboardData,
    };

    mockDashboards.unshift(newDashboard);
    return HttpResponse.json(createApiResponse(newDashboard));
  }),

  http.patch('/dashboards/:id', async ({ params, request }) => {
    await delay();
    const { id } = params;
    const updates = await request.json() as any;
    
    const index = mockDashboards.findIndex(d => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    mockDashboards[index] = {
      ...mockDashboards[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(createApiResponse(mockDashboards[index]));
  }),

  http.delete('/dashboards/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const index = mockDashboards.findIndex(d => d.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    mockDashboards.splice(index, 1);
    return HttpResponse.json(createApiResponse(null, 'Dashboard deleted successfully'));
  }),

  // Analysis endpoints
  http.post('/analyses', async ({ request }) => {
    await delay();
    const { datasetId } = await request.json() as any;
    
    const newJob = {
      id: `job-${Date.now()}`,
      orgId: 'org-1',
      datasetId,
      status: 'queued' as const,
      startedAt: new Date().toISOString(),
      progress: 0,
      createdBy: 'user-1',
    };

    mockAnalysisJobs.unshift(newJob);
    return HttpResponse.json(createApiResponse({ jobId: newJob.id }));
  }),

  http.get('/analyses/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const job = mockAnalysisJobs.find(j => j.id === id);
    
    if (!job) {
      return HttpResponse.json({ error: 'Analysis job not found' }, { status: 404 });
    }

    // Simulate job progress
    if (job.status === 'running' && job.progress < 100) {
      job.progress = Math.min(100, job.progress + Math.random() * 10);
      
      if (job.progress >= 100) {
        job.status = 'succeeded';
        job.finishedAt = new Date().toISOString();
        job.summary = 'Análise concluída com sucesso!';
      }
    }

    return HttpResponse.json(createApiResponse(job));
  }),

  http.get('/history', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockAnalysisJobs));
  }),

  // Admin endpoints
  http.get('/admin/users', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockUsers));
  }),

  http.post('/admin/users', async ({ request }) => {
    await delay();
    const userData = await request.json() as any;
    
    const newUser = {
      id: `user-${Date.now()}`,
      orgId: 'org-1',
      ...userData,
    };

    mockUsers.push(newUser);
    return HttpResponse.json(createApiResponse(newUser));
  }),

  http.patch('/admin/users/:id', async ({ params, request }) => {
    await delay();
    const { id } = params;
    const updates = await request.json() as any;
    
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    mockUsers[index] = { ...mockUsers[index], ...updates };
    return HttpResponse.json(createApiResponse(mockUsers[index]));
  }),

  http.delete('/admin/users/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const index = mockUsers.findIndex(u => u.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    mockUsers.splice(index, 1);
    return HttpResponse.json(createApiResponse(null, 'User deleted successfully'));
  }),

  http.get('/admin/audit-logs', async () => {
    await delay();
    return HttpResponse.json(createApiResponse(mockAuditLogs));
  }),
];

export const worker = setupWorker(...handlers);

// Start worker in development
if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}