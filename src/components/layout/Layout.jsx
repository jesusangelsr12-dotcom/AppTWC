import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/helpers';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  appointments: 'Gestión de Citas',
  clients: 'Clientes',
  services: 'Servicios',
  products: 'Productos',
  payments: 'Pagos',
  reports: 'Reportes',
  settings: 'Configuración',
};

export function Layout({ children, currentPage, onNavigate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Header
        title={PAGE_TITLES[currentPage] || 'Dashboard'}
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
