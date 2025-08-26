import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from './providers/theme-provider';
import { AuthProvider } from './providers/auth-provider';
import { Toaster } from './providers/toaster';

import { AuthGuard } from './components/auth/auth-guard';

// Auth routes
import { LoginPage } from './routes/auth/login';

// App routes
import  {AppIndexPage}  from './routes/app/index';
import { DashboardsPage } from './routes/app/dashboards';
import { DatasetsPage } from './routes/app/datasets';
import { SettingsPage } from './routes/app/settings';

import './i18n';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/index" element={<AppIndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage />} />
              <Route path="/forgot-password" element={<LoginPage />} />
              
              {/* Protected app routes */}
              <Route path="/app/index" element={<AuthGuard><AppIndexPage /></AuthGuard>} />
              <Route path="/app/dashboards" element={<AuthGuard><DashboardsPage /></AuthGuard>} />
              <Route path="/app/datasets" element={<AuthGuard><DatasetsPage /></AuthGuard>} />
              <Route path="/app/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <AuthGuard requiredRoles={['owner', 'admin']}>
                  <div className="p-6">Admin area coming soon...</div>
                </AuthGuard>
              } />

              {/* Default redirect */}
              
             {/*
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
              */ }
            </Routes>
          </Router>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;