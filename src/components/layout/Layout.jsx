import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/helpers';

const PAGE_TITLES = {
  '/citas': 'Gestión de Citas',
  '/clientes': 'Clientes',
  '/dashboard': 'Dashboard',
  '/productos': 'Productos',
  '/servicios': 'Servicios',
  '/pagos': 'Pagos',
  '/gastos': 'Gastos',
  '/finanzas': 'Finanzas',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
};

export function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;
  const title = PAGE_TITLES[currentPath] || 'GlamourPro';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPath={currentPath}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Header
        title={title}
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
