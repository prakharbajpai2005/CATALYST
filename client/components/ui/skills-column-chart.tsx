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

interface SkillData {
    name: string;
    proficiency: number;
}

interface SkillsColumnChartProps {
    data: SkillData[];
    color?: string;
}

export default function SkillsColumnChart({ data, color = '#FF8C00' }: SkillsColumnChartProps) {
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
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a4a4a" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: 'black', fontSize: 12, fontWeight: 'bold' }}
                        interval={0}
                    />
                    <YAxis
                        type="number"
                        domain={[0, 5]}
                        hide
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
                    <Bar
                        dataKey="proficiency"
                        fill={color}
                        radius={[10, 10, 0, 0]}
                        barSize={40}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
