import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

const NAV_ICONS = {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  CreditCard,
  BarChart3,
  Settings,
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'appointments', label: 'Citas', icon: 'Calendar', path: '/citas' },
  { id: 'clients', label: 'Clientes', icon: 'Users', path: '/clientes' },
  { id: 'services', label: 'Servicios', icon: 'Scissors', path: '/servicios' },
  { id: 'products', label: 'Productos', icon: 'Package', path: '/productos' },
  { id: 'payments', label: 'Pagos', icon: 'CreditCard', path: '/pagos' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3', path: '/reportes' },
  { id: 'settings', label: 'Configuración', icon: 'Settings', path: '/configuracion' },
];

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-salon-pink to-salon-purple flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">GlamourPro</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-500 dark:text-primary-400')} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? (isDark ? 'Modo claro' : 'Modo oscuro') : undefined}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && <span className="font-medium">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>}
        </button>
      </div>
    </aside>
  );
}
