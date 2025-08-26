import { useState } from 'react'; // Importa o hook de estado do React
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { Plus, Search, Filter, BarChart3, Heart, Share2, Copy, Trash2, Edit, Eye } from 'lucide-react'; // Importa ícones SVG
import { AppShell } from '../../components/layout/app-shell'; // Importa o layout principal da aplicação
import { Button } from '../../components/ui/button'; // Importa componente de botão reutilizável
import { Input } from '../../components/ui/input'; // Importa componente de input reutilizável
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'; // Importa componentes de card
import { Badge } from '../../components/ui/badge'; // Importa componente de badge (selo)
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'; // Importa componentes de avatar
import { LoadingSpinner } from '../../components/common/loading-spinner'; // Importa spinner de carregamento
import { EmptyState } from '../../components/common/empty-state'; // Importa componente de estado vazio
import { ErrorState } from '../../components/common/error-state'; // Importa componente de estado de erro
import { useDashboards } from '../../api/hooks'; // Importa hook para buscar dashboards
import { formatRelativeTime } from '../../lib/utils'; // Importa função utilitária para formatar datas relativas
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'; // Importa componentes de menu suspenso
import { useNavigate } from 'react-router-dom'; // Importa hook para navegação programática

// Componente principal da página de dashboards
export function DashboardsPage() {
  const { t } = useTranslation(); // Hook para traduções
  const navigate = useNavigate(); // Hook para navegação
  const [searchQuery, setSearchQuery] = useState(''); // Estado para termo de busca
  const { data: dashboardsResponse, isLoading, error, refetch } = useDashboards(); // Busca dashboards da API

  const dashboards = dashboardsResponse?.data || []; // Lista de dashboards (ou array vazio)

  // Filtra dashboards conforme o termo de busca (nome, descrição ou tags)
  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Função para navegar para a criação de novo dashboard
  const handleCreateDashboard = () => {
    navigate('/app/dashboards/new');
  };

  // Função para visualizar um dashboard específico
  const handleViewDashboard = (dashboardId: string) => {
    navigate(`/app/dashboards/${dashboardId}`);
  };

  // Exibe spinner de carregamento enquanto busca dashboards
  if (isLoading) {
    return (
      <AppShell title={t('dashboard.title')}>
        <div className="p-6">
          <LoadingSpinner size="lg" text="Loading dashboards..." />
        </div>
      </AppShell>
    );
  }

  // Exibe estado de erro caso haja falha ao buscar dashboards
  if (error) {
    return (
      <AppShell title={t('dashboard.title')}>
        <div className="p-6">
          <ErrorState 
            title="Failed to load dashboards"
            message="There was an error loading your dashboards."
            onRetry={refetch}
          />
        </div>
      </AppShell>
    );
  }

  // Renderiza a página de dashboards
  return (
    <AppShell title={t('dashboard.title')}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              Manage and view your data dashboards
            </p>
          </div>
          {/* Botão para criar novo dashboard */}
          <Button onClick={handleCreateDashboard}>
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.createNew')}
          </Button>
        </div>

        {/* Barra de busca e filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('dashboard.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Grid de dashboards ou estado vazio */}
        {filteredDashboards.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-12 h-12" />}
            title={searchQuery ? 'No dashboards found' : t('dashboard.noData')}
            description={searchQuery ? 'Try adjusting your search terms' : t('dashboard.createFirst')}
            action={{
              label: t('dashboard.createNew'),
              onClick: handleCreateDashboard,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Renderiza cada dashboard como um card */}
            {filteredDashboards.map((dashboard) => (
              <Card key={dashboard.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{dashboard.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dashboard.description || 'No description'}
                      </CardDescription>
                    </div>
                    {/* Menu de ações do dashboard */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {/* Ícone de menu (três pontos) */}
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDashboard(dashboard.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          {t('dashboard.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          {t('dashboard.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          {t('dashboard.duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          {t('dashboard.share')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('dashboard.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Mini chart preview */}
                  <div className="h-24 bg-muted rounded-md mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  </div>

                  {/* Tags do dashboard */}
                  {dashboard.tags && dashboard.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dashboard.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {/* Exibe badge extra se houver mais de 3 tags */}
                      {dashboard.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{dashboard.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Rodapé do card: criador, favoritos e data */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {dashboard.createdBy[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{dashboard.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Exibe favoritos se houver */}
                      {dashboard.favorites && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{dashboard.favorites}</span>
                        </div>
                      )}
                      {/* Exibe data relativa de criação */}
                      <span>{formatRelativeTime(dashboard.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}