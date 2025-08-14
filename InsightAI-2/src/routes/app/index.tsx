//import { Navigate } from 'react-router-dom'; // Importa o componente Navigate do React Router para redirecionamento de rotas
import './indexStyle.css'; // Importa o arquivo de estilos para a página de índice do app
// Componente funcional AppIndexPage, responsável por redirecionar a rota inicial do app
export function AppIndexPage() {
  
  // Retorna um componente Navigate que redireciona o usuário para "/app/dashboards"
  // O prop 'replace' faz com que o histórico do navegador substitua a rota atual, evitando voltar para esta página
  return (
    <div className="welcome-text">
      <p>Bem vindo ao <strong>InsightAI</strong></p>
    </div>
  );
}