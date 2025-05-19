import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Area, 
  AreaChart,
  ReferenceLine 
} from 'recharts';
import { useState, useRef } from "react";
import { type CampaignForecast as ForecastData, type ForecastPoint } from "@shared/ml/forecasting";
import { BarChart2, TrendingUp, BadgeDollarSign, PercentIcon, Download, FileText } from "lucide-react";
import { ZoomableChart } from "@/components/ui/zoomable-chart";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { ChartExportMenu } from "@/components/ui/chart-export-menu";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

interface CampaignForecastProps {
  campaign: Campaign;
  daysAhead?: number;
}

type ForecastMetric = {
  key: string;
  label: string;
  icon: React.ReactNode;
  format: (value: number) => string;
  color: string;
};

// Extend ForecastPoint to support indexing by string
type ExtendedForecastPoint = {
  [key: string]: any;
} & ForecastPoint;

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, metricFormat }: any) => {
  if (active && payload && payload.length) {
    const isHistorical = new Date(label) < new Date();
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        <div className="my-1 border-t border-border/30" />
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-medium">{metricFormat(entry.value)}</span>
            </p>
          ))}
        </div>
        <div className="mt-1 text-xs opacity-70">
          {isHistorical ? "Historical Data" : "Forecast Data"}
        </div>
      </div>
    );
  }
  return null;
};

