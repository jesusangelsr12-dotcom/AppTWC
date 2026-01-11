import { useState, useMemo } from 'react';
import { Search, CreditCard, Banknote, ArrowRightLeft, Receipt, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { CARD_COMMISSION_RATE } from '../utils/constants';

const methodIcons = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowRightLeft,
  mixed: Receipt,
};

const methodLabels = {
  cash: 'Efectivo',
  card: 'Tarjeta (Hey Banco)',
  transfer: 'Transferencia (BBVA)',
  mixed: 'Mixto',
};

export function Payments() {
  const { payments, accounts } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = useMemo(() => {
    if (!searchQuery) return payments;

    const query = searchQuery.toLowerCase();
    return payments.filter((payment) => {
      return (
        payment.client?.name?.toLowerCase().includes(query) ||
        payment.receiptNumber?.toLowerCase().includes(query)
      );
    });
  }, [payments, searchQuery]);

  const totals = useMemo(() => {
    let cash = 0;
    let card = 0;
    let transfer = 0;
    let totalCommission = 0;

    payments.forEach(p => {
      if (p.methods) {
        p.methods.forEach(m => {
          if (m.method === 'cash') cash += m.amount;
          else if (m.method === 'card') {
            card += m.amount;
            totalCommission += m.amount * CARD_COMMISSION_RATE;
          }
          else if (m.method === 'transfer') transfer += m.amount;
        });
      } else if (p.method) {
        // Compatibilidad con datos antiguos
        if (p.method === 'cash') cash += p.total || 0;
        else if (p.method === 'card') {
          card += p.total || 0;
          totalCommission += (p.total || 0) * CARD_COMMISSION_RATE;
        }
        else if (p.method === 'transfer') transfer += p.total || 0;
      }
    });

    return {
      total: cash + card + transfer,
      cash,
      card,
      transfer,
      commission: totalCommission,
      net: cash + card + transfer - totalCommission,
    };
  }, [payments]);

  const getPaymentMethod = (payment) => {
    if (payment.methods && payment.methods.length > 1) {
      return 'mixed';
    }
    if (payment.methods && payment.methods.length === 1) {
      return payment.methods[0].method;
    }
    return payment.method || 'cash';
  };

  const getPaymentMethodDetails = (payment) => {
    if (!payment.methods) {
      return methodLabels[payment.method] || 'Efectivo';
    }
    if (payment.methods.length === 1) {
      return methodLabels[payment.methods[0].method];
    }
    return payment.methods.map(m => `${methodLabels[m.method]}: ${formatCurrency(m.amount)}`).join(' + ');
  };

  return (
    <div className="space-y-6">
      {/* Info de Comisión */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">
          Los pagos con tarjeta tienen una comisión del <strong>3.5%</strong> que se descuenta automáticamente.
          El dinero de tarjeta va a <strong>Hey Banco</strong> y las transferencias a <strong>BBVA</strong>.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <Receipt className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Bruto</p>
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
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hey Banco</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.card)}
              </p>
              <p className="text-xs text-danger-500">
                -{formatCurrency(totals.card * CARD_COMMISSION_RATE)} comisión
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">BBVA</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.transfer)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Receipt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Neto</p>
              <p className="text-xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(totals.net)}
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
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No hay pagos registrados
            </div>
          ) : (
            filteredPayments.slice().reverse().map((payment) => {
              const method = getPaymentMethod(payment);
              const MethodIcon = methodIcons[method] || Receipt;

              return (
                <div
                  key={payment.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={payment.client?.name || 'Cliente'} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {payment.client?.name || 'Cliente'}
                        </h3>
                        <Badge variant="gray" size="sm">
                          {payment.receiptNumber}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.service?.name || 'Servicio'}
                        {payment.stylist && ` • Atendió: ${payment.stylist.name}`}
                      </p>

                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDateTime(payment.paidAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MethodIcon className="w-4 h-4" />
                          <span>{method === 'mixed' ? 'Pago Mixto' : methodLabels[method]}</span>
                        </div>
                        {method === 'mixed' && payment.methods && (
                          <div className="text-xs text-gray-400 mt-1">
                            {payment.methods.map(m => (
                              <div key={m.method}>
                                {methodLabels[m.method]}: {formatCurrency(m.amount)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatCurrency(payment.totalPaid || payment.total)}
                        </p>
                        {payment.commission > 0 && (
                          <p className="text-xs text-danger-500">
                            -{formatCurrency(payment.commission)} comisión
                          </p>
                        )}
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
            })
          )}
        </div>
      </Card>
    </div>
  );
}
