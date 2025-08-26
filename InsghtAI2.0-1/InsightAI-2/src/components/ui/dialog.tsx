import * as React from 'react'; // Importa todas as funcionalidades do React
import * as DialogPrimitive from '@radix-ui/react-dialog'; // Importa todos os componentes do Dialog do Radix UI
import { X } from 'lucide-react'; // Importa o ícone X (fechar) da biblioteca lucide-react
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Dialog: componente raiz do diálogo, controla o estado aberto/fechado
const Dialog = DialogPrimitive.Root;

// DialogTrigger: componente que dispara a abertura do diálogo
const DialogTrigger = DialogPrimitive.Trigger;

// DialogPortal: componente para renderizar o diálogo fora da árvore DOM padrão (portal)
const DialogPortal = ({
  className,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props} />
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// DialogOverlay: camada de fundo escurecida atrás do diálogo, usando forwardRef para repassar a referência
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Estilos para cobrir toda a tela, aplicar blur e animações de entrada/saída
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// DialogContent: conteúdo principal do diálogo, centralizado na tela, com animações e botão de fechar
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    {/* Renderiza o overlay de fundo */}
    <DialogOverlay />
    {/* Renderiza o conteúdo do diálogo */}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Estilos para centralizar, animar e estilizar o conteúdo do diálogo
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
        className
      )}
      {...props}
    >
      {children}
      {/* Botão para fechar o diálogo, posicionado no canto superior direito */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span> {/* Texto acessível para leitores de tela */}
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// DialogHeader: cabeçalho do diálogo, geralmente para título e descrição
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left', // Estilo de layout vertical e alinhamento
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

// DialogFooter: rodapé do diálogo, geralmente para botões de ação
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Layout responsivo: coluna no mobile, linha no desktop
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

// DialogTitle: título do diálogo, usando forwardRef para repassar a referência
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight', // Estilo do título
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// DialogDescription: descrição do diálogo, usando forwardRef para repassar a referência
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)} // Estilo da descrição
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Exporta todos os componentes para uso externo
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};