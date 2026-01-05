import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import {
  Dashboard,
  Appointments,
  Clients,
  Services,
  Products,
  Payments,
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

const pages = {
  dashboard: Dashboard,
  appointments: Appointments,
  clients: Clients,
  services: Services,
  products: Products,
  payments: Payments,
  reports: Reports,
  settings: Settings,
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
          <PageComponent />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
