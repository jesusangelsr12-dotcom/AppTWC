import { useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CreditCard,
} from 'lucide-react';
import { StatCard, RevenueChart, TodayAppointments, PopularServices } from '../components/widgets';
import {
  appointments,
  dailyRevenue,
  getStats,
  getPopularServices,
} from '../data/mockData';
import { calculatePercentageChange } from '../utils/helpers';

export function Dashboard() {
  const stats = useMemo(() => getStats(), []);
  const popularServices = useMemo(() => getPopularServices(), []);

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments.filter(
      (apt) => new Date(apt.dateTime).toDateString() === today
    );
  }, []);

  const revenueChange = calculatePercentageChange(
    stats.monthRevenue,
    stats.lastMonthRevenue
  );

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
          title="Clientes Activos"
          value={stats.totalClients}
          icon={Users}
          iconColor="pink"
        />
        <StatCard
          title="Pagos Pendientes"
          value={stats.pendingPayments}
          icon={CreditCard}
          iconColor={stats.pendingPayments > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={dailyRevenue} title="Ingresos (Últimos 30 días)" />
        </div>
        <div>
          <PopularServices services={popularServices} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayAppointments appointments={todayAppointments} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Próximas Citas"
            value={stats.upcomingAppointments}
            icon={Clock}
            iconColor="primary"
          />
          <StatCard
            title="Nuevos Clientes"
            value={stats.newClientsThisMonth}
            icon={Users}
            iconColor="success"
          />
          <StatCard
            title="Ingresos Hoy"
            value={stats.todayRevenue}
            icon={TrendingUp}
            iconColor="success"
            isCurrency
          />
          <StatCard
            title="Mes Anterior"
            value={stats.lastMonthRevenue}
            icon={DollarSign}
            iconColor="gray"
            isCurrency
          />
        </div>
      </div>
    </div>
  );
}
