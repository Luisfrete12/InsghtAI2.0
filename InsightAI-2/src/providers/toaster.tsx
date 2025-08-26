import { useUIStore } from '../store/ui'; // Importa o hook para acessar e manipular notificações do estado global da UI
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../components/ui/toast'; // Importa componentes de toast (notificação) reutilizáveis
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'; // Importa ícones SVG para diferentes tipos de notificação

// Mapeia os tipos de notificação para seus respectivos ícones
const toastIcons = {
  success: CheckCircle2, // Ícone para sucesso
  error: AlertCircle,    // Ícone para erro
  warning: AlertTriangle,// Ícone para aviso
  info: Info,            // Ícone para informação
};

// Componente Toaster, responsável por exibir as notificações (toasts) na tela
export function Toaster() {
  const { notifications, removeNotification } = useUIStore(); // Obtém a lista de notificações e função para removê-las

  return (
    <ToastProvider>
      {/* Renderiza um Toast para cada notificação presente no estado */}
      {notifications.map((notification) => {
        const IconComponent = toastIcons[notification.type]; // Seleciona o ícone conforme o tipo da notificação
        
        return (
          // Cada Toast recebe uma chave única e remove a notificação ao ser fechado
          <Toast key={notification.id} onOpenChange={() => removeNotification(notification.id)}>
            <div className="flex items-start gap-3">
              {/* Ícone do tipo da notificação, com cor específica */}
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className={`h-4 w-4 ${
                  notification.type === 'success' ? 'text-green-600' :
                  notification.type === 'error' ? 'text-red-600' :
                  notification.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
              {/* Conteúdo textual da notificação: título e mensagem */}
              <div className="flex-1 min-w-0">
                <ToastTitle>{notification.title}</ToastTitle>
                {notification.message && (
                  <ToastDescription>{notification.message}</ToastDescription>
                )}
              </div>
            </div>
            {/* Botão para fechar o toast manualmente */}
            <ToastClose />
          </Toast>
        );
      })}
      {/* Define onde os toasts aparecem na tela */}
      <ToastViewport />
    </ToastProvider>
  );
}