export default function CampaignForecast({ campaign, daysAhead = 30 }: CampaignForecastProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("spend");
  const chartRef = useRef<HTMLDivElement>(null);

  // Define metrics with icons and formatting
  const metrics: Record<string, ForecastMetric> = {
    spend: { 
      key: "spend", 
      label: "Spend ($)", 
      icon: <BadgeDollarSign className="h-4 w-4 text-[#ff6b00]" />, 
      format: (v: number) => `$${v.toFixed(2)}`,
      color: "#ff6b00" 
    },
    sales: { 
      key: "sales", 
      label: "Sales ($)", 
      icon: <BarChart2 className="h-4 w-4 text-[#ff6b00]" />, 
      format: (v: number) => `$${v.toFixed(2)}`,
      color: "#ff6b00" 
    },
    acos: { 
      key: "acos", 
      label: "ACOS (%)", 
      icon: <PercentIcon className="h-4 w-4 text-[#ff6b00]" />, 
      format: (v: number) => `${v.toFixed(2)}%`,
      color: "#ff6b00" 
    },
    roas: { 
      key: "roas", 
      label: "ROAS", 
      icon: <TrendingUp className="h-4 w-4 text-[#ff6b00]" />, 
      format: (v: number) => `${v.toFixed(2)}x`,
      color: "#ff6b00" 
    }
  };

  // Fetch forecast data from API
  const { data: forecast, isLoading, error } = useQuery<ForecastData>({
    queryKey: [`/api/campaigns/${campaign.id}/forecast`],
  });

  // Process data for the chart
  const chartData = forecast ? [
    ...forecast.historicalData.map(point => ({
      ...point,
      isHistorical: true
    })),
    ...forecast.forecasts.map(point => ({
      ...point,
      isHistorical: false
    }))
  ] : [];

  // Create confidence interval areas for the chart
  const confidenceIntervalData = forecast ? [
    ...forecast.historicalData.map(() => ({
      // No confidence interval for historical data
      upperBound: null,
      lowerBound: null,
      [selectedMetric]: null // Add this to avoid TypeScript error
    } as Record<string, any>)),
    ...forecast.forecasts.map((point, idx) => ({
      upperBound: (forecast.confidenceInterval.upper[idx] as ExtendedForecastPoint)[selectedMetric],
      lowerBound: (forecast.confidenceInterval.lower[idx] as ExtendedForecastPoint)[selectedMetric],
      [selectedMetric]: (point as ExtendedForecastPoint)[selectedMetric] // Copy the metric value
    } as Record<string, any>))
  ] : [];

  // Merge chart data with confidence intervals
  const mergedChartData = chartData.map((point, idx) => ({
    ...point as Record<string, any>,
    upperBound: confidenceIntervalData[idx]?.upperBound,
    lowerBound: confidenceIntervalData[idx]?.lowerBound
  }));

  // Calculate domain min and max for Y axis
  let yMin = 0;
  let yMax = 0;

  if (mergedChartData.length > 0) {
    const values = mergedChartData.map(d => {
      const value = (d as Record<string, any>)[selectedMetric];
      const upper = d.upperBound || value;
      const lower = d.lowerBound || value;
      return [value, upper, lower];
    }).flat().filter(v => v !== null && !isNaN(v)) as number[];
    
    yMin = Math.min(...values) * 0.9;
    yMax = Math.max(...values) * 1.1;
  }
  
  // Export functions
  const exportToPng = () => {
    if (chartRef.current) {
      toPng(chartRef.current)
        .then((dataUrl) => {
          saveAs(dataUrl, `forecast-${campaign.id}-${selectedMetric}-${new Date().toISOString().split('T')[0]}.png`);
        })
        .catch((error) => {
          console.error('Error exporting chart:', error);
        });
    }
  };

  const exportToCsv = () => {
    if (!forecast) return;
    
    // Convert data to CSV format
    const headers = ['date', 'actual', 'forecast', 'lowerBound', 'upperBound'];
    const csvContent = [
      headers.join(','),
      ...mergedChartData.map(row => [
        row.date,
        row[selectedMetric],
        row.forecast,
        row.lowerBound,
        row.upperBound
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `forecast-${campaign.id}-${selectedMetric}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Find the current date to use as a reference line
  const currentDate = new Date().toISOString().split('T')[0];

  // Show a message if no data is available
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Forecast</CardTitle>
          <CardDescription>
            Unable to generate forecast. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#ff6b00]" />
          Campaign Forecast
        </CardTitle>
        <CardDescription>
          {daysAhead}-day performance forecast using machine learning models
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <Tabs defaultValue="spend" className="space-y-6" onValueChange={setSelectedMetric}>
            <TabsList className="grid grid-cols-4">
              {Object.values(metrics).map(({ key, label, icon }) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2 text-wrap">
                  <span className="flex-shrink-0">{icon}</span>
                  <span className="truncate">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(metrics).map(({ key, label, format, color }) => (
              <TabsContent key={key} value={key} className="space-y-6 pt-2">
                {/* Metric summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Lower bound */}
                  <div className="bg-muted/20 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      Lower Bound
                    </h4>
                    <p className="text-2xl font-bold truncate">
                      {forecast && format((forecast.confidenceInterval.lower[forecast.confidenceInterval.lower.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs text-muted-foreground block text-wrap break-words">
                      Conservative estimate (95% confidence)
                    </span>
                  </div>
                  
                  {/* Expected forecast */}
                  <div className="bg-[#ff6b00]/10 p-4 rounded-lg border border-[#ff6b00]/20">
                    <h4 className="text-sm font-medium text-[#ff6b00] flex items-center gap-1 whitespace-nowrap">
                      {metrics[key].icon} Expected
                    </h4>
                    <p className="text-2xl font-bold text-foreground truncate">
                      {forecast && format((forecast.forecasts[forecast.forecasts.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs block text-wrap break-words">
                      <span className="text-muted-foreground">
                        Forecasted {label.toLowerCase()}
                      </span>
                    </span>
                  </div>
                  
                  {/* Upper bound */}
                  <div className="bg-muted/20 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      Upper Bound
                    </h4>
                    <p className="text-2xl font-bold truncate">
                      {forecast && format((forecast.confidenceInterval.upper[forecast.confidenceInterval.upper.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs text-muted-foreground block text-wrap break-words">
                      Optimistic estimate (95% confidence)
                    </span>
                  </div>
                </div>
                
                {/* Chart with export buttons */}
                <div className="relative">
                  <div className="absolute top-0 right-0 z-10 flex gap-2">
                    <ChartExportMenu
                      chartRef={chartRef}
                      data={mergedChartData}
                      filename={`forecast-${campaign.id}-${key}`}
                      exportColumns={[
                        { key: 'date', label: 'Date' },
                        { key: key, label: label },
                        { key: 'upperBound', label: 'Upper Bound' },
                        { key: 'lowerBound', label: 'Lower Bound' }
                      ]}
                    />
                  </div>
                  
                  <div ref={chartRef} className="mt-4">
                    <ZoomableChart
                      data={mergedChartData}
                      areaKey={key}
                      xAxisKey="date"
                      areaColor={color}
                      formatYAxis={(value) => {
                        const formatted = format(value);
                        return key === 'spend' || key === 'sales' 
                          ? formatted.replace('$', '') 
                          : formatted;
                      }}
                      formatTooltip={format}
                      tooltipContent={<CustomTooltip metricFormat={format} />}
                    >
                      {/* Confidence interval areas */}
                      <Area
                        type="monotone"
                        dataKey="upperBound"
                        stroke="transparent"
                        fill={color}
                        fillOpacity={0.1}
                        activeDot={false}
                        name="Upper Bound"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lowerBound" 
                        stroke="none"
                        fill="#ff6b00" 
                        fillOpacity={0}
                        name="Confidence Interval"
                        activeDot={false}
                      />
                      
                      {/* Main forecasting line */}
                      <Line 
                        type="monotone" 
                        dataKey={key} 
                        name={label} 
                        stroke="#ff6b00" 
                        strokeWidth={2} 
                        dot={(props) => {
                          // Different styling for historical vs forecast dots
                          const isHistorical = props.payload.isHistorical;
                          return (
                            <circle 
                              cx={props.cx} 
                              cy={props.cy} 
                              r={isHistorical ? 3 : 4} 
                              fill={isHistorical ? "#555" : "#ff6b00"} 
                              stroke="#ff6b00"
                              strokeWidth={isHistorical ? 0 : 1}
                              opacity={isHistorical ? 0.8 : 1}
                            />
                          );
                        }}
                        activeDot={{ r: 6, fill: "#ff6b00" }}
                        connectNulls={true}
                      />
                      
                      {/* Reference line for current date */}
                      <ReferenceLine 
                        x={currentDate} 
                        stroke="#666" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Today', 
                          position: 'insideTopRight',
                          fill: '#999',
                          fontSize: 10
                        }} 
                      />
                    </ZoomableChart>
                  </div>
                </div>

                {/* Accuracy metrics */}
                {forecast && (
                  <div className="flex justify-between text-xs text-muted-foreground border-t border-border/30 pt-4">
                    <span>
                      MAPE: {forecast.metrics.mape.toFixed(2)}%
                    </span>
                    <span>
                      RMSE: {forecast.metrics.rmse.toFixed(2)}
                    </span>
                    <span>
                      Confidence: 95%
                    </span>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}