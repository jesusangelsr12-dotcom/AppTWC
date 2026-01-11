import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDateTime, cn } from '../utils/helpers';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORIES_LABELS,
  ACCOUNTS,
  ACCOUNTS_LABELS,
  BAGS,
  BAGS_LABELS,
  SUBDIVISIONS_LABELS,
  DEFAULT_CASHFLOW_CONFIG,
} from '../utils/constants';

export function Expenses() {
  const { expenses, accounts, bags, addExpense, deleteExpense } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: EXPENSE_CATEGORIES.OTHER,
    account: ACCOUNTS.CASH,
    bag: BAGS.SALON,
    subdivision: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!exp.description.toLowerCase().includes(query)) return false;
        }
        if (categoryFilter !== 'all' && exp.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [expenses, searchQuery, categoryFilter]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const expensesByCategory = useMemo(() => {
    const grouped = {};
    expenses.forEach(exp => {
      if (!grouped[exp.category]) {
        grouped[exp.category] = 0;
      }
      grouped[exp.category] += exp.amount;
    });
    return grouped;
  }, [expenses]);

  const getSubdivisionsForBag = (bag) => {
    const bagConfig = DEFAULT_CASHFLOW_CONFIG.bags[bag];
    if (!bagConfig?.subdivisions) return [];
    return Object.entries(bagConfig.subdivisions).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      account: formData.account,
      bag: formData.bag,
      subdivision: formData.subdivision || null,
      date: formData.date,
      notes: formData.notes,
    });

    setFormData({
      description: '',
      amount: '',
      category: EXPENSE_CATEGORIES.OTHER,
      account: ACCOUNTS.CASH,
      bag: BAGS.SALON,
      subdivision: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este gasto? Se revertirá el monto a la cuenta y bolsa correspondiente.')) {
      deleteExpense(id);
    }
  };

  const subdivisions = getSubdivisionsForBag(formData.bag);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Gastos</p>
          <p className="text-2xl font-bold text-danger-600 dark:text-danger-400 mt-1">
            {formatCurrency(totalExpenses)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Efectivo Disponible</p>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">
            {formatCurrency(accounts[ACCOUNTS.CASH]?.balance || 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hey Banco</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {formatCurrency(accounts[ACCOUNTS.HEY_BANCO]?.balance || 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">BBVA</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
            {formatCurrency(accounts[ACCOUNTS.BBVA]?.balance || 0)}
          </p>
        </Card>
      </div>

      {/* Gastos por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(EXPENSE_CATEGORIES_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(expensesByCategory[key] || 0)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(EXPENSE_CATEGORIES_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Nuevo Gasto
        </Button>
      </div>

      {/* Lista de Gastos */}
      <Card padding="none">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No hay gastos registrados
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </h3>
                      <Badge variant="gray" size="sm">
                        {EXPENSE_CATEGORIES_LABELS[expense.category]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Cuenta: {ACCOUNTS_LABELS[expense.account]}</span>
                      <span>Bolsa: {BAGS_LABELS[expense.bag]}</span>
                      {expense.subdivision && (
                        <span>Sub: {SUBDIVISIONS_LABELS[expense.subdivision]}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDateTime(expense.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-danger-600 dark:text-danger-400">
                      -{formatCurrency(expense.amount)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal Nuevo Gasto */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Gasto"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Guardar Gasto
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej: Compra de shampoo"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monto"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <Select
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={Object.entries(EXPENSE_CATEGORIES_LABELS).map(([key, label]) => ({
              value: key,
              label,
            }))}
          />

          <Select
            label="Cuenta / Fuente de dinero"
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            options={Object.entries(ACCOUNTS_LABELS).map(([key, label]) => ({
              value: key,
              label,
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Bolsa"
              value={formData.bag}
              onChange={(e) => setFormData({ ...formData, bag: e.target.value, subdivision: '' })}
              options={Object.entries(BAGS_LABELS).map(([key, label]) => ({
                value: key,
                label,
              }))}
            />

            {subdivisions.length > 0 && (
              <Select
                label="Subdivisión"
                value={formData.subdivision}
                onChange={(e) => setFormData({ ...formData, subdivision: e.target.value })}
                options={[
                  { value: '', label: 'Seleccionar...' },
                  ...subdivisions,
                ]}
              />
            )}
          </div>

          <Textarea
            label="Notas (opcional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            placeholder="Notas adicionales..."
          />
        </form>
      </Modal>
    </div>
  );
}
