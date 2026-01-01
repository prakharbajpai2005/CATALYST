'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DistributionData {
    name: string;
    value: number;
    [key: string]: any;
}

interface SkillsDistributionChartProps {
    data: DistributionData[];
}

const COLORS = ['#FACC15', '#FF8C00', '#00C49F', '#0088FE'];

export default function SkillsDistributionChart({ data }: SkillsDistributionChartProps) {
    const hasData = data && data.some(d => d.value > 0);

    if (!hasData) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500">No Skills Detected</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111827',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
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
