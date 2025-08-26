import * as React from 'react'; // Importa todas as funcionalidades do React
import * as ProgressPrimitive from '@radix-ui/react-progress'; // Importa todos os componentes do Progress do Radix UI
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Componente Progress, usando forwardRef para repassar a referência
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>, // Tipo da referência: elemento raiz do Progress
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> // Permite todas as props padrão do componente Root do Progress
>(({ className, value, ...props }, ref) => (
  // Renderiza o componente raiz do Progress do Radix, repassando ref, props e classes
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary', // Estilo base: altura, largura, borda arredondada, fundo e overflow
      className // Permite adicionar classes extras via props
    )}
    {...props}
  >
    {/* Indicador de progresso, ocupa a altura total e largura proporcional ao valor */}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all" // Estilo do indicador: cor, transição suave
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} // Move o indicador para mostrar o progresso atual
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName; // Define o displayName para facilitar debug

export { Progress }; // Exporta o componente Progress