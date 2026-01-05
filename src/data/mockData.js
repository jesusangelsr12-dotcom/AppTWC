import { subDays, addHours, addMinutes, setHours, setMinutes, format } from 'date-fns';

// Helpers para generar datos aleatorios
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Datos base
const FIRST_NAMES = [
  'María', 'Ana', 'Laura', 'Carmen', 'Patricia', 'Rosa', 'Elena', 'Sofía',
  'Claudia', 'Diana', 'Gabriela', 'Fernanda', 'Alejandra', 'Lucía', 'Isabella',
  'Valentina', 'Camila', 'Daniela', 'Andrea', 'Victoria', 'Natalia', 'Mariana',
  'Paula', 'Sara', 'Mónica', 'Adriana', 'Jessica', 'Carolina', 'Verónica', 'Lorena'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez',
  'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz',
  'Morales', 'Reyes', 'Ortiz', 'Gutiérrez', 'Chávez', 'Ramos', 'Vargas', 'Castillo'
];

const PHONE_PREFIXES = ['55', '33', '81', '442', '614', '667', '998'];

const STYLISTS = [
  { id: 'styl_1', name: 'Jessica Mendoza', speciality: 'Colorista', avatar: null },
  { id: 'styl_2', name: 'Andrea López', speciality: 'Estilista', avatar: null },
  { id: 'styl_3', name: 'Mariana Ruiz', speciality: 'Manicurista', avatar: null },
  { id: 'styl_4', name: 'Valeria Torres', speciality: 'Maquillista', avatar: null },
  { id: 'styl_5', name: 'Diana Castillo', speciality: 'Esteticista', avatar: null },
];

// Servicios del salón
export const services = [
  // Cabello
  { id: 'srv_1', name: 'Corte de cabello', category: 'hair', duration: 45, price: 350, description: 'Corte profesional con lavado y secado' },
  { id: 'srv_2', name: 'Tinte completo', category: 'hair', duration: 120, price: 850, description: 'Aplicación de color completo' },
  { id: 'srv_3', name: 'Mechas/Highlights', category: 'hair', duration: 150, price: 1200, description: 'Técnica de mechas con papel' },
  { id: 'srv_4', name: 'Balayage', category: 'hair', duration: 180, price: 1500, description: 'Técnica de balayage a mano alzada' },
  { id: 'srv_5', name: 'Peinado especial', category: 'hair', duration: 60, price: 500, description: 'Peinado para eventos especiales' },
  { id: 'srv_6', name: 'Tratamiento capilar', category: 'hair', duration: 45, price: 400, description: 'Hidratación profunda' },
  { id: 'srv_7', name: 'Alisado keratina', category: 'hair', duration: 180, price: 2500, description: 'Alisado con keratina brasileña' },
  { id: 'srv_8', name: 'Lavado y secado', category: 'hair', duration: 30, price: 200, description: 'Lavado con masaje y secado' },

  // Uñas
  { id: 'srv_9', name: 'Manicure básico', category: 'nails', duration: 30, price: 180, description: 'Limpieza, limado y esmalte' },
  { id: 'srv_10', name: 'Manicure gel', category: 'nails', duration: 45, price: 350, description: 'Manicure con esmalte semipermanente' },
  { id: 'srv_11', name: 'Uñas acrílicas', category: 'nails', duration: 90, price: 650, description: 'Aplicación de uñas acrílicas' },
  { id: 'srv_12', name: 'Pedicure spa', category: 'nails', duration: 60, price: 400, description: 'Pedicure completo con exfoliación' },
  { id: 'srv_13', name: 'Diseño de uñas', category: 'nails', duration: 30, price: 150, description: 'Nail art y decoraciones' },

  // Piel/Facial
  { id: 'srv_14', name: 'Limpieza facial', category: 'skin', duration: 60, price: 550, description: 'Limpieza profunda con extracción' },
  { id: 'srv_15', name: 'Hidrafacial', category: 'skin', duration: 75, price: 1200, description: 'Tratamiento facial hidratante' },
  { id: 'srv_16', name: 'Depilación cejas', category: 'skin', duration: 15, price: 80, description: 'Diseño y depilación de cejas' },
  { id: 'srv_17', name: 'Depilación facial', category: 'skin', duration: 30, price: 200, description: 'Depilación de rostro completo' },

  // Maquillaje
  { id: 'srv_18', name: 'Maquillaje social', category: 'makeup', duration: 45, price: 450, description: 'Maquillaje para eventos' },
  { id: 'srv_19', name: 'Maquillaje novia', category: 'makeup', duration: 90, price: 1500, description: 'Maquillaje nupcial con prueba' },
  { id: 'srv_20', name: 'Aplicación pestañas', category: 'makeup', duration: 30, price: 300, description: 'Pestañas postizas de tira' },

  // Spa
  { id: 'srv_21', name: 'Masaje relajante', category: 'spa', duration: 60, price: 600, description: 'Masaje corporal relajante' },
  { id: 'srv_22', name: 'Masaje descontracturante', category: 'spa', duration: 60, price: 700, description: 'Masaje terapéutico' },
  { id: 'srv_23', name: 'Exfoliación corporal', category: 'spa', duration: 45, price: 450, description: 'Exfoliación con hidratación' },
];

