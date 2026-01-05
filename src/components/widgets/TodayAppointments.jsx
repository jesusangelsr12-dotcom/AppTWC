import { Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatTime } from '../../utils/helpers';

const statusConfig = {
  scheduled: { label: 'Programada', variant: 'gray' },
  confirmed: { label: 'Confirmada', variant: 'primary' },
  in_progress: { label: 'En Progreso', variant: 'warning' },
  completed: { label: 'Completada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
  no_show: { label: 'No Asistió', variant: 'danger' },
};

export function TodayAppointments({ appointments }) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Citas de Hoy</CardTitle>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {appointments.length} citas
        </span>
      </CardHeader>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {appointments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay citas programadas para hoy
          </p>
        ) : (
          appointments.map((apt) => {
            const status = statusConfig[apt.status] || statusConfig.scheduled;

            return (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Avatar name={apt.client.name} size="md" />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {apt.client.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {apt.service.name}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(apt.dateTime)}
                  </div>
                  <Badge variant={status.variant} size="sm">
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
