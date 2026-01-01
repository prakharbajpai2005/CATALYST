'use client';

interface DotMatrixProps {
  rows?: number;
  cols?: number;
  activeCount?: number; // Number of active dots
  color?: 'green' | 'orange' | 'white';
  label?: string;
  value?: string;
}

export default function DotMatrix({
  rows = 5,
  cols = 12,
  activeCount = 30,
  color = 'green',
  label,
  value
}: DotMatrixProps) {
  const totalDots = rows * cols;

  const getColor = () => {
    switch (color) {
      case 'green': return 'bg-[#FACC15]';
      case 'orange': return 'bg-[#FF8C00]';
      case 'white': return 'bg-white';
      default: return 'bg-[#FACC15]';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {(label || value) && (
        <div className="flex justify-between items-end mb-4">
          {label && <span className="text-black text-sm font-medium">{label}</span>}
          {value && <span className={`text-2xl font-bold ${color === 'green' ? 'text-[#7FFF00]' :
            color === 'orange' ? 'text-[#FF8C00]' : 'text-black'
            }`}>{value}</span>}
        </div>
      )}

      <div
        className="grid gap-2 flex-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {Array.from({ length: totalDots }).map((_, i) => {
          // Randomize opacity for active dots to create "activity" effect (deterministic for hydration)
          const isActive = i < activeCount;
          const opacity = isActive ? (Math.abs(Math.sin(i * 123.45)) * 0.5 + 0.5) : 0.1;

          return (
            <div
              key={i}
              className={`rounded-full aspect-square transition-all duration-500 ${isActive ? getColor() : 'bg-gray-800'}`}
              style={{ opacity }}
            />
          );
        })}
      </div>
    </div>
  );
}
