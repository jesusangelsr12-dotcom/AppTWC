import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CASHFLOW_CONFIG, ACCOUNTS, CARD_COMMISSION_RATE } from '../utils/constants';
import { generateId } from '../utils/helpers';
import {
  clients as mockClients,
  services as mockServices,
  products as mockProducts,
  stylists as mockStylists,
  appointments as mockAppointments,
} from '../data/mockData';

const DataContext = createContext();

const STORAGE_KEY = 'glamourpro_data';

// Estado inicial
const getInitialState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved data:', e);
    }
  }

  // Estado inicial con datos mock
  return {
    clients: mockClients,
    services: mockServices,
    products: mockProducts,
    stylists: mockStylists,
    appointments: mockAppointments.map(apt => ({
      ...apt,
      paymentDetails: null, // Detalles de pago múltiple
    })),
    payments: [],
    expenses: [],

    // Cuentas bancarias / fuentes de dinero
    accounts: {
      [ACCOUNTS.CASH]: { balance: 0, label: 'Efectivo' },
      [ACCOUNTS.HEY_BANCO]: { balance: 0, label: 'Hey Banco (Tarjeta)' },
      [ACCOUNTS.BBVA]: { balance: 0, label: 'BBVA (Transferencia)' },
    },

    // Bolsas acumuladas
    bags: {
      salon: { total: 0 },
      pagosVariables: {
        total: 0,
        subdivisions: {
          gress: 0,
          jesus: 0,
        },
      },
      inversiones: {
        total: 0,
        subdivisions: {
          fondoEmergencia: 0,
          inversion: 0,
          bonoSociosExternos: 0,
          bonoDuena: 0,
        },
      },
    },

    // Historial de flujo de caja semanal
    weeklyHistory: [],

    // Historial de movimientos entre cuentas/bolsas
    transfers: [],

    // Configuración
    config: {
      ...DEFAULT_CASHFLOW_CONFIG,
      salonName: 'GlamourPro Beauty Salon',
      phone: '(55) 1234-5678',
      email: 'contacto@glamourpro.com',
      address: 'Av. Principal #123, Col. Centro, Ciudad de México',
    },
  };
};