// Productos del salón
export const products = [
  // Cabello
  { id: 'prod_1', name: 'Shampoo Profesional 500ml', category: 'hair', price: 380, stock: 25, minStock: 5, brand: 'L\'Oréal' },
  { id: 'prod_2', name: 'Acondicionador Reparador 500ml', category: 'hair', price: 420, stock: 18, minStock: 5, brand: 'L\'Oréal' },
  { id: 'prod_3', name: 'Mascarilla Hidratante 250ml', category: 'hair', price: 550, stock: 12, minStock: 3, brand: 'Moroccanoil' },
  { id: 'prod_4', name: 'Aceite de Argán 100ml', category: 'hair', price: 890, stock: 8, minStock: 3, brand: 'Moroccanoil' },
  { id: 'prod_5', name: 'Spray Protector Térmico', category: 'hair', price: 320, stock: 15, minStock: 4, brand: 'TRESemmé' },
  { id: 'prod_6', name: 'Cera Modeladora', category: 'hair', price: 280, stock: 10, minStock: 3, brand: 'Gatsby' },
  { id: 'prod_7', name: 'Tinte Profesional', category: 'hair', price: 180, stock: 45, minStock: 10, brand: 'Wella' },
  { id: 'prod_8', name: 'Oxidante 20 Vol 1L', category: 'hair', price: 150, stock: 20, minStock: 5, brand: 'Wella' },

  // Uñas
  { id: 'prod_9', name: 'Esmalte Gel UV', category: 'nails', price: 180, stock: 40, minStock: 10, brand: 'OPI' },
  { id: 'prod_10', name: 'Base Coat', category: 'nails', price: 220, stock: 15, minStock: 5, brand: 'OPI' },
  { id: 'prod_11', name: 'Top Coat Brillante', category: 'nails', price: 220, stock: 15, minStock: 5, brand: 'OPI' },
  { id: 'prod_12', name: 'Polvo Acrílico 30g', category: 'nails', price: 350, stock: 8, minStock: 3, brand: 'Mia Secret' },
  { id: 'prod_13', name: 'Acetona 1L', category: 'nails', price: 120, stock: 10, minStock: 3, brand: 'Genérico' },
  { id: 'prod_14', name: 'Crema Hidratante Manos', category: 'nails', price: 180, stock: 20, minStock: 5, brand: 'Neutrogena' },

  // Piel
  { id: 'prod_15', name: 'Gel Limpiador Facial', category: 'skin', price: 420, stock: 12, minStock: 4, brand: 'La Roche-Posay' },
  { id: 'prod_16', name: 'Sérum Vitamina C', category: 'skin', price: 890, stock: 6, minStock: 2, brand: 'SkinCeuticals' },
  { id: 'prod_17', name: 'Crema Hidratante SPF30', category: 'skin', price: 680, stock: 10, minStock: 3, brand: 'CeraVe' },
  { id: 'prod_18', name: 'Tónico Facial', category: 'skin', price: 350, stock: 14, minStock: 4, brand: 'Thayers' },
  { id: 'prod_19', name: 'Cera Depilatoria 400g', category: 'skin', price: 280, stock: 8, minStock: 3, brand: 'Depilflax' },

  // Maquillaje
  { id: 'prod_20', name: 'Base de Maquillaje', category: 'makeup', price: 650, stock: 10, minStock: 3, brand: 'MAC' },
  { id: 'prod_21', name: 'Paleta de Sombras', category: 'makeup', price: 1200, stock: 5, minStock: 2, brand: 'Urban Decay' },
  { id: 'prod_22', name: 'Labial Mate', category: 'makeup', price: 380, stock: 25, minStock: 8, brand: 'MAC' },
  { id: 'prod_23', name: 'Pestañas Postizas', category: 'makeup', price: 180, stock: 30, minStock: 10, brand: 'Ardell' },
  { id: 'prod_24', name: 'Fijador de Maquillaje', category: 'makeup', price: 450, stock: 12, minStock: 4, brand: 'Urban Decay' },
];

