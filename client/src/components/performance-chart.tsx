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
  Tooltip, // Keep recharts Tooltip
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { ChevronUp, ChevronDown, Filter, Download, FileText, Share2, Info } from "lucide-react"; // Added Info
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { ChartExportMenu } from "@/components/ui/chart-export-menu";
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
// Alias Shadcn Tooltip components to avoid conflict with recharts Tooltip
import {
  Tooltip as ShadTooltip,
  TooltipContent as ShadTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    secondaryInfo: (value: number) => [
      {
        label: "Daily Average",
        value: `$${(value / 30).toFixed(2)}`
      },
      {
        label: "% of Budget",
        value: `${((value / 10000) * 100).toFixed(1)}%`,
        color: value > 8000 ? "text-red-500" : "text-green-500"
      }
    ],
  },
  sales: {
    label: "Sales ($)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `$${value.toFixed(2)}`,
    gradientId: "sales-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Daily Average",
        value: `$${(value / 30).toFixed(2)}`
      },
      {
        label: "Conversion Value",
        value: value > 10000 ? "High" : value > 5000 ? "Medium" : "Low",
        color: value > 10000 ? "text-green-500" : value > 5000 ? "text-yellow-500" : "text-red-500"
      }
    ],
  },
  acos: {
    label: "ACOS (%)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `${value.toFixed(2)}%`,
    gradientId: "acos-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Performance",
        value: value < 15 ? "Excellent" : value < 25 ? "Good" : value < 35 ? "Average" : "Poor",
        color: value < 15 ? "text-green-500" : value < 25 ? "text-emerald-500" : value < 35 ? "text-yellow-500" : "text-red-500"
      },
      {
        label: "Target Difference",
        value: `${(value - 25).toFixed(1)}%`,
        color: value < 25 ? "text-green-500" : "text-red-500"
      }
    ],
  },
  roas: {
    label: "ROAS",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `${value.toFixed(2)}x`,
    gradientId: "roas-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Performance",
        value: value > 5 ? "Excellent" : value > 3 ? "Good" : value > 2 ? "Average" : "Poor",
        color: value > 5 ? "text-green-500" : value > 3 ? "text-emerald-500" : value > 2 ? "text-yellow-500" : "text-red-500"
      },
      {
        label: "Target Difference",
        value: `${(value - 3).toFixed(1)}x`,
        color: value > 3 ? "text-green-500" : "text-red-500"
      }
    ],
  },
  impressions: {
    label: "Impressions",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "impressions-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Daily Average",
        value: Math.round(value / 30).toLocaleString()
      },
      {
        label: "Visibility",
        value: value > 100000 ? "High" : value > 50000 ? "Medium" : "Low",
        color: value > 100000 ? "text-green-500" : value > 50000 ? "text-yellow-500" : "text-red-500"
      }
    ],
  },
  clicks: {
    label: "Clicks",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => value.toLocaleString(),
    gradientId: "clicks-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Daily Average",
        value: Math.round(value / 30).toLocaleString()
      },
      {
        label: "Engagement",
        value: value > 5000 ? "High" : value > 2000 ? "Medium" : "Low",
        color: value > 5000 ? "text-green-500" : value > 2000 ? "text-yellow-500" : "text-red-500"
      }
    ],
  },
  ctr: {
    label: "CTR (%)",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
    formatter: (value: number) => `${value.toFixed(2)}%`,
    gradientId: "ctr-gradient",
    secondaryInfo: (value: number) => [
      {
        label: "Performance",
        value: value > 0.5 ? "Excellent" : value > 0.3 ? "Good" : value > 0.2 ? "Average" : "Poor",
        color: value > 0.5 ? "text-green-500" : value > 0.3 ? "text-emerald-500" : value > 0.2 ? "text-yellow-500" : "text-red-500"
      },
      {
        label: "Industry Avg Diff",
        value: `${(value - 0.3).toFixed(2)}%`,
        color: value > 0.3 ? "text-green-500" : "text-red-500"
      }
    ],
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
  const chartRef = useRef<HTMLDivElement>(null);

  // Export functions
  const exportToPng = () => {
    if (chartRef.current) {
      toPng(chartRef.current)
        .then((dataUrl) => {
          saveAs(dataUrl, `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`);
        })
        .catch((error) => {
          console.error('Error exporting chart:', error);
        });
    }
  };

  const exportToCsv = () => {
    // Convert data to CSV format
    const headers = ['date', metric];
    const csvContent = [
      headers.join(','),
      ...processedData.map(row => [
        row.date,
        row[metric]
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
  };

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

  // Prepare export columns
  const exportColumns = [
    { key: 'date', label: 'Date' },
    { key: metric, label: config.label }
  ];

  return (
    <Card className="w-full min-h-[400px] mb-6">
      <CardHeader className="flex-row justify-between items-start">
        <CardTitle className="font-bold text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <ShadTooltip>
              <TooltipTrigger asChild>
                {/* Add export menu */}
                <ChartExportMenu
                  chartRef={chartRef}
                  data={processedData}
                  filename={`${title}-${metric}`}
                  exportColumns={exportColumns}
                />
              </TooltipTrigger>
              <ShadTooltipContent>
                <p>Export the currently displayed chart data or image.</p>
              </ShadTooltipContent>
            </ShadTooltip>
          </TooltipProvider>
          <TooltipProvider>
             <ShadTooltip>
               <TooltipTrigger asChild>
                 {/* Wrap SelectTrigger for tooltip */}
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
               </TooltipTrigger>
               <ShadTooltipContent>
                 <p>Filter the chart data to show only the Top 10, Bottom 10, or All data points based on the current sort order.</p>
               </ShadTooltipContent>
             </ShadTooltip>
           </TooltipProvider>
          <TooltipProvider>
            <ShadTooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <ShadTooltipContent>
                <p>Toggle sorting the chart data in ascending or descending order based on the metric value.</p>
              </ShadTooltipContent>
            </ShadTooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] md:h-[350px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TooltipProvider>
            <ShadTooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                >
                  View Full Data
                </Button>
              </TooltipTrigger>
              <ShadTooltipContent>
                <p>Open a larger view of this chart showing all data points, not just the filtered set.</p>
              </ShadTooltipContent>
            </ShadTooltip>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground">
            Showing {processedData.length} of {data.length} campaigns
          </span>
        </div>
        <div ref={chartRef} className="flex-grow min-h-0">
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
              {/* Use recharts Tooltip here */}
              <Tooltip content={<EnhancedTooltip metrics={metricConfig} />} />
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

        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{title} - Full View</DialogTitle>
              <DialogDescription>
                Showing all campaigns with {config.label.toLowerCase()} data
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-2 mb-4">
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

              <ChartExportMenu
                chartRef={chartRef}
                data={data}
                filename={`${title}-${metric}-full`}
                exportColumns={exportColumns}
              />
            </div>
            <div className="h-[calc(80vh-180px)]" ref={chartRef}>
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
                   {/* Use recharts Tooltip here */}
                  <Tooltip content={<EnhancedTooltip metrics={metricConfig} />} />
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
