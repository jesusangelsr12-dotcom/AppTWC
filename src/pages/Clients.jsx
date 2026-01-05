import { useState, useMemo } from 'react';
import { Plus, Search, Phone, Mail, Calendar } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { clients } from '../data/mockData';
import { formatDate, formatCurrency, formatPhoneNumber } from '../utils/helpers';

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter((client) => {
      return (
        client.fullName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query)
      );
    });
  }, [searchQuery]);

  // Sort by last visit
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort(
      (a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)
    );
  }, [filteredClients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
        <Button icon={Plus}>Nueva Cliente</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Clientes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {clients.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Frecuentes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {clients.filter((c) => c.totalVisits >= 10).length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos Totales</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(clients.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedClients.map((client) => (
          <Card
            key={client.id}
            className="hover:shadow-soft-lg dark:hover:shadow-none transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <Avatar name={client.fullName} size="lg" />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {client.fullName}
                </h3>

                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    {formatPhoneNumber(client.phone)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5" />
                    {client.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Última visita: {formatDate(client.lastVisit)}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {client.totalVisits} visitas
                  </span>
                  <span className="font-medium text-success-600 dark:text-success-400">
                    {formatCurrency(client.totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
