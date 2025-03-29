import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
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
import { ChevronUp, ChevronDown, Filter } from "lucide-react";

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

type SortOrder = 'asc' | 'desc';
type FilterOptions = 'all' | 'top10' | 'bottom10';

export default function PerformanceChart({ data, metric, title }: { 
  data: ChartData[],
  metric: keyof typeof metricConfig,
  title: string 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterOption, setFilterOption] = useState<FilterOptions>('top10');
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

  // Process data for display based on sort and filter options
  const processedData = [...data]
    .sort((a, b) => {
      const valueA = a[metric] as number;
      const valueB = b[metric] as number;
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    })
    .filter((_, index) => {
      if (filterOption === 'all') return true;
      if (filterOption === 'top10') return index < 10;
      if (filterOption === 'bottom10') {
        // For bottom 10, we need to sort in opposite direction first
        const reversedIndex = data.length - 1 - index;
        return reversedIndex < 10;
      }
      return true;
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card className="w-full min-h-[400px] mb-6">
      <CardHeader className="flex-row justify-between items-start">
        <CardTitle className="font-bold text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select 
            value={filterOption} 
            onValueChange={(value) => setFilterOption(value as FilterOptions)}
          >
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top10">Top 10</SelectItem>
              <SelectItem value="bottom10">Bottom 10</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] md:h-[350px]">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(true)}
          >
            View Full Data
          </Button>
          <span className="text-xs text-muted-foreground">
            Showing {processedData.length} of {data.length} campaigns
          </span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
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
              fill="#ff6b00"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{title} - Full View</DialogTitle>
              <DialogDescription>
                Showing all campaigns with {config.label.toLowerCase()} data
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              <Select 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value as SortOrder)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Highest to Lowest</SelectItem>
                  <SelectItem value="asc">Lowest to Highest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[calc(80vh-180px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[...data].sort((a, b) => {
                    const valueA = a[metric] as number;
                    const valueB = b[metric] as number;
                    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
                  })}
                >
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
                    fill="#ff6b00"
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