import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'green' | 'orange' | 'white' | 'default';
}

export default function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'default'
}: MetricCardProps) {
  const colorClasses = {
    green: 'text-[#7FFF00]',
    orange: 'text-[#FF8C00]',
    white: 'text-white',
    default: 'text-white'
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
      </div>
      
      <div className={`text-4xl font-bold ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      
      {trend && trendValue && (
        <div className={`text-xs ${
          trend === 'up' ? 'text-green-400' : 
          trend === 'down' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {trendValue}
        </div>
      )}
    </div>
  );
}
