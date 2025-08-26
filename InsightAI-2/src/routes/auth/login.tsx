import { useState } from 'react'; // Importa o hook de estado do React
import { Link, Navigate, useNavigate } from 'react-router-dom'; // Importa componentes e hooks de navegação do React Router
import { useForm } from 'react-hook-form'; // Importa hook para manipulação de formulários
import { zodResolver } from '@hookform/resolvers/zod'; // Importa o resolver para integração do zod com react-hook-form
import { z } from 'zod'; // Importa a biblioteca de validação zod
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { Eye, EyeOff, BarChart3 } from 'lucide-react'; // Importa ícones SVG
import { Button } from '../../components/ui/button'; // Importa componente de botão reutilizável
import { Input } from '../../components/ui/input'; // Importa componente de input reutilizável
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'; // Importa componentes de card
import { useAuth } from '../../providers/auth-provider'; // Importa hook de autenticação
import { useUIStore } from '../../store/ui'; // Importa hook para manipulação do estado global da UI

// Esquema de validação do formulário usando zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'), // Campo email obrigatório e válido
  password: z.string().min(1, 'Password is required'), // Campo senha obrigatório
});

// Tipagem dos dados do formulário baseada no esquema zod
type LoginFormData = z.infer<typeof loginSchema>;

// Componente funcional da página de login
export function LoginPage() {
  const { t } = useTranslation(); // Hook para traduções
  const navigate = useNavigate(); // Hook para navegação programática
  const { login, isAuthenticated, isLoading } = useAuth(); // Obtém funções e estados de autenticação
  const { addNotification } = useUIStore(); // Função para adicionar notificações
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha

  // Configuração do react-hook-form com validação zod e valores padrão
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@insightai.com',
      password: 'demo123',
    },
  });

  // Redireciona para dashboards se já estiver autenticado
  if (isAuthenticated) {
    return <Navigate to="/app/dashboards" replace />;
  }

  // Função chamada ao submeter o formulário
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password); // Tenta autenticar
      addNotification({
        type: 'success',
        title: t('auth.loginSuccess'),
        message: 'Welcome to InsightAI!',
      });
      navigate('/app/dashboards'); // Redireciona após login
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('auth.loginError'),
        message: error instanceof Error ? error.message : 'Invalid credentials',
      });
    }
  };

  return (
    // Container centralizado com gradiente de fundo
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        {/* Cabeçalho do card com logo e título */}
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">InsightAI</CardTitle>
            <CardDescription>
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Formulário de login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('auth.email')}
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Campo de senha com botão para mostrar/ocultar */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Botão de submit */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Signing in...' : t('auth.login')}
            </Button>
          </form>

          {/* Links para cadastro e recuperação de senha */}
          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="mt-2">
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          {/* Credenciais de demonstração */}
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <div className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</div>
            <div className="text-xs space-y-1">
              <div>Email: demo@insightai.com</div>
              <div>Password: demo123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}