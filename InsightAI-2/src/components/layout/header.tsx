import { Search, Bell, Menu, Moon, Sun, Monitor } from 'lucide-react'; // Importa ícones SVG para busca, notificações, menu, temas claro/escuro/sistema
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { Button } from '../ui/button'; // Importa componente de botão reutilizável
import { Input } from '../ui/input'; // Importa componente de input reutilizável
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'; // Importa componentes para menus suspensos
import { Badge } from '../ui/badge'; // Importa componente de badge (selo)
import { useTheme } from '../../providers/theme-provider'; // Importa hook para manipulação do tema
import { useUIStore } from '../../store/ui'; // Importa hook para acessar o estado global da UI

// Define as propriedades aceitas pelo componente Header
interface HeaderProps {
  title?: string; // (Opcional) Título a ser exibido no cabeçalho
}

// Componente funcional Header, responsável pelo topo do layout
export function Header({ title }: HeaderProps) {
  const { t } = useTranslation(); // Hook para acessar traduções
  const { theme, setTheme } = useTheme(); // Obtém o tema atual e função para alterá-lo
  const { sidebarCollapsed, setSidebarCollapsed, notifications } = useUIStore(); // Obtém estado do menu lateral e notificações

  const unreadNotifications = notifications.length; // Conta o número de notificações não lidas

  return (
    // Header principal, com espaçamento, fundo e borda inferior
    <header className="flex items-center gap-4 px-6 py-4 bg-background border-b">
      {/* Botão para abrir/fechar o menu lateral em telas pequenas */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Exibe o título se fornecido, apenas em telas médias ou maiores */}
      {title && (
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      )}

      {/* Campo de busca centralizado, com ícone de lupa */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('common.search')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Área de ações à direita: troca de tema e notificações */}
      <div className="flex items-center gap-2">
        {/* Menu suspenso para troca de tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {/* Ícone do tema atual */}
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'system' && <Monitor className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Opção para tema claro */}
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="w-4 h-4 mr-2" />
              {t('settings.light')}
            </DropdownMenuItem>
            {/* Opção para tema escuro */}
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="w-4 h-4 mr-2" />
              {t('settings.dark')}
            </DropdownMenuItem>
            {/* Opção para tema do sistema */}
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="w-4 h-4 mr-2" />
              {t('settings.system')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu suspenso de notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {/* Badge de notificações não lidas, aparece se houver notificações */}
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {/* Se não houver notificações, exibe mensagem */}
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {t('notifications.noNotifications')}
              </div>
            ) : (
              <>
                {/* Cabeçalho do menu de notificações com botão para marcar todas como lidas */}
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{t('notifications.title')}</h4>
                    <Button variant="ghost" size="sm">
                      {t('notifications.markAllRead')}
                    </Button>
                  </div>
                </div>
                {/* Lista de notificações, com rolagem se necessário */}
                <div className="max-h-96 overflow-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b last:border-b-0 hover:bg-accent"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">{notification.title}</h5>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}