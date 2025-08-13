import { NavLink, useNavigate } from 'react-router-dom'; // Importa NavLink para navegação e useNavigate para redirecionamento programático
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { 
  BarChart3, 
  Database, 
  History, 
  Settings, 
  Users, 
  Shield,
  ChevronDown,
  LogOut,
  Building2,
  TrendingUp
} from 'lucide-react'; // Importa ícones SVG usados na sidebar
import { cn } from '../../lib/utils'; // Importa função utilitária para combinar classes CSS condicionalmente
import { useAuth } from '../../providers/auth-provider'; // Importa hook de autenticação para acessar usuário, organização e logout
import { useUIStore } from '../../store/ui'; // Importa hook para acessar o estado global da UI (ex: sidebar colapsada)
import { Button } from '../ui/button'; // Importa componente de botão reutilizável
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'; // Importa componentes para menus suspensos
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; // Importa componentes de avatar

// Define as propriedades aceitas pelo componente Sidebar
interface SidebarProps {
  className?: string; // (Opcional) Classe CSS extra para customização
}

// Componente funcional Sidebar, responsável pelo menu lateral
export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation(); // Hook para acessar traduções
  const { user, currentOrg, logout } = useAuth(); // Obtém usuário, organização atual e função de logout
  const { sidebarCollapsed } = useUIStore(); // Obtém estado de colapso da sidebar
  const navigate = useNavigate(); // Hook para navegação programática

  // Função para logout do usuário e redirecionamento para login
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Itens principais de navegação
  const mainNavItems = [
    {
      title: t('navigation.dashboards'), // Título traduzido
      href: '/app/dashboards',           // Rota de destino
      icon: BarChart3,                   // Ícone
    },
    {
      title: t('navigation.datasets'),
      href: '/app/datasets',
      icon: Database,
    },
    {
      title: t('navigation.analyses'),
      href: '/app/analyses',
      icon: TrendingUp,
    },
    {
      title: t('navigation.history'),
      href: '/app/history',
      icon: History,
    },
  ];

  // Itens de navegação para configurações
  const settingsNavItems = [
    {
      title: t('navigation.settings'),
      href: '/app/settings',
      icon: Settings,
    },
  ];

  // Itens de navegação para administradores (apenas se o usuário for owner/admin)
  const adminNavItems = user?.roles.some(role => ['owner', 'admin'].includes(role.name)) ? [
    {
      title: t('navigation.admin'),
      href: '/admin',
      icon: Shield,
    },
    {
      title: t('navigation.users'),
      href: '/admin/users',
      icon: Users,
    },
  ] : [];

  return (
    // Container principal da sidebar, ajusta largura conforme colapso e aplica classes extras se fornecidas
    <div 
      className={cn(
        'flex flex-col h-full bg-card border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo e nome do sistema */}
      <div className="flex items-center gap-3 px-4 py-6 border-b">
        {/* Ícone do sistema */}
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
        {/* Nome e subtítulo, exibidos apenas se a sidebar não estiver colapsada */}
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-lg font-bold">InsightAI</h1>
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
        )}
      </div>

      {/* Seletor de organização, exibido apenas se a sidebar não estiver colapsada */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {currentOrg?.name || 'Select Organization'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">{currentOrg?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {currentOrg?.plan} plan
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navegação principal */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {/* Itens principais */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'sidebar-nav-link',
                  sidebarCollapsed ? 'justify-center px-2' : '',
                  isActive && 'bg-accent text-accent-foreground'
                )
              }
              title={sidebarCollapsed ? item.title : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {/* Exibe o texto apenas se a sidebar não estiver colapsada */}
              {!sidebarCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>

        {/* Itens de configurações */}
        <div className="space-y-1 pt-4">
          {/* Título da seção, só aparece se não estiver colapsada */}
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('settings.title')}
            </div>
          )}
          {settingsNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'sidebar-nav-link',
                  sidebarCollapsed ? 'justify-center px-2' : '',
                  isActive && 'bg-accent text-accent-foreground'
                )
              }
              title={sidebarCollapsed ? item.title : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>

        {/* Itens de administração, só aparecem se o usuário for admin/owner */}
        {adminNavItems.length > 0 && (
          <div className="space-y-1 pt-4">
            {/* Título da seção, só aparece se não estiver colapsada */}
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('admin.title')}
              </div>
            )}
            {adminNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'sidebar-nav-link',
                    sidebarCollapsed ? 'justify-center px-2' : '',
                    isActive && 'bg-accent text-accent-foreground'
                  )
                }
                title={sidebarCollapsed ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Perfil do usuário, sempre visível na parte inferior da sidebar */}
      <div className="px-4 py-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full p-2',
                sidebarCollapsed ? 'justify-center' : 'justify-start gap-3'
              )}
            >
              {/* Avatar do usuário */}
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {/* Mostra as iniciais do nome do usuário */}
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Nome e email, só aparecem se a sidebar não estiver colapsada */}
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Opção para acessar o perfil */}
            <DropdownMenuItem onClick={() => navigate('/app/settings/profile')}>
              {t('navigation.profile')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Opção para logout */}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}