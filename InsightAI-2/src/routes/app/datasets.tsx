import  { useState } from 'react'; // Importa o hook de estado do React
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { Plus, Search, Upload, Database, FileText, Eye, Trash2 } from 'lucide-react'; // Importa ícones SVG
import { AppShell } from '../../components/layout/app-shell'; // Importa o layout principal da aplicação
import { Button } from '../../components/ui/button'; // Importa componente de botão reutilizável
import { Input } from '../../components/ui/input'; // Importa componente de input reutilizável
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'; // Importa componentes de card
import { Badge } from '../../components/ui/badge'; // Importa componente de badge (selo)
import { LoadingSpinner } from '../../components/common/loading-spinner'; // Importa spinner de carregamento
import { EmptyState } from '../../components/common/empty-state'; // Importa componente de estado vazio
import { ErrorState } from '../../components/common/error-state'; // Importa componente de estado de erro
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'; // Importa componentes de tabela
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'; // Importa componentes de menu suspenso
import { useDatasets } from '../../api/hooks'; // Importa hook para buscar datasets da API
import { formatBytes, formatRelativeTime } from '../../lib/utils'; // Importa funções utilitárias para formatar bytes e datas
import { UploadDialog } from '../../components/upload/upload-dialog'; // Importa componente de diálogo de upload

// Componente principal da página de datasets
export function DatasetsPage() {
  const { t } = useTranslation(); // Hook para traduções
  const [searchQuery, setSearchQuery] = useState(''); // Estado para termo de busca
  const [showUpload, setShowUpload] = useState(false); // Estado para controlar abertura do diálogo de upload
  const { data: datasetsResponse, isLoading, error, refetch } = useDatasets(); // Busca datasets da API

  const datasets = datasetsResponse?.data || []; // Lista de datasets (ou array vazio)

  // Filtra datasets conforme o termo de busca (nome, nome do arquivo ou tags)
  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.sourceFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Função chamada após upload bem-sucedido para fechar o diálogo e atualizar a lista
  const handleUploadSuccess = () => {
    setShowUpload(false);
    refetch();
  };

  // Exibe spinner de carregamento enquanto busca datasets
  if (isLoading) {
    return (
      <AppShell title={t('dataset.title')}>
        <div className="p-6">
          <LoadingSpinner size="lg" text="Loading datasets..." />
        </div>
      </AppShell>
    );
  }

  // Exibe estado de erro caso haja falha ao buscar datasets
  if (error) {
    return (
      <AppShell title={t('dataset.title')}>
        <div className="p-6">
          <ErrorState 
            title="Failed to load datasets"
            message="There was an error loading your datasets."
            onRetry={refetch}
          />
        </div>
      </AppShell>
    );
  }

  // Renderiza a página de datasets
  return (
    <AppShell title={t('dataset.title')}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('dataset.title')}</h1>
            <p className="text-muted-foreground">
              Manage your data sources and files
            </p>
          </div>
          {/* Botão para abrir o diálogo de upload */}
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            {t('dataset.upload')}
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabela de datasets ou estado vazio */}
        {filteredDatasets.length === 0 ? (
          <EmptyState
            icon={<Database className="w-12 h-12" />}
            title={searchQuery ? 'No datasets found' : t('dataset.noData')}
            description={searchQuery ? 'Try adjusting your search terms' : t('dataset.uploadFirst')}
            action={{
              label: t('dataset.upload'),
              onClick: () => setShowUpload(true),
            }}
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dataset.fileName')}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{t('dataset.rows')}</TableHead>
                  <TableHead>{t('dataset.columns')}</TableHead>
                  <TableHead>{t('dataset.fileSize')}</TableHead>
                  <TableHead>{t('dataset.uploadedAt')}</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {/* Ícone conforme o tipo do arquivo */}
                          {dataset.mime === 'text/csv' ? (
                            <FileText className="w-5 h-5 text-green-600" />
                          ) : (
                            <Database className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{dataset.name}</div>
                          <div className="text-sm text-muted-foreground">{dataset.sourceFileName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {dataset.mime === 'text/csv' ? 'CSV' : 'JSON'}
                      </Badge>
                    </TableCell>
                    <TableCell>{dataset.rows.toLocaleString()}</TableCell>
                    <TableCell>{dataset.columns.length}</TableCell>
                    <TableCell>{formatBytes(dataset.size)}</TableCell>
                    <TableCell>{formatRelativeTime(dataset.uploadedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {/* Ícone de menu (três pontos) */}
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            {t('dataset.preview')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Diálogo de upload de datasets */}
        <UploadDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </AppShell>
  );
}