import { Loader2 } from 'lucide-react'; // Importa o ícone Loader2 (spinner animado) da biblioteca lucide-react
import { cn } from '../../lib/utils'; // Importa a função utilitária 'cn' para combinar classes CSS condicionalmente

// Define as propriedades aceitas pelo componente LoadingSpinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // (Opcional) Tamanho do spinner: pequeno, médio ou grande
  className?: string;        // (Opcional) Classe CSS extra para customização do container
  text?: string;             // (Opcional) Texto a ser exibido ao lado do spinner
}

// Componente funcional que exibe um spinner de carregamento customizável
export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  // Mapeia os tamanhos possíveis para classes CSS correspondentes de largura e altura
  const sizeClasses = {
    sm: 'w-4 h-4', // Pequeno: 16x16px
    md: 'w-6 h-6', // Médio: 24x24px
    lg: 'w-8 h-8', // Grande: 32x32px
  };

  return (
    // Container flexível centralizado, com espaçamento entre spinner e texto, e classes extras se fornecidas
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Ícone Loader2 com animação de rotação e tamanho conforme a propriedade 'size' */}
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {/* Se o texto foi passado, exibe-o ao lado do spinner com estilo atenuado */}
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}