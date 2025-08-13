import type { 
  ApiResponse, 
  Organization, 
  User, 
  Dataset, 
  Dashboard, 
  AnalysisJob, 
  AuditLog,
  QueryResult,
  UploadProgress 
} from '../types';

class ApiClient {
  private baseURL: string;
  private getToken: () => Promise<string | null>;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
    this.getToken = async () => {
      // This will be implemented with AWS Amplify Auth
      // For now, return null to trigger mock mode
      return null;
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async getUserOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request<Organization[]>('/auth/organizations');
  }

  // Dataset endpoints
  async getDatasets(): Promise<ApiResponse<Dataset[]>> {
    return this.request<Dataset[]>('/datasets');
  }

  async getDataset(id: string): Promise<ApiResponse<{ dataset: Dataset; preview: QueryResult }>> {
    return this.request<{ dataset: Dataset; preview: QueryResult }>(`/datasets/${id}`);
  }

  async uploadDataset(
    file: File,
    options: {
      onProgress?: (progress: UploadProgress) => void;
      signal?: AbortSignal;
    } = {}
  ): Promise<ApiResponse<{ datasetId: string; preview: QueryResult }>> {
    const formData = new FormData();
    formData.append('file', file);

    const token = await this.getToken();
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload cancelled'));
        });
      }

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          options.onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', this.baseURL ? `${this.baseURL}/upload` : '/upload');
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  async deleteDataset(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/datasets/${id}`, { method: 'DELETE' });
  }

  // Dashboard endpoints
  async getDashboards(): Promise<ApiResponse<Dashboard[]>> {
    return this.request<Dashboard[]>('/dashboards');
  }

  async getDashboard(id: string): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>(`/dashboards/${id}`);
  }

  async createDashboard(dashboard: Partial<Dashboard>): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>('/dashboards', {
      method: 'POST',
      body: JSON.stringify(dashboard),
    });
  }

  async updateDashboard(id: string, dashboard: Partial<Dashboard>): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>(`/dashboards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dashboard),
    });
  }

  async deleteDashboard(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/dashboards/${id}`, { method: 'DELETE' });
  }

  // Analysis endpoints
  async createAnalysis(datasetId: string): Promise<ApiResponse<{ jobId: string }>> {
    return this.request<{ jobId: string }>('/analyses', {
      method: 'POST',
      body: JSON.stringify({ datasetId }),
    });
  }

  async getAnalysis(id: string): Promise<ApiResponse<AnalysisJob>> {
    return this.request<AnalysisJob>(`/analyses/${id}`);
  }

  async getHistory(): Promise<ApiResponse<AnalysisJob[]>> {
    return this.request<AnalysisJob[]>('/history');
  }

  // Admin endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/admin/users');
  }

  async createUser(user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    return this.request<AuditLog[]>('/admin/audit-logs');
  }
}

export const apiClient = new ApiClient();