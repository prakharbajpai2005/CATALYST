'use client';

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface SkillData {
    subject: string;
    A: number;
    fullMark: number;
}

interface SkillsRadarChartProps {
    data: SkillData[];
    color?: string;
}

export default function SkillsRadarChart({ data, color = '#FACC15' }: SkillsRadarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-center">
                <span className="text-8xl font-bold text-black mb-2">0</span>
                <span className="text-4xl text-black">Soft Skills Detected</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#4a4a4a" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'black', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                        name="Proficiency"
                        dataKey="A"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                        itemStyle={{ color: color }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
