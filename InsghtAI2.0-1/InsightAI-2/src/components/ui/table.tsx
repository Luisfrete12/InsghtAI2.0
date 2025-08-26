import * as React from 'react'; // Importa todas as funcionalidades do React
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente

// Componente Table: container principal da tabela, usando forwardRef para repassar a referência
const Table = React.forwardRef<
  HTMLTableElement, // Tipo da referência: elemento <table>
  React.HTMLAttributes<HTMLTableElement> // Permite todas as props padrão de uma tabela HTML
>(({ className, ...props }, ref) => (
  // Envolve a tabela em uma div para permitir rolagem horizontal se necessário
  <div className="relative w-full overflow-auto">
    <table
      ref={ref} // Repassa a referência para o elemento <table>
      className={cn('w-full caption-bottom text-sm', className)} // Aplica classes base e extras
      {...props} // Repassa as demais props para a tabela
    />
  </div>
));
Table.displayName = 'Table'; // Define o displayName para facilitar debug

// Componente TableHeader: representa o cabeçalho da tabela (<thead>)
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  // Aplica borda inferior em todas as linhas do cabeçalho
));
TableHeader.displayName = 'TableHeader';

// Componente TableBody: representa o corpo da tabela (<tbody>)
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)} // Remove borda da última linha do corpo
    {...props}
  />
));
TableBody.displayName = 'TableBody';

// Componente TableFooter: representa o rodapé da tabela (<tfoot>)
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', // Borda superior, fundo atenuado, fonte média, remove borda da última linha
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

// Componente TableRow: representa uma linha da tabela (<tr>)
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', // Borda inferior, transição de cor, hover e seleção
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

// Componente TableHead: representa uma célula de cabeçalho (<th>)
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', // Altura, padding, alinhamento, fonte, cor e ajuste para checkbox
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

// Componente TableCell: representa uma célula de dados (<td>)
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} // Padding, alinhamento e ajuste para checkbox
    {...props}
  />
));
TableCell.displayName = 'TableCell';

// Componente TableCaption: legenda da tabela (<caption>)
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)} // Margem superior, tamanho e cor do texto
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

// Exporta todos os componentes para uso externo
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};