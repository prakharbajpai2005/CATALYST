'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Skill {
  name: string;
  currentLevel: number;
  targetLevel: number;
  category: 'technical' | 'soft' | 'tools';
}

interface SkillGapHeatmapProps {
  skills: Skill[];
}

export default function SkillGapHeatmap({ skills }: SkillGapHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const cellSize = 60;
    const gap = 4;
    const cols = Math.floor(canvas.width / (cellSize + gap));

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    skills.forEach((skill, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = col * (cellSize + gap);
      const y = row * (cellSize + gap);

      // Calculate gap percentage (0-100)
      const gapPercentage = ((skill.targetLevel - skill.currentLevel) / skill.targetLevel) * 100;
      
      // Gradient color based on gap
      // Low gap (proficient): Indigo to Cyan
      // High gap (missing): Pink to Purple
      let hue, saturation, lightness;
      
      if (gapPercentage > 70) {
        // Critical gap - Neon pink/purple
        hue = 330 - (gapPercentage - 70) * 0.5;
        saturation = 80;
        lightness = 55;
      } else if (gapPercentage > 40) {
        // Moderate gap - Purple
        hue = 270;
        saturation = 70;
        lightness = 50 + (gapPercentage / 100) * 10;
      } else {
        // Low gap - Indigo to Cyan
        hue = 240 - (gapPercentage / 40) * 60;
        saturation = 70;
        lightness = 50;
      }

      // Draw cell with gradient
      const gradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
      gradient.addColorStop(1, `hsl(${hue + 20}, ${saturation - 10}%, ${lightness - 10}%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Glow effect for high gaps (missing skills)
      if (gapPercentage > 70) {
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        ctx.shadowBlur = 0;
      }

      // Skill name (abbreviated)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        skill.name.substring(0, 8),
        x + cellSize / 2,
        y + cellSize / 2 - 8
      );

      // Gap indicator
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(
        `${Math.round(gapPercentage)}%`,
        x + cellSize / 2,
        y + cellSize / 2 + 8
      );
    });
  }, [skills]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellSize = 60;
    const gap = 4;
    const cols = Math.floor(canvas.width / (cellSize + gap));
    
    const col = Math.floor(x / (cellSize + gap));
    const row = Math.floor(y / (cellSize + gap));
    const idx = row * cols + col;
    
    if (idx >= 0 && idx < skills.length) {
      setHoveredSkill(skills[idx]);
      setMousePos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredSkill(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Card className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Skill Gap Heatmap
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Darker colors = larger skill gaps • Hover for details
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-cyan-500" />
            <span className="text-xs text-gray-400">Proficient (0-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-purple-400" />
            <span className="text-xs text-gray-400">Needs Work (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
            <span className="text-xs text-gray-400">Critical Gap (70-100%)</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={Math.ceil(skills.length / 12) * 64}
          className="w-full rounded-lg cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSkill(null)}
        />
      </Card>

      {/* Tooltip */}
      {hoveredSkill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            left: mousePos.x + 10,
            top: mousePos.y + 10,
            pointerEvents: 'none',
          }}
          className="
            glass-card p-4 z-50
            border-2 border-white/20
            shadow-[0_0_20px_rgba(99,102,241,0.3)]
          "
        >
          <h4 className="font-semibold text-white mb-2">{hoveredSkill.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Current:</span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                Level {hoveredSkill.currentLevel}
              </Badge>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Target:</span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Level {hoveredSkill.targetLevel}
              </Badge>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Gap:</span>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                {hoveredSkill.targetLevel - hoveredSkill.currentLevel} levels
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
