import { ReactNode } from 'react'; // Importa o tipo ReactNode para tipar os filhos do componente
import { Navigate, useLocation } from 'react-router-dom'; // Importa componentes e hooks de navegação do React Router
import { useAuth } from '../../providers/auth-provider'; // Importa o hook de autenticação personalizado
import { LoadingSpinner } from '../common/loading-spinner'; // Importa o componente de loading

// Define as propriedades esperadas pelo componente AuthGuard
interface AuthGuardProps {
  children: ReactNode; // Elementos filhos que serão protegidos pela autenticação
  requiredRoles?: string[]; // (Opcional) Lista de roles necessários para acessar o conteúdo
}

// Componente que protege rotas ou componentes com autenticação e autorização
export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  // Obtém o estado de autenticação, carregamento e usuário do contexto de autenticação
  const { isAuthenticated, isLoading, user } = useAuth();
  // Obtém o local atual da navegação, usado para redirecionamento pós-login
  const location = useLocation();

  // Se o estado de autenticação ainda está carregando, exibe um spinner centralizado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Se o usuário não está autenticado, redireciona para a página de login
  // O estado 'from' guarda a rota original para redirecionar após o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se há roles obrigatórios definidos e o usuário não possui pelo menos uma delas,
  // redireciona para a dashboard principal
  if (
    requiredRoles?.length &&
    (!user?.roles?.some(({ name }: any) => requiredRoles.includes(name)))
  ) {
    return <Navigate to="/app/dashboards" replace />;
  }

  // Se passou por todas as verificações, renderiza os filhos normalmente
  return <>{children}</>;
}