// Generar clientes
const generateClients = (count) => {
  const clients = [];
  for (let i = 0; i < count; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const prefix = randomItem(PHONE_PREFIXES);
    const daysAgo = randomInt(1, 365);

    clients.push({
      id: `cli_${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `${prefix}${randomInt(1000000, 9999999)}`,
      birthdate: subDays(new Date(), randomInt(6570, 21900)).toISOString(), // 18-60 años
      registeredAt: subDays(new Date(), daysAgo).toISOString(),
      notes: randomInt(0, 10) > 7 ? 'Cliente frecuente, prefiere productos orgánicos' : '',
      totalVisits: randomInt(1, 50),
      totalSpent: parseFloat(randomFloat(500, 25000)),
      lastVisit: subDays(new Date(), randomInt(0, 90)).toISOString(),
    });
  }
  return clients;
};

// Generar 50 clientes
export const clients = generateClients(50);

// Generar citas (100 registros de los últimos 30 días)
const APPOINTMENT_STATUSES = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];

const generateAppointments = (count) => {
  const appointments = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysOffset = randomInt(-30, 7); // últimos 30 días + próximos 7
    const hour = randomInt(9, 19); // 9am - 7pm
    const minute = randomItem([0, 15, 30, 45]);

    let date = subDays(now, -daysOffset);
    date = setHours(date, hour);
    date = setMinutes(date, minute);

    const client = randomItem(clients);
    const service = randomItem(services);
    const stylist = randomItem(STYLISTS);

    // Status basado en la fecha
    let status;
    if (daysOffset > 0) {
      // Citas futuras
      status = randomItem(['scheduled', 'confirmed']);
    } else if (daysOffset === 0) {
      // Hoy
      status = randomItem(['scheduled', 'confirmed', 'in_progress', 'completed']);
    } else {
      // Pasadas
      status = randomItem(['completed', 'completed', 'completed', 'cancelled', 'no_show']);
    }

    const isPaid = status === 'completed' && randomInt(0, 10) > 2;

    appointments.push({
      id: `apt_${i + 1}`,
      clientId: client.id,
      client: {
        id: client.id,
        name: client.fullName,
        phone: client.phone,
      },
      serviceId: service.id,
      service: {
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
      },
      stylistId: stylist.id,
      stylist: {
        id: stylist.id,
        name: stylist.name,
      },
      dateTime: date.toISOString(),
      duration: service.duration,
      status,
      notes: randomInt(0, 10) > 8 ? 'Cliente pidió cita de seguimiento' : '',
      totalAmount: service.price,
      paymentStatus: isPaid ? 'paid' : (status === 'completed' ? 'pending' : 'pending'),
      createdAt: subDays(date, randomInt(1, 14)).toISOString(),
    });
  }

  // Ordenar por fecha
  return appointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
};

export const appointments = generateAppointments(100);

// Generar pagos
const PAYMENT_METHODS = ['cash', 'card', 'transfer'];

const generatePayments = () => {
  const payments = [];
  const completedAppointments = appointments.filter(a => a.status === 'completed' && a.paymentStatus === 'paid');

  completedAppointments.forEach((apt, index) => {
    const method = randomItem(PAYMENT_METHODS);
    const hasProductSale = randomInt(0, 10) > 7;
    const productsSold = hasProductSale ? [
      {
        product: randomItem(products),
        quantity: randomInt(1, 2),
      }
    ] : [];

    const productsTotal = productsSold.reduce((sum, p) => sum + (p.product.price * p.quantity), 0);

    payments.push({
      id: `pay_${index + 1}`,
      appointmentId: apt.id,
      clientId: apt.clientId,
      client: apt.client,
      services: [{
        service: apt.service,
        price: apt.service.price,
      }],
      products: productsSold,
      subtotalServices: apt.service.price,
      subtotalProducts: productsTotal,
      discount: randomInt(0, 10) > 8 ? parseFloat(randomFloat(50, 200)) : 0,
      tip: randomInt(0, 10) > 6 ? parseFloat(randomFloat(20, 100)) : 0,
      total: apt.service.price + productsTotal,
      method,
      status: 'paid',
      paidAt: apt.dateTime,
      createdAt: apt.dateTime,
      receiptNumber: `REC-${format(new Date(apt.dateTime), 'yyyyMMdd')}-${String(index + 1).padStart(4, '0')}`,
    });
  });

  return payments;
};

export const payments = generatePayments();

// Estadísticas de ingresos por día (últimos 30 días)
export const generateDailyRevenue = () => {
  const revenue = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayPayments = payments.filter(p => {
      const payDate = new Date(p.paidAt);
      return payDate.toDateString() === date.toDateString();
    });

    revenue.push({
      date: date.toISOString(),
      dateFormatted: format(date, 'dd/MM'),
      services: dayPayments.reduce((sum, p) => sum + p.subtotalServices, 0),
      products: dayPayments.reduce((sum, p) => sum + p.subtotalProducts, 0),
      total: dayPayments.reduce((sum, p) => sum + p.total, 0),
      transactions: dayPayments.length,
    });
  }
  return revenue;
};

export const dailyRevenue = generateDailyRevenue();

// Estadísticas generales
export const getStats = () => {
  const today = new Date();
  const todayStr = today.toDateString();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const todayAppointments = appointments.filter(a =>
    new Date(a.dateTime).toDateString() === todayStr
  );

  const monthPayments = payments.filter(p => {
    const d = new Date(p.paidAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const lastMonthPayments = payments.filter(p => {
    const d = new Date(p.paidAt);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const year = thisMonth === 0 ? thisYear - 1 : thisYear;
    return d.getMonth() === lastMonth && d.getFullYear() === year;
  });

  return {
    todayAppointments: todayAppointments.length,
    todayRevenue: todayAppointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.totalAmount, 0),
    monthRevenue: monthPayments.reduce((sum, p) => sum + p.total, 0),
    lastMonthRevenue: lastMonthPayments.reduce((sum, p) => sum + p.total, 0),
    totalClients: clients.length,
    newClientsThisMonth: clients.filter(c => {
      const d = new Date(c.registeredAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length,
    pendingPayments: appointments.filter(a =>
      a.status === 'completed' && a.paymentStatus === 'pending'
    ).length,
    upcomingAppointments: appointments.filter(a =>
      new Date(a.dateTime) > today && ['scheduled', 'confirmed'].includes(a.status)
    ).length,
  };
};

// Servicios más populares
export const getPopularServices = () => {
  const serviceCounts = {};

  appointments.filter(a => a.status === 'completed').forEach(apt => {
    const serviceId = apt.serviceId;
    if (!serviceCounts[serviceId]) {
      serviceCounts[serviceId] = {
        service: apt.service,
        count: 0,
        revenue: 0,
      };
    }
    serviceCounts[serviceId].count++;
    serviceCounts[serviceId].revenue += apt.service.price;
  });

  return Object.values(serviceCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

// Estilistas exportados
export const stylists = STYLISTS;