export function DataProvider({ children }) {
  const [data, setData] = useState(getInitialState);

  // Guardar en LocalStorage cada vez que cambia data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ==================== CLIENTES ====================
  const addClient = useCallback((client) => {
    const newClient = {
      id: generateId(),
      ...client,
      registeredAt: new Date().toISOString(),
      totalVisits: 0,
      totalSpent: 0,
      lastVisit: null,
    };
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));
    return newClient;
  }, []);

  const updateClient = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const deleteClient = useCallback((id) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id),
    }));
  }, []);

  // ==================== CITAS ====================
  const addAppointment = useCallback((appointment) => {
    const newAppointment = {
      id: generateId(),
      ...appointment,
      status: 'scheduled',
      paymentStatus: 'pending',
      paymentDetails: null,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment],
    }));
    return newAppointment;
  }, []);

  const updateAppointment = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  }, []);

  const deleteAppointment = useCallback((id) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id),
    }));
  }, []);

  // ==================== PAGOS ====================
  // Procesar pago con soporte para múltiples métodos
  const processPayment = useCallback((appointmentId, paymentDetails) => {
    /*
      paymentDetails = {
        methods: [
          { method: 'cash', amount: 500, account: 'cash' },
          { method: 'card', amount: 300, account: 'hey_banco' },
          { method: 'transfer', amount: 200, account: 'bbva' },
        ],
        tip: 50,
        discount: 0,
        notes: ''
      }
    */
    const appointment = data.appointments.find(a => a.id === appointmentId);
    if (!appointment) return null;

    const totalPaid = paymentDetails.methods.reduce((sum, m) => sum + m.amount, 0);

    // Calcular comisiones de tarjeta
    let totalCommission = 0;
    paymentDetails.methods.forEach(m => {
      if (m.method === 'card') {
        totalCommission += m.amount * CARD_COMMISSION_RATE;
      }
    });

    const netAmount = totalPaid - totalCommission;

    const payment = {
      id: generateId(),
      appointmentId,
      clientId: appointment.clientId,
      client: appointment.client,
      service: appointment.service,
      stylistId: appointment.stylistId,
      stylist: appointment.stylist,
      methods: paymentDetails.methods,
      subtotal: appointment.totalAmount,
      discount: paymentDetails.discount || 0,
      tip: paymentDetails.tip || 0,
      totalPaid,
      commission: totalCommission,
      netAmount,
      notes: paymentDetails.notes || '',
      paidAt: new Date().toISOString(),
      receiptNumber: `REC-${Date.now()}`,
    };

    // Actualizar cuentas bancarias
    const newAccounts = { ...data.accounts };
    paymentDetails.methods.forEach(m => {
      const accountKey = m.method === 'cash' ? ACCOUNTS.CASH :
                        m.method === 'card' ? ACCOUNTS.HEY_BANCO :
                        ACCOUNTS.BBVA;
      // Para tarjeta, solo entra el neto (menos comisión)
      const amountToAdd = m.method === 'card' ? m.amount * (1 - CARD_COMMISSION_RATE) : m.amount;
      newAccounts[accountKey] = {
        ...newAccounts[accountKey],
        balance: newAccounts[accountKey].balance + amountToAdd,
      };
    });

    // Propina va a efectivo por defecto
    if (paymentDetails.tip > 0) {
      newAccounts[ACCOUNTS.CASH].balance += paymentDetails.tip;
    }

    // Actualizar cliente
    const clientIndex = data.clients.findIndex(c => c.id === appointment.clientId);

    setData(prev => ({
      ...prev,
      payments: [...prev.payments, payment],
      accounts: newAccounts,
      appointments: prev.appointments.map(a =>
        a.id === appointmentId
          ? { ...a, status: 'completed', paymentStatus: 'paid', paymentDetails: payment }
          : a
      ),
      clients: prev.clients.map((c, i) =>
        i === clientIndex
          ? {
              ...c,
              totalVisits: c.totalVisits + 1,
              totalSpent: c.totalSpent + netAmount,
              lastVisit: new Date().toISOString(),
            }
          : c
      ),
    }));

    return payment;
  }, [data.appointments, data.accounts, data.clients]);

  // ==================== GASTOS ====================
  const addExpense = useCallback((expense) => {
    /*
      expense = {
        description: 'Compra de productos',
        amount: 500,
        category: 'products',
        account: 'cash', // De dónde sale el dinero
        bag: 'salon', // De qué bolsa sale
        subdivision: null, // Si aplica
        date: '2024-01-15',
        notes: ''
      }
    */
    const newExpense = {
      id: generateId(),
      ...expense,
      createdAt: new Date().toISOString(),
    };

    // Restar de la cuenta
    const newAccounts = { ...data.accounts };
    if (newAccounts[expense.account]) {
      newAccounts[expense.account].balance -= expense.amount;
    }

    // Restar de la bolsa
    const newBags = JSON.parse(JSON.stringify(data.bags));
    if (expense.bag && newBags[expense.bag]) {
      if (expense.subdivision && newBags[expense.bag].subdivisions) {
        newBags[expense.bag].subdivisions[expense.subdivision] -= expense.amount;
      }
      newBags[expense.bag].total -= expense.amount;
    }

    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
      accounts: newAccounts,
      bags: newBags,
    }));

    return newExpense;
  }, [data.accounts, data.bags]);

  const deleteExpense = useCallback((id) => {
    const expense = data.expenses.find(e => e.id === id);
    if (!expense) return;

    // Revertir el gasto
    const newAccounts = { ...data.accounts };
    if (newAccounts[expense.account]) {
      newAccounts[expense.account].balance += expense.amount;
    }

    const newBags = JSON.parse(JSON.stringify(data.bags));
    if (expense.bag && newBags[expense.bag]) {
      if (expense.subdivision && newBags[expense.bag].subdivisions) {
        newBags[expense.bag].subdivisions[expense.subdivision] += expense.amount;
      }
      newBags[expense.bag].total += expense.amount;
    }

    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
      accounts: newAccounts,
      bags: newBags,
    }));
  }, [data.expenses, data.accounts, data.bags]);

  // ==================== FLUJO DE CAJA SEMANAL ====================
  const processWeeklyCashflow = useCallback((weekStartDate, totalIncome) => {
    const config = data.config;

    // 1. Restar gastos fijos
    const afterFixedExpenses = totalIncome - config.weeklyFixedExpenses;

    // 2. Calcular renta (20% de lo que queda)
    const rent = afterFixedExpenses * config.rentPercentage;
    const afterRent = afterFixedExpenses - rent;

    // 3. Distribuir en bolsas
    const distribution = {
      salon: afterRent * config.bags.salon.percentage,
      pagosVariables: {
        total: afterRent * config.bags.pagosVariables.percentage,
        gress: afterRent * config.bags.pagosVariables.percentage * config.bags.pagosVariables.subdivisions.gress.percentage,
        jesus: afterRent * config.bags.pagosVariables.percentage * config.bags.pagosVariables.subdivisions.jesus.percentage,
      },
      inversiones: {
        total: afterRent * config.bags.inversiones.percentage,
        fondoEmergencia: afterRent * config.bags.inversiones.percentage * config.bags.inversiones.subdivisions.fondoEmergencia.percentage,
        inversion: afterRent * config.bags.inversiones.percentage * config.bags.inversiones.subdivisions.inversion.percentage,
        bonoSociosExternos: afterRent * config.bags.inversiones.percentage * config.bags.inversiones.subdivisions.bonoSociosExternos.percentage,
        bonoDuena: afterRent * config.bags.inversiones.percentage * config.bags.inversiones.subdivisions.bonoDuena.percentage,
      },
    };

    const weeklyRecord = {
      id: generateId(),
      weekStartDate,
      totalIncome,
      fixedExpenses: config.weeklyFixedExpenses,
      rent,
      distribution,
      processedAt: new Date().toISOString(),
    };

    // Actualizar bolsas acumuladas
    const newBags = JSON.parse(JSON.stringify(data.bags));
    newBags.salon.total += distribution.salon;
    newBags.pagosVariables.total += distribution.pagosVariables.total;
    newBags.pagosVariables.subdivisions.gress += distribution.pagosVariables.gress;
    newBags.pagosVariables.subdivisions.jesus += distribution.pagosVariables.jesus;
    newBags.inversiones.total += distribution.inversiones.total;
    newBags.inversiones.subdivisions.fondoEmergencia += distribution.inversiones.fondoEmergencia;
    newBags.inversiones.subdivisions.inversion += distribution.inversiones.inversion;
    newBags.inversiones.subdivisions.bonoSociosExternos += distribution.inversiones.bonoSociosExternos;
    newBags.inversiones.subdivisions.bonoDuena += distribution.inversiones.bonoDuena;

    setData(prev => ({
      ...prev,
      weeklyHistory: [...prev.weeklyHistory, weeklyRecord],
      bags: newBags,
    }));

    return weeklyRecord;
  }, [data.config, data.bags]);

  // ==================== TRANSFERENCIAS ENTRE CUENTAS/BOLSAS ====================
  const transferBetweenAccounts = useCallback((fromAccount, toAccount, amount, notes = '') => {
    const transfer = {
      id: generateId(),
      type: 'account_transfer',
      from: fromAccount,
      to: toAccount,
      amount,
      notes,
      createdAt: new Date().toISOString(),
    };

    const newAccounts = { ...data.accounts };
    newAccounts[fromAccount].balance -= amount;
    newAccounts[toAccount].balance += amount;

    setData(prev => ({
      ...prev,
      accounts: newAccounts,
      transfers: [...prev.transfers, transfer],
    }));

    return transfer;
  }, [data.accounts]);

  const updateBagManually = useCallback((bag, subdivision, newValue, notes = '') => {
    const transfer = {
      id: generateId(),
      type: 'bag_adjustment',
      bag,
      subdivision,
      oldValue: subdivision
        ? data.bags[bag]?.subdivisions?.[subdivision]
        : data.bags[bag]?.total,
      newValue,
      notes,
      createdAt: new Date().toISOString(),
    };

    const newBags = JSON.parse(JSON.stringify(data.bags));
    if (subdivision && newBags[bag]?.subdivisions) {
      const diff = newValue - newBags[bag].subdivisions[subdivision];
      newBags[bag].subdivisions[subdivision] = newValue;
      newBags[bag].total += diff;
    } else if (newBags[bag]) {
      newBags[bag].total = newValue;
    }

    setData(prev => ({
      ...prev,
      bags: newBags,
      transfers: [...prev.transfers, transfer],
    }));

    return transfer;
  }, [data.bags]);

  // ==================== CONFIGURACIÓN ====================
  const updateConfig = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      config: { ...prev.config, ...updates },
    }));
  }, []);

  // ==================== SERVICIOS ====================
  const addService = useCallback((service) => {
    const newService = {
      id: generateId(),
      ...service,
    };
    setData(prev => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    return newService;
  }, []);

  const updateService = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const deleteService = useCallback((id) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id),
    }));
  }, []);

  // ==================== PRODUCTOS ====================
  const addProduct = useCallback((product) => {
    const newProduct = {
      id: generateId(),
      ...product,
    };
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deleteProduct = useCallback((id) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }));
  }, []);

  // ==================== ESTILISTAS ====================
  const addStylist = useCallback((stylist) => {
    const newStylist = {
      id: generateId(),
      ...stylist,
    };
    setData(prev => ({
      ...prev,
      stylists: [...prev.stylists, newStylist],
    }));
    return newStylist;
  }, []);

  const updateStylist = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      stylists: prev.stylists.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  // ==================== BACKUP / EXPORT / IMPORT ====================
  const exportData = useCallback(() => {
    const exportObj = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glamourpro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonData) => {
    try {
      const imported = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      // Validar estructura básica
      if (!imported.clients || !imported.appointments) {
        throw new Error('Archivo de backup inválido');
      }
      setData(imported);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getInitialState());
  }, []);

  const value = {
    // Data
    ...data,

    // Client actions
    addClient,
    updateClient,
    deleteClient,

    // Appointment actions
    addAppointment,
    updateAppointment,
    deleteAppointment,

    // Payment actions
    processPayment,

    // Expense actions
    addExpense,
    deleteExpense,

    // Cashflow actions
    processWeeklyCashflow,
    transferBetweenAccounts,
    updateBagManually,

    // Config actions
    updateConfig,

    // Service actions
    addService,
    updateService,
    deleteService,

    // Product actions
    addProduct,
    updateProduct,
    deleteProduct,

    // Stylist actions
    addStylist,
    updateStylist,

    // Backup actions
    exportData,
    importData,
    resetData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
