import { useState, useMemo } from 'react';
import { Search, CreditCard, Banknote, ArrowRightLeft, Receipt } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { payments } from '../data/mockData';
import { formatCurrency, formatDateTime, cn } from '../utils/helpers';

const methodIcons = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowRightLeft,
};

const methodLabels = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
};

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = useMemo(() => {
    if (!searchQuery) return payments;

    const query = searchQuery.toLowerCase();
    return payments.filter((payment) => {
      return (
        payment.client.name.toLowerCase().includes(query) ||
        payment.receiptNumber.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const totals = useMemo(() => {
    return {
      total: payments.reduce((sum, p) => sum + p.total, 0),
      cash: payments.filter((p) => p.method === 'cash').reduce((sum, p) => sum + p.total, 0),
      card: payments.filter((p) => p.method === 'card').reduce((sum, p) => sum + p.total, 0),
      transfer: payments.filter((p) => p.method === 'transfer').reduce((sum, p) => sum + p.total, 0),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <Receipt className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.total)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Banknote className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Efectivo</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.cash)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tarjeta</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.card)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <ArrowRightLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transferencia</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.transfer)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o recibo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Payments List */}
      <Card padding="none">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPayments.map((payment) => {
            const MethodIcon = methodIcons[payment.method] || Receipt;

            return (
              <div
                key={payment.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar name={payment.client.name} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {payment.client.name}
                      </h3>
                      <Badge variant="gray" size="sm">
                        {payment.receiptNumber}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.services.map((s) => s.service.name).join(', ')}
                      {payment.products.length > 0 && (
                        <> + {payment.products.length} producto(s)</>
                      )}
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDateTime(payment.paidAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MethodIcon className="w-4 h-4" />
                      {methodLabels[payment.method]}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {formatCurrency(payment.total)}
                      </p>
                      {payment.tip > 0 && (
                        <p className="text-xs text-success-600 dark:text-success-400">
                          +{formatCurrency(payment.tip)} propina
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
