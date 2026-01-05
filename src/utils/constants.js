export const COLORS = {
  light: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  dark: {
    primary: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
  },
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Programada',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'En Progreso',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No Asistió',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pendiente',
  [PAYMENT_STATUS.PARTIAL]: 'Parcial',
  [PAYMENT_STATUS.PAID]: 'Pagado',
  [PAYMENT_STATUS.REFUNDED]: 'Reembolsado',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  MIXED: 'mixed',
};

export const PAYMENT_METHODS_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Efectivo',
  [PAYMENT_METHODS.CARD]: 'Tarjeta',
  [PAYMENT_METHODS.TRANSFER]: 'Transferencia',
  [PAYMENT_METHODS.MIXED]: 'Mixto',
};

export const SERVICE_CATEGORIES = {
  HAIR: 'hair',
  NAILS: 'nails',
  SKIN: 'skin',
  MAKEUP: 'makeup',
  SPA: 'spa',
  OTHER: 'other',
};

export const SERVICE_CATEGORIES_LABELS = {
  [SERVICE_CATEGORIES.HAIR]: 'Cabello',
  [SERVICE_CATEGORIES.NAILS]: 'Uñas',
  [SERVICE_CATEGORIES.SKIN]: 'Piel',
  [SERVICE_CATEGORIES.MAKEUP]: 'Maquillaje',
  [SERVICE_CATEGORIES.SPA]: 'Spa',
  [SERVICE_CATEGORIES.OTHER]: 'Otros',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'appointments', label: 'Citas', icon: 'Calendar', path: '/citas' },
  { id: 'clients', label: 'Clientes', icon: 'Users', path: '/clientes' },
  { id: 'services', label: 'Servicios', icon: 'Scissors', path: '/servicios' },
  { id: 'products', label: 'Productos', icon: 'Package', path: '/productos' },
  { id: 'payments', label: 'Pagos', icon: 'CreditCard', path: '/pagos' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3', path: '/reportes' },
  { id: 'settings', label: 'Configuración', icon: 'Settings', path: '/configuracion' },
];
