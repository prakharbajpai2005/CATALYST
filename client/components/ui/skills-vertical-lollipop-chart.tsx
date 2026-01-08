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

interface SkillsVerticalLollipopChartProps {
    data: SkillData[];
    color?: string;
}

const VerticalLollipopShape = (props: any) => {
    const { x, y, width, height, fill } = props;
    // x, y are the top-left coordinates of the bar
    // width is the bandwidth
    // height is the length of the bar

    const cx = x + width / 2;
    const cy = y; // Top of the bar
    const bottomY = y + height; // Bottom of the bar (x-axis)

    return (
        <g>
            {/* The Stick */}
            <line
                x1={cx}
                y1={bottomY}
                x2={cx}
                y2={cy}
                stroke={fill}
                strokeWidth={4}
                strokeLinecap="round"
            />
            {/* The Pop */}
            <circle
                cx={cx}
                cy={cy}
                r={10}
                fill={fill}
                stroke="white"
                strokeWidth={0}
            />
        </g>
    );
};

export default function SkillsVerticalLollipopChart({ data, color = '#FACC15' }: SkillsVerticalLollipopChartProps) {
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
                    margin={{
                        top: 20,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a4a4a" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: 'white', fontSize: 10, fontWeight: '500' }}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        height={60}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis
                        type="number"
                        domain={[0, 5]}
                        hide
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: 'black',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Bar
                        dataKey="proficiency"
                        shape={<VerticalLollipopShape />}
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
