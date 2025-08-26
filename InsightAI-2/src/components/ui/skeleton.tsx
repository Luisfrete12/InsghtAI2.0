import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Componente funcional Skeleton, usado para exibir um placeholder animado enquanto o conteúdo carrega
function Skeleton({
  className, // Permite passar classes CSS extras para customização
  ...props   // Permite passar outras props padrão de uma div
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // Renderiza uma div com animação de pulsar, cantos arredondados e fundo atenuado
    // As classes extras passadas por props também são aplicadas
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton }; // Exporta o componente Skeleton para uso em outras partes da aplicação