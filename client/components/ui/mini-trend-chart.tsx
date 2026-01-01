'use client';

interface MiniTrendChartProps {
  data: number[];
  color?: 'green' | 'orange' | 'white';
  height?: number;
  label?: string;
  value?: string;
  trend?: string;
}

export default function MiniTrendChart({
  data,
  color = 'green',
  height = 60,
  label,
  value,
  trend
}: MiniTrendChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Generate SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = color === 'green' ? '#FACC15' :
    color === 'orange' ? '#FF8C00' : '#FFFFFF';

  return (
    <div className="flex flex-col">
      {(label || value) && (
        <div className="flex justify-between items-start mb-2">
          <div>
            {label && <div className="text-black text-sm font-medium mb-1">{label}</div>}
            {value && <div className="text-2xl font-bold text-black">{value}</div>}
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend.startsWith('+') ? 'text-[#FACC15]' : 'text-[#FF8C00]'
              }`}>
              {trend}
            </div>
          )}
        </div>
      )}

      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 100} ${points.split(' ').map(p => `L ${p}`).join(' ')} L 100,100 Z`}
            fill={`url(#gradient-${color})`}
            stroke="none"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
