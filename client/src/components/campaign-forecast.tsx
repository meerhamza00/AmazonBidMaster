import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useState } from "react";
import { type CampaignForecast as ForecastData, type ForecastPoint } from "@shared/ml/forecasting";
import { BarChart2, TrendingUp, BadgeDollarSign, PercentIcon } from "lucide-react";

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
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  {icon}
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(metrics).map(({ key, label, format, color }) => (
              <TabsContent key={key} value={key} className="space-y-6 pt-2">
                {/* Metric summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Lower bound */}
                  <div className="bg-muted/20 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      Lower Bound
                    </h4>
                    <p className="text-2xl font-bold">
                      {forecast && format((forecast.confidenceInterval.lower[forecast.confidenceInterval.lower.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Conservative estimate (95% confidence)
                    </span>
                  </div>
                  
                  {/* Expected forecast */}
                  <div className="bg-[#ff6b00]/10 p-4 rounded-lg border border-[#ff6b00]/20">
                    <h4 className="text-sm font-medium text-[#ff6b00] flex items-center gap-1">
                      {metrics[key].icon} Expected
                    </h4>
                    <p className="text-2xl font-bold text-foreground">
                      {forecast && format((forecast.forecasts[forecast.forecasts.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs flex items-center gap-1">
                      <span className="text-muted-foreground">
                        Forecasted {label.toLowerCase()}
                      </span>
                    </span>
                  </div>
                  
                  {/* Upper bound */}
                  <div className="bg-muted/20 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      Upper Bound
                    </h4>
                    <p className="text-2xl font-bold">
                      {forecast && format((forecast.confidenceInterval.upper[forecast.confidenceInterval.upper.length - 1] as ExtendedForecastPoint)[key])}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Optimistic estimate (95% confidence)
                    </span>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={mergedChartData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.15} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }} 
                        tickMargin={10}
                        tickFormatter={(value) => {
                          // Format date to be more readable
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickFormatter={(value) => {
                          // Format Y-axis values based on the selected metric
                          const formatted = format(value);
                          // For currency, remove the dollar sign for cleaner appearance
                          return key === 'spend' || key === 'sales' 
                            ? formatted.replace('$', '') 
                            : formatted;
                        }}
                        domain={[yMin, yMax]}
                      />
                      <Tooltip 
                        content={<CustomTooltip metricFormat={format} />} 
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="circle"
                        iconSize={8}
                      />
                      
                      {/* Confidence interval area */}
                      <Area 
                        type="monotone" 
                        dataKey="upperBound" 
                        stroke="none"
                        fill="#ff6b00" 
                        fillOpacity={0.1}
                        name="Confidence Interval"
                        activeDot={false}
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
                    </AreaChart>
                  </ResponsiveContainer>
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