import { useState, useMemo } from 'react';
import { Pencil, ArrowRightLeft, TrendingUp, Wallet, PiggyBank, Users, Building2, History } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDateTime, cn } from '../utils/helpers';
import {
  ACCOUNTS,
  ACCOUNTS_LABELS,
  ACCOUNTS_COLORS,
  BAGS_LABELS,
  SUBDIVISIONS_LABELS,
  DEFAULT_CASHFLOW_CONFIG,
} from '../utils/constants';

export function Finances() {
  const {
    accounts,
    bags,
    weeklyHistory,
    transfers,
    config,
    transferBetweenAccounts,
    updateBagManually,
    processWeeklyCashflow,
    updateConfig,
  } = useData();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditBagModal, setShowEditBagModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [transferData, setTransferData] = useState({
    from: ACCOUNTS.CASH,
    to: ACCOUNTS.HEY_BANCO,
    amount: '',
    notes: '',
  });

  const [editBagData, setEditBagData] = useState({
    bag: 'salon',
    subdivision: null,
    newValue: '',
    notes: '',
  });

  const [weeklyData, setWeeklyData] = useState({
    weekStartDate: new Date().toISOString().split('T')[0],
    totalIncome: '',
  });

  const [configData, setConfigData] = useState({
    weeklyFixedExpenses: config.weeklyFixedExpenses || 0,
  });

  const totalAccountsBalance = useMemo(() => {
    return Object.values(accounts).reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const totalBagsBalance = useMemo(() => {
    return bags.salon.total + bags.pagosVariables.total + bags.inversiones.total;
  }, [bags]);

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferData.amount || transferData.from === transferData.to) return;

    transferBetweenAccounts(
      transferData.from,
      transferData.to,
      parseFloat(transferData.amount),
      transferData.notes
    );

    setTransferData({
      from: ACCOUNTS.CASH,
      to: ACCOUNTS.HEY_BANCO,
      amount: '',
      notes: '',
    });
    setShowTransferModal(false);
  };

  const handleEditBag = (e) => {
    e.preventDefault();
    if (editBagData.newValue === '') return;

    updateBagManually(
      editBagData.bag,
      editBagData.subdivision,
      parseFloat(editBagData.newValue),
      editBagData.notes
    );

    setEditBagData({
      bag: 'salon',
      subdivision: null,
      newValue: '',
      notes: '',
    });
    setShowEditBagModal(false);
  };

  const handleProcessWeekly = (e) => {
    e.preventDefault();
    if (!weeklyData.totalIncome) return;

    processWeeklyCashflow(
      weeklyData.weekStartDate,
      parseFloat(weeklyData.totalIncome)
    );

    setWeeklyData({
      weekStartDate: new Date().toISOString().split('T')[0],
      totalIncome: '',
    });
    setShowWeeklyModal(false);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateConfig({
      weeklyFixedExpenses: parseFloat(configData.weeklyFixedExpenses) || 0,
    });
    setShowConfigModal(false);
  };

  const openEditBag = (bag, subdivision = null) => {
    const currentValue = subdivision
      ? bags[bag]?.subdivisions?.[subdivision] || 0
      : bags[bag]?.total || 0;

    setEditBagData({
      bag,
      subdivision,
      newValue: currentValue.toString(),
      notes: '',
    });
    setShowEditBagModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Resumen de Cuentas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuentas Bancarias */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Cuentas / Fuentes de Dinero
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRightLeft}
              onClick={() => setShowTransferModal(true)}
            >
              Transferir
            </Button>
          </CardHeader>

          <div className="space-y-4">
            {Object.entries(accounts).map(([key, account]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ACCOUNTS_COLORS[key] }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {account.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-success-600 dark:text-success-400">
                  {formatCurrency(totalAccountsBalance)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Configuración de Flujo */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Flujo de Caja Semanal
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              icon={Pencil}
              onClick={() => setShowConfigModal(true)}
            >
              Configurar
            </Button>
          </CardHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gasto Fijo Semanal</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(config.weeklyFixedExpenses || 0)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Renta</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {(config.rentPercentage * 100).toFixed(0)}% después de gastos fijos
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowWeeklyModal(true)}
            >
              Procesar Semana
            </Button>
          </div>
        </Card>
      </div>

      {/* Bolsas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bolsa Salón */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-salon-pink" />
              Salón (64%)
            </CardTitle>
            <button
              onClick={() => openEditBag('salon')}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </CardHeader>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(bags.salon.total)}
          </p>
        </Card>

        {/* Bolsa Pagos Variables */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Pagos Variables (33%)
            </CardTitle>
          </CardHeader>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {formatCurrency(bags.pagosVariables.total)}
          </p>

          <div className="space-y-2">
            {Object.entries(bags.pagosVariables.subdivisions).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {SUBDIVISIONS_LABELS[key]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(value)}
                  </span>
                  <button
                    onClick={() => openEditBag('pagosVariables', key)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bolsa Inversiones */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-success-500" />
              Inversiones (3%)
            </CardTitle>
          </CardHeader>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {formatCurrency(bags.inversiones.total)}
          </p>

          <div className="space-y-2">
            {Object.entries(bags.inversiones.subdivisions).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {SUBDIVISIONS_LABELS[key]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(value)}
                  </span>
                  <button
                    onClick={() => openEditBag('inversiones', key)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Historial Semanal */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Flujo Semanal
          </CardTitle>
        </CardHeader>

        {weeklyHistory.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay registros de flujo semanal
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gastos Fijos</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Renta</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Salón</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pagos Var.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Inversiones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {weeklyHistory.slice().reverse().map((week) => (
                  <tr key={week.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {week.weekStartDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-success-600">
                      {formatCurrency(week.totalIncome)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-danger-600">
                      -{formatCurrency(week.fixedExpenses)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-danger-600">
                      -{formatCurrency(week.rent)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(week.distribution.salon)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(week.distribution.pagosVariables.total)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(week.distribution.inversiones.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Transferencia */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transferir entre Cuentas"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleTransfer}>
              Transferir
            </Button>
          </>
        }
      >
        <form onSubmit={handleTransfer} className="space-y-4">
          <Select
            label="Desde"
            value={transferData.from}
            onChange={(e) => setTransferData({ ...transferData, from: e.target.value })}
            options={Object.entries(ACCOUNTS_LABELS).map(([key, label]) => ({
              value: key,
              label: `${label} (${formatCurrency(accounts[key]?.balance || 0)})`,
            }))}
          />

          <Select
            label="Hacia"
            value={transferData.to}
            onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
            options={Object.entries(ACCOUNTS_LABELS).map(([key, label]) => ({
              value: key,
              label,
            }))}
          />

          <Input
            label="Monto"
            type="number"
            step="0.01"
            min="0"
            value={transferData.amount}
            onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <Textarea
            label="Notas (opcional)"
            value={transferData.notes}
            onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal Editar Bolsa */}
      <Modal
        isOpen={showEditBagModal}
        onClose={() => setShowEditBagModal(false)}
        title="Editar Bolsa"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditBagModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBag}>
              Guardar
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditBag} className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">Editando:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {BAGS_LABELS[editBagData.bag]}
              {editBagData.subdivision && ` → ${SUBDIVISIONS_LABELS[editBagData.subdivision]}`}
            </p>
          </div>

          <Input
            label="Nuevo Valor"
            type="number"
            step="0.01"
            value={editBagData.newValue}
            onChange={(e) => setEditBagData({ ...editBagData, newValue: e.target.value })}
            placeholder="0.00"
            required
          />

          <Textarea
            label="Motivo del cambio (opcional)"
            value={editBagData.notes}
            onChange={(e) => setEditBagData({ ...editBagData, notes: e.target.value })}
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal Procesar Semana */}
      <Modal
        isOpen={showWeeklyModal}
        onClose={() => setShowWeeklyModal(false)}
        title="Procesar Flujo Semanal"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowWeeklyModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleProcessWeekly}>
              Procesar
            </Button>
          </>
        }
      >
        <form onSubmit={handleProcessWeekly} className="space-y-4">
          <Input
            label="Inicio de Semana"
            type="date"
            value={weeklyData.weekStartDate}
            onChange={(e) => setWeeklyData({ ...weeklyData, weekStartDate: e.target.value })}
          />

          <Input
            label="Ingreso Total de la Semana"
            type="number"
            step="0.01"
            min="0"
            value={weeklyData.totalIncome}
            onChange={(e) => setWeeklyData({ ...weeklyData, totalIncome: e.target.value })}
            placeholder="0.00"
            required
          />

          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm">
            <p className="font-medium text-primary-900 dark:text-primary-100 mb-2">
              Se aplicará la siguiente distribución:
            </p>
            <ul className="text-primary-700 dark:text-primary-300 space-y-1">
              <li>- Gastos fijos: {formatCurrency(config.weeklyFixedExpenses || 0)}</li>
              <li>- Renta: 20% del restante</li>
              <li>- Salón: 64%</li>
              <li>- Pagos Variables: 33%</li>
              <li>- Inversiones: 3%</li>
            </ul>
          </div>
        </form>
      </Modal>

      {/* Modal Configuración */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Configuración de Flujo"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig}>
              Guardar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <Input
            label="Gasto Fijo Semanal"
            type="number"
            step="0.01"
            min="0"
            value={configData.weeklyFixedExpenses}
            onChange={(e) => setConfigData({ ...configData, weeklyFixedExpenses: e.target.value })}
            placeholder="0.00"
            helperText="Este monto se resta automáticamente del ingreso semanal"
          />
        </form>
      </Modal>
    </div>
  );
}
