import { useState, useMemo } from 'react';
import { Plus, Filter, Search, Calendar as CalendarIcon, Clock, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Input } from '../components/common/Input';
import { appointments } from '../data/mockData';
import { formatDate, formatTime, formatCurrency, cn } from '../utils/helpers';

const statusConfig = {
  scheduled: { label: 'Programada', variant: 'gray' },
  confirmed: { label: 'Confirmada', variant: 'primary' },
  in_progress: { label: 'En Progreso', variant: 'warning' },
  completed: { label: 'Completada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
  no_show: { label: 'No Asistió', variant: 'danger' },
};

const filterOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'today', label: 'Hoy' },
  { value: 'upcoming', label: 'Próximas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

export function Appointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAppointments = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();

    return appointments.filter((apt) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesClient = apt.client.name.toLowerCase().includes(query);
        const matchesService = apt.service.name.toLowerCase().includes(query);
        if (!matchesClient && !matchesService) return false;
      }

      // Status filter
      switch (activeFilter) {
        case 'today':
          return new Date(apt.dateTime).toDateString() === today;
        case 'upcoming':
          return new Date(apt.dateTime) > now && ['scheduled', 'confirmed'].includes(apt.status);
        case 'completed':
          return apt.status === 'completed';
        case 'cancelled':
          return apt.status === 'cancelled' || apt.status === 'no_show';
        default:
          return true;
      }
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9"
            />
          </div>
        </div>
        <Button icon={Plus}>Nueva Cita</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <Card padding="none">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No se encontraron citas
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const status = statusConfig[apt.status] || statusConfig.scheduled;

              return (
                <div
                  key={apt.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={apt.client.name} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {apt.client.name}
                        </h3>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {apt.service.name} • {apt.stylist.name}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(apt.dateTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(apt.dateTime)} ({apt.duration} min)
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {apt.client.phone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(apt.totalAmount)}
                      </p>
                      <Badge
                        variant={apt.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {apt.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
