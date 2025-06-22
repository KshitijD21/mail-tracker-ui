import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    morning: number;
    afternoon: number;
    evening: number;
  }[];
}

export default function TimeBarChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="morning" fill="#0284c7" /> {/* sky-600 */}
        <Bar dataKey="afternoon" fill="#f59e0b" /> {/* amber-500 */}
        <Bar dataKey="evening" fill="#9333ea" /> {/* purple-600 */}
      </BarChart>
    </ResponsiveContainer>
  );
}
