import { createContext, useContext, useEffect, ReactNode } from 'react'; // Importa funções do React para contexto, hooks e tipagem de filhos
import { useAuthStore } from '../store/auth'; // Importa o hook de estado global de autenticação
import type { User, Organization } from '../types'; // Importa tipos para usuário e organização

// Define a interface do contexto de autenticação, com todos os dados e funções disponíveis
interface AuthContextType {
  user: User | null; // Usuário autenticado ou null
  currentOrg: Organization | null; // Organização atual selecionada
  organizations: Organization[]; // Lista de organizações do usuário
  isAuthenticated: boolean; // Indica se o usuário está autenticado
  isLoading: boolean; // Indica se está carregando informações de autenticação
  login: (email: string, password: string) => Promise<void>; // Função para login
  logout: () => Promise<void>; // Função para logout
  signup: (email: string, password: string, name: string) => Promise<void>; // Função para cadastro
  settings?: any; // Configurações do usuário (opcional, pode ser tipado melhor conforme necessidade)
  switchOrganization: (orgId: string) => void; // Função para trocar de organização
}

// Cria o contexto de autenticação, inicialmente indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext); // Obtém o contexto
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider'); // Garante que está dentro do provider
  }
  return context;
}

// Define as propriedades aceitas pelo AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Elementos filhos a serem renderizados dentro do provider
}

// Componente AuthProvider, responsável por fornecer o contexto de autenticação para a árvore de componentes
export function AuthProvider({ children }: AuthProviderProps) {
  // Obtém estados e setters do store global de autenticação
  const {
    user,
    currentOrg,
    organizations,
    isAuthenticated,
    isLoading,
    setUser,
    setCurrentOrg,
    setOrganizations,
    setIsAuthenticated,
    setIsLoading,
    logout: storeLogout,
  } = useAuthStore();

  // Efeito para inicializar o estado de autenticação ao montar o componente
  useEffect(() => {
    // Função assíncrona para inicializar autenticação
    const initAuth = async () => {
      try {
        setIsLoading(true); // Indica carregamento
        
        // Verifica se há sessão salva no localStorage
        // Em app real, aqui seria feita a validação do token Cognito
        const savedUser = localStorage.getItem('auth-storage');
        if (savedUser) {
          const authData = JSON.parse(savedUser);
          if (authData.state?.isAuthenticated && authData.state?.user) {
            setUser(authData.state.user); // Restaura usuário
            setCurrentOrg(authData.state.currentOrg); // Restaura organização atual
            setOrganizations(authData.state.organizations); // Restaura lista de organizações
            setIsAuthenticated(true); // Marca como autenticado
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error); // Loga erro de inicialização
        storeLogout(); // Faz logout em caso de erro
      } finally {
        setIsLoading(false); // Finaliza carregamento
      }
    };

    initAuth(); // Executa a inicialização
  }, []);

  // Função para login do usuário
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true); // Inicia carregamento
      
      // Mock de login - em app real, usaria AWS Amplify Auth
      if (email === 'demo@insightai.com' && password === 'demo123') {
        // Mock de usuário autenticado
        const mockUser: User = {
          id: 'user-1',
          name: 'João Silva',
          email: 'demo@insightai.com',
          roles: [{ id: 'role-1', name: 'owner', permissions: ['*'] }],
          orgId: 'org-1',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          preferences: {
            theme: 'system',
            language: 'pt-BR',
          },
        };

        const mockOrg: Organization = {
          id: 'org-1',
          name: 'Acme Corporation',
          plan: 'enterprise',
          createdAt: '2024-01-15T10:00:00Z',
        };

        setUser(mockUser); // Seta usuário no estado global
        setCurrentOrg(mockOrg); // Seta organização atual
        setOrganizations([mockOrg]); // Seta lista de organizações
        setIsAuthenticated(true); // Marca como autenticado
      } else {
        throw new Error('Credenciais inválidas'); // Erro se login não for válido
      }
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  // Função para logout do usuário
  const logout = async () => {
    try {
      setIsLoading(true); // Inicia carregamento
      // Em app real, faria sign out do Cognito
      storeLogout(); // Limpa estado de autenticação
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  // Função para cadastro de novo usuário
  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true); // Inicia carregamento
      // Mock de signup - em app real, usaria AWS Amplify Auth
      // Aqui apenas faz log e encerra
      console.log('Signup:', { email, password, name });
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  // Função para trocar de organização
  const switchOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId); // Busca organização pelo id
    if (org) {
      setCurrentOrg(org); // Atualiza organização atual
    }
  };

  // Monta o valor do contexto com todos os dados e funções
  const contextValue: AuthContextType = {
    user,
    currentOrg,
    organizations,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    switchOrganization,
  };

  // Retorna o provider do contexto, envolvendo os filhos
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}