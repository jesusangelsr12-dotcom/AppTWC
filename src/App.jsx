import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
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

const pages = {
  dashboard: Dashboard,
  appointments: Appointments,
  clients: Clients,
  services: Services,
  products: Products,
  payments: Payments,
  expenses: Expenses,
  finances: Finances,
  reports: Reports,
  settings: Settings,
};

function App() {
  const [currentPage, setCurrentPage] = useState('appointments');

  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
            <PageComponent />
          </Layout>
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
