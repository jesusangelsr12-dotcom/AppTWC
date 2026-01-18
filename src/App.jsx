import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import {
  Dashboard,
  Appointments,
  Clients,
  Services,
  Products,
  Payments,
  Expenses,
  Finances,
  Reports,
  Settings,
} from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          <ToastProvider>
            <BrowserRouter>
              <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/citas" replace />} />
                <Route path="/citas" element={<Appointments />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/pagos" element={<Payments />} />
                <Route path="/gastos" element={<Expenses />} />
                <Route path="/finanzas" element={<Finances />} />
                <Route path="/reportes" element={<Reports />} />
                <Route path="/configuracion" element={<Settings />} />
                <Route path="*" element={<Navigate to="/citas" replace />} />
              </Routes>
              </Layout>
            </BrowserRouter>
          </ToastProvider>
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
