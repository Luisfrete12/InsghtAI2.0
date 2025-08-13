import { Navigate } from 'react-router-dom'; // Importa o componente Navigate do React Router para redirecionamento de rotas

// Componente funcional AppIndexPage, responsável por redirecionar a rota inicial do app
export function AppIndexPage() {
  // Retorna um componente Navigate que redireciona o usuário para "/app/dashboards"
  // O prop 'replace' faz com que o histórico do navegador substitua a rota atual, evitando voltar para esta página
  return <Navigate to="/app/dashboards" replace />;
}