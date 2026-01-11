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
  [PAYMENT_METHODS.CARD]: 'Tarjeta (Hey Banco)',
  [PAYMENT_METHODS.TRANSFER]: 'Transferencia (BBVA)',
  [PAYMENT_METHODS.MIXED]: 'Mixto',
};

// Comisión por pago con tarjeta
export const CARD_COMMISSION_RATE = 0.035; // 3.5%

// Cuentas bancarias / Fuentes de dinero
export const ACCOUNTS = {
  CASH: 'cash',
  HEY_BANCO: 'hey_banco',
  BBVA: 'bbva',
};

export const ACCOUNTS_LABELS = {
  [ACCOUNTS.CASH]: 'Efectivo',
  [ACCOUNTS.HEY_BANCO]: 'Hey Banco (Tarjeta)',
  [ACCOUNTS.BBVA]: 'BBVA (Transferencia)',
};

export const ACCOUNTS_COLORS = {
  [ACCOUNTS.CASH]: '#10B981',
  [ACCOUNTS.HEY_BANCO]: '#8B5CF6',
  [ACCOUNTS.BBVA]: '#3B82F6',
};

// Configuración de distribución de bolsas (porcentajes)
export const DEFAULT_CASHFLOW_CONFIG = {
  rentPercentage: 0.20, // 20% de renta después de gastos fijos
  weeklyFixedExpenses: 0, // Gastos fijos semanales (configurable)

  // Distribución de lo que sobra después de gastos fijos y renta
  bags: {
    salon: {
      percentage: 0.64, // 64%
      label: 'Salón',
      subdivisions: null,
    },
    pagosVariables: {
      percentage: 0.33, // 33%
      label: 'Pagos Variables',
      subdivisions: {
        gress: { percentage: 0.85, label: 'Gress' },
        jesus: { percentage: 0.15, label: 'Jesus' },
      },
    },
    inversiones: {
      percentage: 0.03, // 3%
      label: 'Inversiones',
      subdivisions: {
        fondoEmergencia: { percentage: 0.50, label: 'Fondo de Emergencia' },
        inversion: { percentage: 0.20, label: 'Inversión' },
        bonoSociosExternos: { percentage: 0.10, label: 'Bono Socios Externos' },
        bonoDuena: { percentage: 0.20, label: 'Bono Dueña' },
      },
    },
  },
};

// Categorías de gastos
export const EXPENSE_CATEGORIES = {
  PRODUCTS: 'products',
  ADVERTISING: 'advertising',
  RENT: 'rent',
  MATERIALS: 'materials',
  WORK_MATERIALS: 'work_materials',
  VARIABLE_PAYMENTS: 'variable_payments',
  BONUSES: 'bonuses',
  UTILITIES: 'utilities',
  SALARIES: 'salaries',
  OTHER: 'other',
};

export const EXPENSE_CATEGORIES_LABELS = {
  [EXPENSE_CATEGORIES.PRODUCTS]: 'Productos',
  [EXPENSE_CATEGORIES.ADVERTISING]: 'Publicidad',
  [EXPENSE_CATEGORIES.RENT]: 'Renta',
  [EXPENSE_CATEGORIES.MATERIALS]: 'Materiales',
  [EXPENSE_CATEGORIES.WORK_MATERIALS]: 'Material de Trabajo',
  [EXPENSE_CATEGORIES.VARIABLE_PAYMENTS]: 'Pagos Variables',
  [EXPENSE_CATEGORIES.BONUSES]: 'Bonos',
  [EXPENSE_CATEGORIES.UTILITIES]: 'Servicios (luz, agua, etc.)',
  [EXPENSE_CATEGORIES.SALARIES]: 'Salarios',
  [EXPENSE_CATEGORIES.OTHER]: 'Otros',
};

// Bolsas para gastos
export const BAGS = {
  SALON: 'salon',
  PAGOS_VARIABLES: 'pagosVariables',
  INVERSIONES: 'inversiones',
};

export const BAGS_LABELS = {
  [BAGS.SALON]: 'Salón',
  [BAGS.PAGOS_VARIABLES]: 'Pagos Variables',
  [BAGS.INVERSIONES]: 'Inversiones',
};

export const SUBDIVISIONS = {
  // Pagos Variables
  GRESS: 'gress',
  JESUS: 'jesus',
  // Inversiones
  FONDO_EMERGENCIA: 'fondoEmergencia',
  INVERSION: 'inversion',
  BONO_SOCIOS_EXTERNOS: 'bonoSociosExternos',
  BONO_DUENA: 'bonoDuena',
};

export const SUBDIVISIONS_LABELS = {
  [SUBDIVISIONS.GRESS]: 'Gress',
  [SUBDIVISIONS.JESUS]: 'Jesus',
  [SUBDIVISIONS.FONDO_EMERGENCIA]: 'Fondo de Emergencia',
  [SUBDIVISIONS.INVERSION]: 'Inversión',
  [SUBDIVISIONS.BONO_SOCIOS_EXTERNOS]: 'Bono Socios Externos',
  [SUBDIVISIONS.BONO_DUENA]: 'Bono Dueña',
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

// Navegación reordenada según solicitud
export const NAV_ITEMS = [
  { id: 'appointments', label: 'Citas', icon: 'Calendar', path: '/citas' },
  { id: 'clients', label: 'Clientes', icon: 'Users', path: '/clientes' },
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'products', label: 'Productos', icon: 'Package', path: '/productos' },
  { id: 'services', label: 'Servicios', icon: 'Scissors', path: '/servicios' },
  { id: 'payments', label: 'Pagos', icon: 'CreditCard', path: '/pagos' },
  { id: 'expenses', label: 'Gastos', icon: 'Receipt', path: '/gastos' },
  { id: 'finances', label: 'Finanzas', icon: 'Wallet', path: '/finanzas' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3', path: '/reportes' },
  { id: 'settings', label: 'Configuración', icon: 'Settings', path: '/configuracion' },
];
