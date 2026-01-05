import { useState } from 'react';
import { Save, User, Building, Bell, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/helpers';

export function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('business');

  const tabs = [
    { id: 'business', label: 'Negocio', icon: Building },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Business Settings */}
      {activeTab === 'business' && (
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <Input
              label="Nombre del Salón"
              defaultValue="GlamourPro Beauty Salon"
            />
            <Input
              label="Teléfono"
              defaultValue="(55) 1234-5678"
            />
            <Input
              label="Email"
              type="email"
              defaultValue="contacto@glamourpro.com"
            />
            <Textarea
              label="Dirección"
              rows={2}
              defaultValue="Av. Principal #123, Col. Centro, Ciudad de México"
            />
            <Textarea
              label="Horario de Atención"
              rows={2}
              defaultValue="Lunes a Sábado: 9:00 AM - 8:00 PM&#10;Domingo: 10:00 AM - 4:00 PM"
            />

            <div className="pt-4 flex justify-end">
              <Button icon={Save}>Guardar Cambios</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-salon-pink to-salon-purple flex items-center justify-center text-white text-2xl font-bold">
                JM
              </div>
              <Button variant="outline" size="sm">
                Cambiar Foto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" defaultValue="Jessica" />
              <Input label="Apellido" defaultValue="Mendoza" />
            </div>
            <Input
              label="Email"
              type="email"
              defaultValue="jessica@glamourpro.com"
            />
            <Input label="Teléfono" defaultValue="(55) 9876-5432" />

            <div className="pt-4 flex justify-end">
              <Button icon={Save}>Guardar Cambios</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Preferencias de Notificaciones</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {[
              { id: 'new_appointment', label: 'Nueva cita agendada', checked: true },
              { id: 'appointment_reminder', label: 'Recordatorio de citas (1 hora antes)', checked: true },
              { id: 'cancelled_appointment', label: 'Cita cancelada', checked: true },
              { id: 'low_stock', label: 'Alerta de stock bajo', checked: true },
              { id: 'daily_summary', label: 'Resumen diario', checked: false },
              { id: 'weekly_report', label: 'Reporte semanal', checked: true },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
          </CardHeader>

          <div className="space-y-6">
            <div>
              <label className="label mb-3">Tema</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => isDark && toggleTheme()}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    !isDark
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                >
                  <div className="w-full h-20 rounded-lg bg-white border border-gray-200 mb-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Claro</span>
                </button>
                <button
                  onClick={() => !isDark && toggleTheme()}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    isDark
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                >
                  <div className="w-full h-20 rounded-lg bg-gray-800 border border-gray-700 mb-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Oscuro</span>
                </button>
              </div>
            </div>

            <div>
              <label className="label mb-3">Color Principal</label>
              <div className="flex gap-3">
                {[
                  { color: '#EC4899', name: 'Rosa' },
                  { color: '#8B5CF6', name: 'Morado' },
                  { color: '#3B82F6', name: 'Azul' },
                  { color: '#10B981', name: 'Verde' },
                  { color: '#F59E0B', name: 'Naranja' },
                ].map((item) => (
                  <button
                    key={item.color}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
