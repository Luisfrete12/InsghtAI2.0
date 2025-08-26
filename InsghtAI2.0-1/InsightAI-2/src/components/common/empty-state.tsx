import { ReactNode } from 'react'; // Importa o tipo ReactNode para tipar elementos React como propriedades
import { Button } from '../ui/button'; // Importa o componente de botão reutilizável

// Define as propriedades esperadas pelo componente EmptyState
interface EmptyStateProps {
  icon?: ReactNode; // (Opcional) Ícone a ser exibido no estado vazio
  title: string; // Título principal do estado vazio (obrigatório)
  description?: string; // (Opcional) Descrição adicional do estado vazio
  action?: { // (Opcional) Objeto de ação contendo label e função de clique
    label: string; // Texto do botão de ação
    onClick: () => void; // Função executada ao clicar no botão
  };
}

// Componente funcional que exibe um estado vazio customizável
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    // Container centralizado vertical e horizontalmente, com padding e alinhamento de texto ao centro
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Se o ícone foi passado, exibe-o acima do título com margem inferior e cor de texto atenuada */}
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      {/* Exibe o título principal em destaque */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {/* Se a descrição foi passada, exibe-a abaixo do título com cor atenuada e largura máxima */}
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {/* Se a ação foi passada, exibe um botão que executa a função onClick ao ser clicado */}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}