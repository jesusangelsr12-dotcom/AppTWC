import { useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard, TodayAppointments, PopularServices } from '../components/widgets';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { getPopularServices } from '../data/mockData';
import { calculatePercentageChange, formatCurrency } from '../utils/helpers';
import { startOfMonth, endOfMonth, subMonths, format, eachDayOfInterval, startOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function Dashboard() {
  const { appointments, expenses, payments, clients, accounts } = useData();
  const { isDark } = useTheme();
  const popularServices = useMemo(() => getPopularServices(), []);

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const todayApts = appointments.filter(
      (apt) => new Date(apt.dateTime).toDateString() === today
    );

    const completedThisMonth = appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return apt.status === 'completed' &&
        aptDate >= thisMonthStart &&
        aptDate <= thisMonthEnd;
    });

    const completedLastMonth = appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return apt.status === 'completed' &&
        aptDate >= lastMonthStart &&
        aptDate <= lastMonthEnd;
    });

    const monthRevenue = completedThisMonth.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);
    const lastMonthRevenue = completedLastMonth.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

    const pendingPayments = appointments.filter(
      (apt) => apt.status === 'completed' && !apt.isPaid
    ).length;

    const upcomingAppointments = appointments.filter(
      (apt) => new Date(apt.dateTime) > now && apt.status === 'scheduled'
    ).length;

    const todayCompleted = todayApts.filter((apt) => apt.status === 'completed');
    const todayRevenue = todayCompleted.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

    const newClientsThisMonth = clients.filter((c) => {
      const createdAt = new Date(c.createdAt || c.firstVisit);
      return createdAt >= thisMonthStart && createdAt <= thisMonthEnd;
    }).length;

    return {
      todayAppointments: todayApts.length,
      monthRevenue,
      lastMonthRevenue,
      totalClients: clients.length,
      pendingPayments,
      upcomingAppointments,
      newClientsThisMonth,
      todayRevenue,
    };
  }, [appointments, clients]);

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments.filter(
      (apt) => new Date(apt.dateTime).toDateString() === today
    );
  }, [appointments]);

  const revenueChange = calculatePercentageChange(
    stats.monthRevenue,
    stats.lastMonthRevenue
  );

  // Calculate monthly expenses
  const monthlyExpenses = useMemo(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    return expenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= thisMonthStart && expDate <= thisMonthEnd;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calculate income vs expenses for last 30 days
  const incomeVsExpensesData = useMemo(() => {
    const now = new Date();
    const last30Days = eachDayOfInterval({
      start: subMonths(now, 1),
      end: now,
    });

    // Group by week for better visualization
    const weeklyData = {};

    last30Days.forEach((day) => {
      const weekStart = startOfDay(day);
      const weekKey = format(weekStart, 'dd MMM', { locale: es });

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { name: weekKey, ingresos: 0, gastos: 0 };
      }
    });

    // Add income from completed appointments
    appointments
      .filter((apt) => apt.status === 'completed' && apt.isPaid)
      .forEach((apt) => {
        const aptDate = new Date(apt.dateTime);
        if (aptDate >= subMonths(now, 1) && aptDate <= now) {
          const key = format(aptDate, 'dd MMM', { locale: es });
          if (weeklyData[key]) {
            weeklyData[key].ingresos += apt.service?.price || 0;
          }
        }
      });

    // Add expenses
    expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      if (expDate >= subMonths(now, 1) && expDate <= now) {
        const key = format(expDate, 'dd MMM', { locale: es });
        if (weeklyData[key]) {
          weeklyData[key].gastos += exp.amount;
        }
      }
    });

    return Object.values(weeklyData).slice(-14); // Last 14 days
  }, [appointments, expenses]);

  // Calculate total accounts balance
  const totalBalance = useMemo(() => {
    return Object.values(accounts).reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Citas Hoy"
          value={stats.todayAppointments}
          icon={Calendar}
          iconColor="primary"
        />
        <StatCard
          title="Ingresos del Mes"
          value={stats.monthRevenue}
          change={revenueChange}
          changeLabel="vs mes anterior"
          icon={DollarSign}
          iconColor="success"
          isCurrency
        />
        <StatCard
          title="Gastos del Mes"
          value={monthlyExpenses}
          icon={ArrowDownCircle}
          iconColor="danger"
          isCurrency
        />
        <StatCard
          title="Balance Total"
          value={totalBalance}
          icon={Wallet}
          iconColor={totalBalance >= 0 ? 'success' : 'danger'}
          isCurrency
        />
      </div>

      {/* Income vs Expenses Chart */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Ingresos vs Gastos (Últimos 14 días)</CardTitle>
        </CardHeader>
        <div className="h-72 min-h-[288px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300}>
            <BarChart data={incomeVsExpensesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#374151' : '#E5E7EB'}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                interval={1}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                )}
              />
              <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayAppointments appointments={todayAppointments} />
        <PopularServices services={popularServices} />
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Próximas Citas"
          value={stats.upcomingAppointments}
          icon={Clock}
          iconColor="primary"
        />
        <StatCard
          title="Pagos Pendientes"
          value={stats.pendingPayments}
          icon={CreditCard}
          iconColor={stats.pendingPayments > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Clientes Activos"
          value={stats.totalClients}
          icon={Users}
          iconColor="pink"
        />
        <StatCard
          title="Nuevos Clientes"
          value={stats.newClientsThisMonth}
          icon={Users}
          iconColor="success"
        />
      </div>
    </div>
  );
}
