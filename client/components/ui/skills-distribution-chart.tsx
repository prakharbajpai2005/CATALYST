'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DistributionData {
    name: string;
    value: number;
    [key: string]: any;
}

interface SkillsDistributionChartProps {
    data: DistributionData[];
    colors?: string[];
    className?: string;
}

const DEFAULT_COLORS = ['#FACC15', '#FF8C00', '#00C49F', '#0088FE'];

export default function SkillsDistributionChart({ data, colors, className }: SkillsDistributionChartProps) {
    const hasData = data && data.some(d => d.value > 0);
    const chartColors = colors || DEFAULT_COLORS;

    if (!hasData) {
        return (
            <div className={`w-full flex flex-col items-center justify-center text-center ${className || 'h-[300px]'}`}>
                <span className="text-sm text-white">No Skills Detected</span>
            </div>
        );
    }

    return (
        <div className={`w-full ${className || 'h-[300px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
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
