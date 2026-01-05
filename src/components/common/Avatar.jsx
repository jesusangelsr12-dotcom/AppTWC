import { cn, getInitials } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colors = [
  'from-salon-pink to-salon-purple',
  'from-primary-400 to-primary-600',
  'from-success-400 to-success-600',
  'from-warning-400 to-warning-600',
  'from-danger-400 to-danger-600',
];

export function Avatar({ name, src, size = 'md', className }) {
  const initials = getInitials(name);
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white bg-gradient-to-br',
        colors[colorIndex],
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
