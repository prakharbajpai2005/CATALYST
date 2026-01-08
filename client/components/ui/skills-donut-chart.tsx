'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SkillData {
    name: string;
    proficiency: number;
    [key: string]: any;
}

interface SkillsDonutChartProps {
    data: SkillData[];
    color?: string;
}

// Yellow/Orange palette for the dark theme
const COLORS = ['#FACC15', '#EAB308', '#CA8A04', '#FF8C00', '#EA580C'];

export default function SkillsDonutChart({ data }: SkillsDonutChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-center">
                <span className="text-8xl font-bold !text-white mb-2">0</span>
                <span className="text-4xl !text-white">Soft Skills Detected</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="proficiency"
                        stroke="none"
                        style={{ filter: 'url(#glow)' }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: 'black',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#FACC15' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span style={{ color: 'white', fontWeight: 'bold' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
