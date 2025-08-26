import * as React from 'react'; // Importa todas as funcionalidades do React
import { Slot } from '@radix-ui/react-slot'; // Importa o componente Slot do Radix UI para composição flexível
import { cva, type VariantProps } from 'class-variance-authority'; // Importa a função cva para variantes de classe e o tipo VariantProps
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Define as variantes de estilo do botão usando cva
const buttonVariants = cva(
  // Classes base aplicadas a todos os botões
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // Define as variantes possíveis para o botão
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90', // Botão padrão
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', // Botão destrutivo (ex: excluir)
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', // Botão com borda
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', // Botão secundário
        ghost: 'hover:bg-accent hover:text-accent-foreground', // Botão "fantasma", sem fundo
        link: 'text-primary underline-offset-4 hover:underline', // Botão com estilo de link
      },
      size: {
        default: 'h-10 px-4 py-2', // Tamanho padrão
        sm: 'h-9 rounded-md px-3', // Pequeno
        lg: 'h-11 rounded-md px-8', // Grande
        icon: 'h-10 w-10', // Botão apenas com ícone
      },
    },
    defaultVariants: {
      variant: 'default', // Variante padrão
      size: 'default',    // Tamanho padrão
    },
  }
);

// Define as propriedades aceitas pelo componente Button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // Permite todas as props padrão de um botão
    VariantProps<typeof buttonVariants> { // Permite as props 'variant' e 'size' baseadas nas variantes definidas
  asChild?: boolean; // Permite renderizar como Slot (para composição avançada)
}

// Componente funcional Button, usando forwardRef para repassar a referência
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Define qual componente será renderizado: Slot (se asChild) ou 'button' padrão
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Aplica as classes do botão (incluindo variantes e extras)
        ref={ref} // Repassa a referência
        {...props} // Repassa as demais props
      />
    );
  }
);
Button.displayName = 'Button'; // Define o displayName para facilitar debug

// Exporta o componente Button e as variantes para uso externo
export { Button, buttonVariants };