import * as React from 'react'; // Importa todas as funcionalidades do React
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Define as propriedades aceitas pelo componente Input
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {} // Permite todas as props padrão de um input HTML

// Componente funcional Input, usando forwardRef para repassar a referência
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      // Renderiza um input HTML
      <input
        type={type} // Define o tipo do input (ex: text, password, email, etc)
        className={cn(
          // Classes base para estilização do input:
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className // Permite adicionar classes extras via props
        )}
        ref={ref} // Repassa a referência para o elemento input
        {...props} // Repassa as demais props para o input
      />
    );
  }
);
Input.displayName = 'Input'; // Define o displayName para facilitar debug

export { Input }; // Exporta o componente