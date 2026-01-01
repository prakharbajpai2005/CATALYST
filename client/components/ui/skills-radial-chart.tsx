'use client';

import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface SkillData {
    name: string;
    proficiency: number;
    fill?: string;
}

interface SkillsRadialChartProps {
    data: SkillData[];
}

const COLORS = ['#FACC15', '#FF8C00', '#FF4500', '#DAA520', '#B8860B'];

export default function SkillsRadialChart({ data }: SkillsRadialChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-center">
                <span className="text-8xl font-bold text-black mb-2">0</span>
                <span className="text-4xl text-black">Soft Skills Detected</span>
            </div>
        );
    }

    // Add fill colors to data
    const chartData = data.map((d, i) => ({
        ...d,
        fill: COLORS[i % COLORS.length]
    }));

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    barSize={20}
                    data={chartData}
                >
                    <RadialBar
                        label={{ position: 'insideStart', fill: '#000', fontWeight: 'bold' }}
                        background
                        dataKey="proficiency"
                        cornerRadius={10}
                    />
                    <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        wrapperStyle={{
                            right: 0,
                            top: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            lineHeight: '24px'
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}
