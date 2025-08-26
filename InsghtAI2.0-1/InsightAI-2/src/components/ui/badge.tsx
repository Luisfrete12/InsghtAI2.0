import * as React from 'react'; // Importa todas as funcionalidades do React
import { cva, type VariantProps } from 'class-variance-authority'; // Importa a função cva para variantes de classe e o tipo VariantProps
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Define as variantes de estilo do badge usando cva
const badgeVariants = cva(
  // Classes base aplicadas a todos os badges
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      // Define as variantes possíveis para o badge
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80', // Badge padrão
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80', // Badge secundário
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80', // Badge destrutivo (ex: erro)
        outline: 'text-foreground', // Badge apenas com texto, sem fundo
      },
    },
    defaultVariants: {
      variant: 'default', // Variante padrão caso nenhuma seja especificada
    },
  }
);

// Define as propriedades aceitas pelo componente Badge
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, // Permite todas as props padrão de uma div
    VariantProps<typeof badgeVariants> {} // Permite a prop 'variant' baseada nas variantes definidas

// Componente funcional Badge
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    // Renderiza uma div com as classes do badge (incluindo variantes e classes extras), repassando as demais props
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Exporta o componente Badge e as variantes para uso externo
export { Badge, badgeVariants };