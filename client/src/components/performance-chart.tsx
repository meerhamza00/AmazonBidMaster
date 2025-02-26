import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";

type ChartData = {
  date: string;
  [key: string]: number | string;
};

const metricConfig = {
  spend: {
    label: "Spend ($)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `$${value.toFixed(2)}`,
    gradientId: "spend-gradient",
  },
  sales: {
    label: "Sales ($)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `$${value.toFixed(2)}`,
    gradientId: "sales-gradient",
  },
  acos: {
    label: "ACOS (%)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `${value.toFixed(2)}%`,
    gradientId: "acos-gradient",
  },
  roas: {
    label: "ROAS",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `${value.toFixed(2)}x`,
    gradientId: "roas-gradient",
  },
  impressions: {
    label: "Impressions",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "impressions-gradient",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "clicks-gradient",
  },
};

export default function PerformanceChart({ data, metric, title }: { 
  data: ChartData[],
  metric: keyof typeof metricConfig,
  title: string 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${Math.min(400, window.innerHeight * 0.4)}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const config = metricConfig[metric];
  const formatYAxis = (value: number) => config.formatter(value);
  const formatTooltip = (value: number) => config.formatter(value);

  return (
    <Card className="w-full min-h-[400px] mb-6">
      <CardHeader>
        <CardTitle className="font-bold text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] md:h-[350px]">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => setIsExpanded(true)}
        >
          View Full Data
        </Button>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              width={80}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Bar
              dataKey={metric}
              name={config.label}
              fill={config.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{title} - Full View</DialogTitle>
            </DialogHeader>
            <div className="h-[calc(80vh-100px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Bar
                    dataKey={metric}
                    name={config.label}
                    fill={config.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}