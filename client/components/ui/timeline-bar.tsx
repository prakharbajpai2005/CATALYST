interface TimelineBarProps {
  percentage: number;
  color?: 'green' | 'orange' | 'white';
  label?: string;
  avatars?: string[];
  showPercentage?: boolean;
}

export default function TimelineBar({ 
  percentage, 
  color = 'green',
  label,
  avatars,
  showPercentage = false
}: TimelineBarProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{label}</span>
          {showPercentage && (
            <span className="text-white font-medium">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className="timeline-bar">
        <div 
          className={`timeline-bar-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
        
        {avatars && avatars.length > 0 && (
          <div className="absolute inset-0 flex items-center px-4 gap-2">
            {avatars.map((avatar, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-xs font-semibold"
                style={{ 
                  marginLeft: idx > 0 ? '-8px' : '0',
                  zIndex: avatars.length - idx 
                }}
              >
                {avatar}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
