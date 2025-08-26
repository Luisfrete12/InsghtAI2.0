import { ReactNode } from 'react'; // Importa o tipo ReactNode para tipar os filhos do componente
import { Sidebar } from './sidebar'; // Importa o componente Sidebar (menu lateral)
import { Header } from './header'; // Importa o componente Header (cabeçalho)
import { cn } from '../../lib/utils'; // Importa a função utilitária 'cn' para combinar classes CSS condicionalmente
//import { useUIStore } from '../../store/ui'; // (Comentado) Importa hook para acessar o estado global da UI

// Define as propriedades aceitas pelo componente AppShell
interface AppShellProps {
  children: ReactNode; // Elementos filhos a serem renderizados dentro do layout
  title?: string;      // (Opcional) Título a ser exibido no Header
  className?: string;  // (Opcional) Classe CSS extra para customização do main
}

// Componente funcional que define a estrutura principal do aplicativo (layout)
export function AppShell({ children, title, className }: AppShellProps) {
  //const { sidebarCollapsed } = useUIStore(); // (Comentado) Obtém estado de colapso da sidebar

  return (
    // Container principal que ocupa toda a altura da tela e define o background
    <div className="min-h-screen bg-background">
      {/* Container flexível que ocupa toda a altura da tela */}
      <div className="flex h-screen">
        {/* Renderiza o menu lateral */}
        <Sidebar />
        {/* Área principal: ocupa o restante do espaço, organiza em coluna e esconde overflow */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Renderiza o cabeçalho, passando o título se fornecido */}
          <Header title={title} />
          {/* Área principal de conteúdo, com rolagem automática e classes extras se fornecidas */}
          <main 
            className={cn(
              'flex-1 overflow-auto',
              className
            )}
          >
            {/* Renderiza os filhos passados para o AppShell */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}