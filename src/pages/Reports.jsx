import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { useTheme } from '../context/ThemeContext';
import { dailyRevenue, payments, appointments, getPopularServices } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import { SERVICE_CATEGORIES_LABELS } from '../utils/constants';

const COLORS = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function Reports() {
  const { isDark } = useTheme();

  const popularServices = useMemo(() => getPopularServices(), []);

  const paymentMethodsData = useMemo(() => {
    const methods = { cash: 0, card: 0, transfer: 0 };
    payments.forEach((p) => {
      methods[p.method] += p.total;
    });
    return [
      { name: 'Efectivo', value: methods.cash },
      { name: 'Tarjeta', value: methods.card },
      { name: 'Transferencia', value: methods.transfer },
    ];
  }, []);

  const categoryRevenueData = useMemo(() => {
    const categories = {};
    appointments
      .filter((a) => a.status === 'completed')
      .forEach((apt) => {
        const cat = apt.service.id.startsWith('srv_1') || apt.service.id.startsWith('srv_2') ||
                   apt.service.id.startsWith('srv_3') || apt.service.id.startsWith('srv_4') ||
                   apt.service.id.startsWith('srv_5') || apt.service.id.startsWith('srv_6') ||
                   apt.service.id.startsWith('srv_7') || apt.service.id.startsWith('srv_8')
          ? 'hair'
          : apt.service.id.startsWith('srv_9') || apt.service.id.startsWith('srv_1')
            ? 'nails'
            : 'other';

        if (!categories[cat]) {
          categories[cat] = 0;
        }
        categories[cat] += apt.service.price;
      });

    return Object.entries(categories).map(([key, value]) => ({
      name: SERVICE_CATEGORIES_LABELS[key] || key,
      value,
    }));
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Bar Chart */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Ingresos Diarios (Últimos 30 días)</CardTitle>
        </CardHeader>
        <div className="h-72 min-h-[288px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300}>
            <BarChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#374151' : '#E5E7EB'}
                vertical={false}
              />
              <XAxis
                dataKey="dateFormatted"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Pie */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
          </CardHeader>
          <div className="h-64 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={250}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Services */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Servicios Más Solicitados</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {popularServices.map((item, index) => (
              <div key={item.service.id} className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.service.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count} citas • {formatCurrency(item.revenue)}
                  </p>
                </div>
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.count / popularServices[0].count) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total de Transacciones
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {payments.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Ticket Promedio
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(payments.reduce((sum, p) => sum + p.total, 0) / payments.length)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Propinas Totales
          </p>
          <p className="text-3xl font-bold text-success-600 dark:text-success-400">
            {formatCurrency(payments.reduce((sum, p) => sum + p.tip, 0))}
          </p>
        </Card>
      </div>
    </div>
  );
}
