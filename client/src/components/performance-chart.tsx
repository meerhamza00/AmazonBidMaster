
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  date: string;
  [key: string]: number | string;
};

type Props = {
  data: ChartData[];
  metric: string;
  title: string;
};

const metricConfig = {
  spend: {
    label: "Spend ($)",
    color: "#10B981",
    formatter: (value: number) => `$${value.toFixed(2)}`,
  },
  sales: {
    label: "Sales ($)",
    color: "#3B82F6",
    formatter: (value: number) => `$${value.toFixed(2)}`,
  },
  acos: {
    label: "ACOS (%)",
    color: "#EF4444",
    formatter: (value: number) => `${value.toFixed(2)}%`,
  },
  roas: {
    label: "ROAS",
    color: "#8B5CF6",
    formatter: (value: number) => `${value.toFixed(2)}x`,
  },
  impressions: {
    label: "Impressions",
    color: "#F59E0B",
    formatter: (value: number) => value.toLocaleString(),
  },
  clicks: {
    label: "Clicks",
    color: "#6366F1",
    formatter: (value: number) => value.toLocaleString(),
  },
};

export default function PerformanceChart({ data, metric, title }: Props) {
  const config = metricConfig[metric as keyof typeof metricConfig];

  const formatYAxis = (value: number) => {
    return config.formatter(value);
  };

  const formatTooltip = (value: number) => {
    return [config.formatter(value), config.label];
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {config.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              name={config.label}
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
