import { useState, useMemo } from 'react';
import {
  Plus, Search, Calendar as CalendarIcon, Clock, Phone,
  CreditCard, Banknote, ArrowRightLeft, X, Check, Trash2, UserPlus
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatTime, formatCurrency, cn } from '../utils/helpers';
import { CARD_COMMISSION_RATE } from '../utils/constants';

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
  { value: 'pending', label: 'Sin Cobrar' },
  { value: 'completed', label: 'Completadas' },
];

export function Appointments() {
  const {
    appointments,
    clients,
    services,
    stylists,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    processPayment,
    addClient,
  } = useData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Form para nueva cita
  const [newAppointment, setNewAppointment] = useState({
    clientId: '',
    serviceId: '',
    stylistId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
  });

  // Form para nueva cliente
  const [newClient, setNewClient] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  // Form para pago
  const [paymentData, setPaymentData] = useState({
    methods: [{ method: 'cash', amount: '' }],
    tip: '',
    discount: '',
    notes: '',
  });

  const filteredAppointments = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();

    return appointments
      .filter((apt) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesClient = apt.client?.name?.toLowerCase().includes(query);
          const matchesService = apt.service?.name?.toLowerCase().includes(query);
          if (!matchesClient && !matchesService) return false;
        }

        switch (activeFilter) {
          case 'today':
            return new Date(apt.dateTime).toDateString() === today;
          case 'upcoming':
            return new Date(apt.dateTime) > now && ['scheduled', 'confirmed'].includes(apt.status);
          case 'pending':
            return apt.paymentStatus === 'pending' && apt.status !== 'cancelled';
          case 'completed':
            return apt.status === 'completed';
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, [appointments, searchQuery, activeFilter]);

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === newAppointment.clientId);
    const service = services.find(s => s.id === newAppointment.serviceId);
    const stylist = stylists.find(s => s.id === newAppointment.stylistId);

    if (!client || !service || !stylist) {
      toast.error('Error', 'Por favor completa todos los campos');
      return;
    }

    const dateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);

    addAppointment({
      clientId: client.id,
      client: { id: client.id, name: client.fullName, phone: client.phone },
      serviceId: service.id,
      service: { id: service.id, name: service.name, duration: service.duration, price: service.price },
      stylistId: stylist.id,
      stylist: { id: stylist.id, name: stylist.name },
      dateTime: dateTime.toISOString(),
      duration: service.duration,
      totalAmount: service.price,
      notes: newAppointment.notes,
    });

    toast.success('Cita creada', `Cita para ${client.fullName} agendada exitosamente`);

    setNewAppointment({
      clientId: '',
      serviceId: '',
      stylistId: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      notes: '',
    });
    setShowNewModal(false);
  };

  const openPaymentModal = (apt) => {
    setSelectedAppointment(apt);
    setPaymentData({
      methods: [{ method: 'cash', amount: apt.totalAmount.toString() }],
      tip: '',
      discount: '',
      notes: '',
    });
    setShowPaymentModal(true);
  };

  const addPaymentMethod = () => {
    setPaymentData(prev => ({
      ...prev,
      methods: [...prev.methods, { method: 'cash', amount: '' }],
    }));
  };

  const removePaymentMethod = (index) => {
    setPaymentData(prev => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index),
    }));
  };

  const updatePaymentMethod = (index, field, value) => {
    setPaymentData(prev => ({
      ...prev,
      methods: prev.methods.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const methods = paymentData.methods
      .filter(m => m.amount && parseFloat(m.amount) > 0)
      .map(m => ({
        method: m.method,
        amount: parseFloat(m.amount),
        account: m.method === 'cash' ? 'cash' : m.method === 'card' ? 'hey_banco' : 'bbva',
      }));

    if (methods.length === 0) {
      toast.error('Error', 'Por favor ingresa al menos un método de pago');
      return;
    }

    processPayment(selectedAppointment.id, {
      methods,
      tip: parseFloat(paymentData.tip) || 0,
      discount: parseFloat(paymentData.discount) || 0,
      notes: paymentData.notes,
    });

    toast.success('Pago registrado', `Se cobró ${formatCurrency(totalPayment.net)} correctamente`);

    setShowPaymentModal(false);
    setSelectedAppointment(null);
  };

  const totalPayment = useMemo(() => {
    const methodsTotal = paymentData.methods.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    const cardAmount = paymentData.methods
      .filter(m => m.method === 'card')
      .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    const commission = cardAmount * CARD_COMMISSION_RATE;

    return {
      total: methodsTotal,
      commission,
      net: methodsTotal - commission,
    };
  }, [paymentData.methods]);

  const handleDeleteAppointment = (apt) => {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      deleteAppointment(apt.id);
      toast.info('Cita eliminada', 'La cita ha sido eliminada');
    }
  };

  const handleStatusChange = (apt, newStatus) => {
    updateAppointment(apt.id, { status: newStatus });
    toast.success('Estado actualizado', `Cita marcada como ${statusConfig[newStatus]?.label || newStatus}`);
  };

  const handleCreateClient = () => {
    if (!newClient.fullName.trim()) return;

    const client = addClient({
      fullName: newClient.fullName.trim(),
      phone: newClient.phone.trim(),
      email: newClient.email.trim(),
    });

    toast.success('Cliente creado', `${client.fullName} agregada a clientes`);

    // Seleccionar el nuevo cliente automáticamente
    setNewAppointment(prev => ({ ...prev, clientId: client.id }));
    setNewClient({ fullName: '', phone: '', email: '' });
    setShowNewClientForm(false);
  };

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
        <Button icon={Plus} onClick={() => setShowNewModal(true)}>
          Nueva Cita
        </Button>
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
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={apt.client?.name || 'Cliente'} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {apt.client?.name || 'Cliente'}
                        </h3>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {apt.service?.name || 'Servicio'} • <strong>Atendió:</strong> {apt.stylist?.name || 'N/A'}
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
                          {apt.client?.phone || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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

                      {apt.paymentStatus !== 'paid' && apt.status !== 'cancelled' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => openPaymentModal(apt)}
                        >
                          Cobrar
                        </Button>
                      )}

                      {apt.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(apt, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                      )}

                      <button
                        onClick={() => handleDeleteAppointment(apt)}
                        className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Modal Nueva Cita */}
      <Modal
        isOpen={showNewModal}
        onClose={() => { setShowNewModal(false); setShowNewClientForm(false); }}
        title="Nueva Cita"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowNewModal(false); setShowNewClientForm(false); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAppointment}>
              Crear Cita
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          {/* Cliente Selection or New Client Form */}
          {!showNewClientForm ? (
            <div>
              <Select
                label="Cliente"
                value={newAppointment.clientId}
                onChange={(e) => setNewAppointment({ ...newAppointment, clientId: e.target.value })}
                options={clients.map(c => ({ value: c.id, label: c.fullName }))}
                placeholder="Seleccionar cliente..."
              />
              <button
                type="button"
                onClick={() => setShowNewClientForm(true)}
                className="mt-2 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                <UserPlus className="w-4 h-4" />
                Nueva Cliente
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white">Nueva Cliente</span>
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  label="Nombre completo"
                  value={newClient.fullName}
                  onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
                  placeholder="Ej: María García"
                  required
                />
                <Input
                  label="Teléfono"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="Ej: 55 1234 5678"
                />
                <Input
                  label="Email (opcional)"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateClient}
                  disabled={!newClient.fullName.trim()}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Guardar Cliente
                </Button>
              </div>
            </div>
          )}

          <Select
            label="Servicio"
            value={newAppointment.serviceId}
            onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: e.target.value })}
            options={services.map(s => ({ value: s.id, label: `${s.name} - ${formatCurrency(s.price)}` }))}
            placeholder="Seleccionar servicio..."
          />

          <Select
            label="Quien atiende"
            value={newAppointment.stylistId}
            onChange={(e) => setNewAppointment({ ...newAppointment, stylistId: e.target.value })}
            options={stylists.map(s => ({ value: s.id, label: s.name }))}
            placeholder="Seleccionar estilista..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            />
            <Input
              label="Hora"
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            />
          </div>

          <Textarea
            label="Notas (opcional)"
            value={newAppointment.notes}
            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal Cobro */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Cobrar Cita"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleProcessPayment}>
              Confirmar Pago
            </Button>
          </>
        }
      >
        {selectedAppointment && (
          <div className="space-y-4">
            {/* Info de la cita */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedAppointment.client?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedAppointment.service?.name} • {selectedAppointment.stylist?.name}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                Total: {formatCurrency(selectedAppointment.totalAmount)}
              </p>
            </div>

            {/* Métodos de pago */}
            <div>
              <label className="label">Formas de Pago</label>
              {paymentData.methods.map((method, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <select
                    value={method.method}
                    onChange={(e) => updatePaymentMethod(index, 'method', e.target.value)}
                    className="input w-40"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta (Hey Banco)</option>
                    <option value="transfer">Transferencia (BBVA)</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={method.amount}
                    onChange={(e) => updatePaymentMethod(index, 'amount', e.target.value)}
                    placeholder="Monto"
                    className="input flex-1"
                  />
                  {paymentData.methods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePaymentMethod(index)}
                      className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={addPaymentMethod}
                className="mt-2"
              >
                Agregar forma de pago
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Propina"
                type="number"
                step="0.01"
                min="0"
                value={paymentData.tip}
                onChange={(e) => setPaymentData({ ...paymentData, tip: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Descuento"
                type="number"
                step="0.01"
                min="0"
                value={paymentData.discount}
                onChange={(e) => setPaymentData({ ...paymentData, discount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {/* Resumen */}
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Total a cobrar:</span>
                <span className="font-medium">{formatCurrency(totalPayment.total)}</span>
              </div>
              {totalPayment.commission > 0 && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-danger-600 dark:text-danger-400">Comisión tarjeta (4.3%):</span>
                  <span className="text-danger-600 dark:text-danger-400">-{formatCurrency(totalPayment.commission)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary-200 dark:border-primary-800">
                <span className="text-gray-900 dark:text-white">Neto:</span>
                <span className="text-success-600 dark:text-success-400">{formatCurrency(totalPayment.net)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
