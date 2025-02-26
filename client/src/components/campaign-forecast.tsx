
import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateForecast, calculateConfidenceInterval } from "@shared/ml/forecasting";

interface ForecastProps {
  campaign: Campaign;
  daysAhead?: number;
}

export default function CampaignForecast({ campaign, daysAhead = 30 }: ForecastProps) {
  const forecasts = generateForecast(campaign, daysAhead);
  const { upper, lower } = calculateConfidenceInterval(forecasts);

  const metrics = {
    spend: { label: "Spend ($)", format: (v: number) => `$${v.toFixed(2)}` },
    sales: { label: "Sales ($)", format: (v: number) => `$${v.toFixed(2)}` },
    acos: { label: "ACOS (%)", format: (v: number) => `${v.toFixed(2)}%` },
    roas: { label: "ROAS", format: (v: number) => `${v.toFixed(2)}x` }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Forecast ({daysAhead} Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spend">
          <TabsList>
            {Object.entries(metrics).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(metrics).map(([key, { label, format }]) => (
            <TabsContent key={key} value={key}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => format(value)} />
                    <Line 
                      type="monotone" 
                      dataKey={key} 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Lower Bound</h4>
                  <p className="text-2xl font-bold">{format(lower[key as keyof typeof lower])}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Forecast</h4>
                  <p className="text-2xl font-bold">{format(forecasts[forecasts.length - 1][key as keyof typeof forecasts[0]])}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Upper Bound</h4>
                  <p className="text-2xl font-bold">{format(upper[key as keyof typeof upper])}</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { type Campaign } from "@shared/schema";
import { type CampaignForecast } from "@shared/ml/forecasting";

interface CampaignForecastProps {
  campaign: Campaign;
}

export default function CampaignForecast({ campaign }: CampaignForecastProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("spend");
  
  const { data: forecast, isLoading } = useQuery<CampaignForecast>({
    queryKey: [`/api/campaigns/${campaign.id}/forecast`],
  });

  if (isLoading) {
    return <div>Loading forecast...</div>;
  }

  if (!forecast) {
    return null;
  }

  const metrics = [
    { value: "spend", label: "Spend" },
    { value: "sales", label: "Sales" },
    { value: "acos", label: "ACOS" },
    { value: "roas", label: "ROAS" }
  ];

  // Combine historical and forecast data for the chart
  const chartData = [
    ...forecast.historicalData.map(point => ({
      ...point,
      type: "Historical"
    })),
    ...forecast.forecasts.map(point => ({
      ...point,
      type: "Forecast"
    }))
  ];

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Performance Forecast</CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map(metric => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name="Historical"
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#82ca9d"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Forecast"
              />
              <Line
                type="monotone"
                dataKey={`upper.${selectedMetric}`}
                stroke="#82ca9d"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Upper Bound"
              />
              <Line
                type="monotone"
                dataKey={`lower.${selectedMetric}`}
                stroke="#82ca9d"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Lower Bound"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Forecast Accuracy Metrics:</p>
          <p>MAPE: {forecast.metrics.mape.toFixed(2)}%</p>
          <p>RMSE: ${forecast.metrics.rmse.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
