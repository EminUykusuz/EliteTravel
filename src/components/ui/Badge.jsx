// src/components/ui/Badge.jsx
import clsx from 'clsx'; // Eğer clsx kurmadıysan silebilir, className string'i elle yazabilirsin.

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-elite-dark text-white',
    accent: 'bg-elite-gold text-elite-dark font-bold',
    outline: 'border border-gray-200 text-gray-600',
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}