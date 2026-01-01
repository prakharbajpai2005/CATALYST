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

interface SkillsLollipopChartProps {
    data: SkillData[];
    color?: string;
}

const LollipopShape = (props: any) => {
    const { x, y, width, height, fill } = props;
    // Calculate the end position of the bar
    const cx = x + width;
    const cy = y + height / 2;

    return (
        <g>
            {/* The Stick */}
            <rect
                x={x}
                y={y + height / 2 - 2}
                width={width}
                height={4}
                fill={fill}
                opacity={0.7}
                rx={2}
            />
            {/* The Pop */}
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill={fill}
                stroke="white"
                strokeWidth={2}
            />
        </g>
    );
};

export default function SkillsLollipopChart({ data, color = '#FF8C00' }: SkillsLollipopChartProps) {
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
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 40,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#4a4a4a" />
                    <XAxis type="number" domain={[0, 5]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: 'black', fontSize: 12, fontWeight: 'bold' }}
                        interval={0}
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
                        shape={<LollipopShape />}
                        barSize={30}
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
