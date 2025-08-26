import * as React from 'react'; // Importa todas as funcionalidades do React
import * as AvatarPrimitive from '@radix-ui/react-avatar'; // Importa todos os componentes do Avatar do Radix UI
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Componente Avatar: container principal do avatar, usando forwardRef para repassar a referência
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>, // Define o tipo da referência (elemento raiz do Avatar)
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> // Define as props aceitas (todas do AvatarPrimitive.Root, exceto ref)
>(({ className, ...props }, ref) => (
  // Renderiza o componente raiz do Avatar do Radix, repassando ref, props e classes
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', // Define tamanho, formato e overflow do avatar
      className // Permite adicionar classes extras via props
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName; // Define o displayName para facilitar debug

// Componente AvatarImage: exibe a imagem do avatar, usando forwardRef para repassar a referência
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>, // Tipo da referência (elemento de imagem do Avatar)
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> // Props aceitas (todas do AvatarPrimitive.Image, exceto ref)
>(({ className, ...props }, ref) => (
  // Renderiza o componente de imagem do Avatar do Radix, repassando ref, props e classes
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)} // Garante proporção quadrada e ocupa todo o espaço do avatar
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName; // Define o displayName para facilitar debug

// Componente AvatarFallback: exibe conteúdo alternativo caso a imagem não carregue, usando forwardRef
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>, // Tipo da referência (elemento fallback do Avatar)
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> // Props aceitas (todas do AvatarPrimitive.Fallback, exceto ref)
>(({ className, ...props }, ref) => (
  // Renderiza o componente fallback do Avatar do Radix, repassando ref, props e classes
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted', // Centraliza conteúdo, formato circular e fundo atenuado
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName; // Define o displayName para facilitar debug

// Exporta os três componentes para uso externo
export { Avatar, AvatarImage, AvatarFallback };