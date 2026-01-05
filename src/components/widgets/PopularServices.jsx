import { Card, CardHeader, CardTitle } from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

export function PopularServices({ services }) {
  const maxCount = Math.max(...services.map((s) => s.count));

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Servicios Populares</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {services.map((item, index) => {
          const percentage = (item.count / maxCount) * 100;

          return (
            <div key={item.service.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.service.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.count} citas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-salon-pink to-salon-purple rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
