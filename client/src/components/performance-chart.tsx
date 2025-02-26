import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DataPoint {
  date: string;
  spend: number;
  sales: number;
  acos: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  metric: "spend" | "sales" | "acos";
  title: string;
}

export default function PerformanceChart({
  data,
  metric,
  title
}: PerformanceChartProps) {
  const formatYAxis = (value: number) => {
    if (metric === "spend" || metric === "sales") {
      return `$${value.toFixed(0)}`;
    }
    return `${value.toFixed(1)}%`;
  };

  const formatTooltip = (value: number) => {
    if (metric === "spend" || metric === "sales") {
      return `$${value.toFixed(2)}`;
    }
    return `${value.toFixed(2)}%`;
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              width={80}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Campaign: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}