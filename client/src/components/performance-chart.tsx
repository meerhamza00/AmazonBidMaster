
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
    color: "hsl(var(--success))",
    formatter: (value: number) => `$${value.toFixed(2)}`,
    gradientId: "spend-gradient",
  },
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--primary))",
    formatter: (value: number) => `$${value.toFixed(2)}`,
    gradientId: "sales-gradient",
  },
  acos: {
    label: "ACOS (%)",
    color: "hsl(var(--destructive))",
    formatter: (value: number) => `${value.toFixed(2)}%`,
    gradientId: "acos-gradient",
  },
  roas: {
    label: "ROAS",
    color: "hsl(var(--secondary))",
    formatter: (value: number) => `${value.toFixed(2)}x`,
    gradientId: "roas-gradient",
  },
  impressions: {
    label: "Impressions",
    color: "hsl(var(--warning))",
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "impressions-gradient",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(var(--info))",
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "clicks-gradient",
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
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.1}
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              tickFormatter={formatYAxis}
              width={80}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              cursor={{ stroke: "hsl(var(--muted))" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                color: "hsl(var(--muted-foreground))"
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              name={config.label}
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: config.color
              }}
              fill={`url(#${config.gradientId})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
