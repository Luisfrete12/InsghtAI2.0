import * as React from 'react'; // Importa todas as funcionalidades do React
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Componente Card: container principal do card, usando forwardRef para repassar a referência
const Card = React.forwardRef<
  HTMLDivElement, // Tipo da referência: div HTML
  React.HTMLAttributes<HTMLDivElement> // Permite todas as props padrão de uma div
>(({ className, ...props }, ref) => (
  // Renderiza uma div com classes de estilo do card e classes extras, repassando ref e demais props
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm', // Estilo base do card: borda, fundo, cor do texto, sombra e cantos arredondados
      className // Permite adicionar classes extras via props
    )}
    {...props}
  />
));
Card.displayName = 'Card'; // Define o displayName para facilitar debug

// Componente CardHeader: cabeçalho do card, geralmente para título e descrição
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Renderiza uma div com padding e espaçamento vertical entre elementos, repassando ref e props
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Componente CardTitle: título do card, geralmente usado dentro do CardHeader
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  // Renderiza um h3 estilizado para título, repassando ref e props
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight', // Tamanho, peso, espaçamento e alinhamento do texto
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Componente CardDescription: descrição do card, geralmente usado abaixo do título
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  // Renderiza um parágrafo estilizado para descrição, repassando ref e props
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)} // Tamanho menor e cor atenuada
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Componente CardContent: área de conteúdo do card, para inserir qualquer elemento
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Renderiza uma div com padding (exceto no topo), repassando ref e props
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// Componente CardFooter: rodapé do card, geralmente para ações ou informações adicionais
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Renderiza uma div com padding (exceto no topo) e alinhamento horizontal, repassando ref e props
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Exporta todos os componentes para uso externo
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };