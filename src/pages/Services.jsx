import { useState, useMemo } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { services } from '../data/mockData';
import { formatCurrency, formatDuration, cn } from '../utils/helpers';
import { SERVICE_CATEGORIES_LABELS } from '../utils/constants';

const categoryColors = {
  hair: 'from-pink-500 to-rose-500',
  nails: 'from-purple-500 to-violet-500',
  skin: 'from-cyan-500 to-teal-500',
  makeup: 'from-orange-500 to-amber-500',
  spa: 'from-green-500 to-emerald-500',
  other: 'from-gray-500 to-slate-500',
};

export function Services() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(services.map((s) => s.category))];
    return ['all', ...cats];
  }, []);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const groupedServices = useMemo(() => {
    return filteredServices.reduce((acc, service) => {
      const cat = service.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    }, {});
  }, [filteredServices]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              {cat === 'all' ? 'Todos' : SERVICE_CATEGORIES_LABELS[cat] || cat}
            </button>
          ))}
        </div>
        <Button icon={Plus}>Nuevo Servicio</Button>
      </div>

      {/* Services by Category */}
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span
              className={cn(
                'w-3 h-3 rounded-full bg-gradient-to-r',
                categoryColors[category] || categoryColors.other
              )}
            />
            {SERVICE_CATEGORIES_LABELS[category] || category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-soft-lg dark:hover:shadow-none transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white',
                      categoryColors[service.category] || categoryColors.other
                    )}
                  >
                    <span className="text-lg font-bold">
                      {service.name.charAt(0)}
                    </span>
                  </div>
                  <Badge variant="gray" size="sm">
                    {SERVICE_CATEGORIES_LABELS[service.category]}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                  {service.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
