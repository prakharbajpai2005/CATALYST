'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface ProficiencyData {
    name: string;
    proficiency: number;
}

interface ProficiencyBarChartProps {
    data: ProficiencyData[];
    color?: string;
}

export default function ProficiencyBarChart({ data, color = '#FACC15' }: ProficiencyBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500">No Technical Skills Detected</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 40, // Increased margin for labels
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#9ca3af" />
                    <XAxis type="number" domain={[0, 5]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }}
                        interval={0}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        contentStyle={{
                            backgroundColor: '#111827',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                        }}
                    />
                    <Bar dataKey="proficiency" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
