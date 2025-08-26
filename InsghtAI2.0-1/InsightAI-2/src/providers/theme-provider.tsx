import React, { createContext, useContext, useEffect, ReactNode } from 'react'; // Importa React e hooks necessários
import { useUIStore } from '../store/ui'; // Importa hook para acessar e modificar o estado global da UI

// Define os tipos possíveis de tema
type Theme = 'dark' | 'light' | 'system';

// Interface do contexto do ThemeProvider, descreve os dados e funções disponíveis
interface ThemeProviderContextType {
  theme: Theme; // Tema atual selecionado ('dark', 'light' ou 'system')
  setTheme: (theme: Theme) => void; // Função para alterar o tema
  actualTheme: 'dark' | 'light'; // Tema efetivamente aplicado (resolvido)
}

// Cria o contexto do ThemeProvider, inicialmente indefinido
const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto do tema
export function useTheme() {
  const context = useContext(ThemeProviderContext); // Obtém o contexto
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider'); // Garante que está dentro do provider
  }
  return context;
}

// Interface das propriedades aceitas pelo ThemeProvider
interface ThemeProviderProps {
  children: ReactNode; // Elementos filhos a serem renderizados dentro do provider
  defaultTheme?: Theme; // Tema padrão ao iniciar (opcional)
  storageKey?: string; // Chave para salvar o tema no storage (opcional)
  attribute?: string; // Atributo HTML usado para aplicar o tema (opcional)
  enableSystem?: boolean; // Permite usar o tema do sistema operacional (opcional)
  disableTransitionOnChange?: boolean; // Desabilita transições ao trocar tema (opcional)
}

// Componente ThemeProvider, responsável por fornecer o contexto de tema para a árvore de componentes
export function ThemeProvider({
  children,
  defaultTheme = 'system', // Tema padrão é 'system'
  storageKey = 'vite-ui-theme', // Chave padrão para storage
  attribute = 'class', // Usa a classe do HTML para aplicar o tema
  enableSystem = true, // Permite tema do sistema por padrão
  disableTransitionOnChange = false, // Não desabilita transições por padrão
  ...props
}: ThemeProviderProps) {
  const { theme, setTheme: setStoreTheme } = useUIStore(); // Obtém o tema atual e função para alterá-lo do estado global
  const [actualTheme, setActualTheme] = React.useState<'dark' | 'light'>('light'); // Estado local para o tema efetivamente aplicado

  // Função para alterar o tema, atualiza o estado global
  const setTheme = (newTheme: Theme) => {
    setStoreTheme(newTheme);
  };

  // Efeito para aplicar o tema ao elemento root do documento sempre que o tema mudar
  useEffect(() => {
    const root = window.document.documentElement;

    root.removeAttribute('data-theme'); // Remove atributo de tema customizado, se houver
    root.classList.remove('light', 'dark'); // Remove classes de tema anteriores

    if (theme === 'system' && enableSystem) {
      // Se o tema for 'system', detecta o tema do sistema operacional
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme); // Aplica classe do tema do sistema
      setActualTheme(systemTheme); // Atualiza estado local
      return;
    }

    // Se não for 'system', aplica o tema selecionado (ou 'light' por padrão)
    const resolvedTheme = theme === 'system' ? 'light' : theme;
    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
  }, [theme, enableSystem]);

  // Efeito para atualizar o tema automaticamente se o usuário mudar o tema do sistema operacional
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
        setActualTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange); // Escuta mudanças no tema do sistema
    return () => mediaQuery.removeEventListener('change', handleChange); // Limpa o listener ao desmontar
  }, [theme]);

  // Monta o valor do contexto com os dados e funções
  const value: ThemeProviderContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  // Retorna o provider do contexto, envolvendo os filhos
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}