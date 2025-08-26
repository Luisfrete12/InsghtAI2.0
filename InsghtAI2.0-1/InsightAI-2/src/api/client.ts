// Importa tipos TypeScript usados nas respostas e entidades da API
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

// Define a classe principal do cliente da API
class ApiClient {
  // URL base da API (ex: http://localhost:3000/api)
  private baseURL: string;
  // Função para obter o token JWT do usuário autenticado
  private getToken: () => Promise<string | null>;

  // Construtor da classe
  constructor() {
    // Pega a URL base da API das variáveis de ambiente (Vite)
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
    // Função assíncrona para obter o token (ainda não implementada, retorna null)
    this.getToken = async () => {
      // Será implementado com AWS Amplify Auth
      // Por enquanto retorna null para ativar modo mock
      return null;
    };
  }

  // Método privado genérico para fazer requisições HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Obtém o token de autenticação
    const token = await this.getToken();
    // Monta a URL completa do endpoint
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;
    // Monta as opções da requisição, incluindo headers
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Adiciona o token se existir
        ...options.headers,
      },
      ...options,
    };

    try {
      // Faz a requisição usando fetch
      const response = await fetch(url, config);
      // Se a resposta não for OK, lança erro
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      // Converte a resposta para JSON
      const data = await response.json();
      return data;
    } catch (error) {
      // Loga e repassa o erro
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // =========================
  // Métodos de autenticação
  // =========================

  // Busca o usuário autenticado atual
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Busca as organizações do usuário autenticado
  async getUserOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request<Organization[]>('/auth/organizations');
  }

  // =========================
  // Métodos de Dataset
  // =========================

  // Lista todos os datasets
  async getDatasets(): Promise<ApiResponse<Dataset[]>> {
    return this.request<Dataset[]>('/datasets');
  }

  // Busca um dataset específico e seu preview
  async getDataset(id: string): Promise<ApiResponse<{ dataset: Dataset; preview: QueryResult }>> {
    return this.request<{ dataset: Dataset; preview: QueryResult }>(`/datasets/${id}`);
  }

  // Faz upload de um dataset (arquivo), com suporte a progresso e cancelamento
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
    
    // Usa XMLHttpRequest para permitir progresso e cancelamento
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Suporte a cancelamento via AbortSignal
      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload cancelled'));
        });
      }

      // Evento de progresso do upload
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          options.onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          });
        }
      });

      // Evento de conclusão do upload
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

      // Evento de erro de rede
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      // Abre a requisição POST para o endpoint de upload
      xhr.open('POST', this.baseURL ? `${this.baseURL}/upload` : '/upload');
      
      // Adiciona o header de autorização se houver token
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Envia o arquivo
      xhr.send(formData);
    });
  }

  // Remove um dataset pelo id
  async deleteDataset(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/datasets/${id}`, { method: 'DELETE' });
  }

  // =========================
  // Métodos de Dashboard
  // =========================

  // Lista todos os dashboards
  async getDashboards(): Promise<ApiResponse<Dashboard[]>> {
    return this.request<Dashboard[]>('/dashboards');
  }

  // Busca um dashboard específico
  async getDashboard(id: string): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>(`/dashboards/${id}`);
  }

  // Cria um novo dashboard
  async createDashboard(dashboard: Partial<Dashboard>): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>('/dashboards', {
      method: 'POST',
      body: JSON.stringify(dashboard),
    });
  }

  // Atualiza um dashboard existente
  async updateDashboard(id: string, dashboard: Partial<Dashboard>): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>(`/dashboards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dashboard),
    });
  }

  // Remove um dashboard
  async deleteDashboard(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/dashboards/${id}`, { method: 'DELETE' });
  }

  // =========================
  // Métodos de Análise
  // =========================

  // Cria uma nova análise para um dataset
  async createAnalysis(datasetId: string): Promise<ApiResponse<{ jobId: string }>> {
    return this.request<{ jobId: string }>('/analyses', {
      method: 'POST',
      body: JSON.stringify({ datasetId }),
    });
  }

  // Busca uma análise específica
  async getAnalysis(id: string): Promise<ApiResponse<AnalysisJob>> {
    return this.request<AnalysisJob>(`/analyses/${id}`);
  }

  // Lista o histórico de análises
  async getHistory(): Promise<ApiResponse<AnalysisJob[]>> {
    return this.request<AnalysisJob[]>('/history');
  }

  // =========================
  // Métodos de Administração
  // =========================

  // Lista todos os usuários
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/admin/users');
  }

  // Cria um novo usuário
  async createUser(user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Atualiza um usuário existente
  async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
  }

  // Remove um usuário
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}`, { method: 'DELETE' });
  }

  // Lista os logs de auditoria
  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    return this.request<AuditLog[]>('/admin/audit-logs');
  }
}

// Exporta uma instância única do cliente da API para ser usada na aplicação
export const apiClient = new ApiClient();