import { AlertCircle, RefreshCw } from 'lucide-react'; // Importa ícones SVG para alerta e refresh
import { Button } from '../ui/button'; // Importa o componente de botão reutilizável
import { useTranslation } from 'react-i18next'; // Importa o hook para internacionalização

// Define as propriedades esperadas pelo componente ErrorState
interface ErrorStateProps {
  title?: string; // (Opcional) Título do erro a ser exibido
  message?: string; // (Opcional) Mensagem detalhada do erro
  onRetry?: () => void; // (Opcional) Função chamada ao clicar no botão de tentar novamente
}

// Componente funcional que exibe um estado de erro customizável
export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation(); // Hook para acessar traduções

  return (
    // Container centralizado vertical e horizontalmente, com padding e alinhamento de texto ao centro
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Ícone de alerta em vermelho, exibido acima do título */}
      <div className="mb-4 text-red-500">
        <AlertCircle className="w-12 h-12" />
      </div>
      {/* Exibe o título do erro, ou uma mensagem genérica traduzida se não houver título */}
      <h3 className="text-lg font-semibold mb-2">
        {title || t('errors.generic')}
      </h3>
      {/* Se a mensagem foi passada, exibe-a abaixo do título com cor atenuada e largura máxima */}
      {message && (
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      )}
      {/* Se a função onRetry foi passada, exibe um botão de tentar novamente com ícone de refresh */}
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('common.refresh')}
        </Button>
      )}
    </div>
  );
}