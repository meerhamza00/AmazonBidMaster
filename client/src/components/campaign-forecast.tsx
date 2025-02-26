import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { generateForecast, calculateConfidenceInterval } from "@shared/ml/forecasting";
import { type CampaignForecast as ForecastData } from "@shared/ml/forecasting";

interface CampaignForecastProps {
  campaign: Campaign;
  daysAhead?: number;
}

export default function CampaignForecast({ campaign, daysAhead = 30 }: CampaignForecastProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("spend");

  const { data: forecast, isLoading } = useQuery<ForecastData>({
    queryKey: [`/api/campaigns/${campaign.id}/forecast`],
  });

  const forecasts = generateForecast(campaign, daysAhead);
  const { upper, lower } = calculateConfidenceInterval(forecasts);

  if (isLoading) {
    return <div>Loading forecast...</div>;
  }

  const metrics = {
    spend: { label: "Spend ($)", format: (v: number) => `$${v.toFixed(2)}` },
    sales: { label: "Sales ($)", format: (v: number) => `$${v.toFixed(2)}` },
    acos: { label: "ACOS (%)", format: (v: number) => `${v.toFixed(2)}%` },
    roas: { label: "ROAS", format: (v: number) => `${v.toFixed(2)}x` }
  };

  // Combine historical and forecast data for the chart
  const chartData = forecast ? [
    ...forecast.historicalData.map(point => ({
      ...point,
      type: "Historical"
    })),
    ...forecast.forecasts.map(point => ({
      ...point,
      type: "Forecast"
    }))
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Forecast</CardTitle>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Lower Bound</h4>
                  <p className="text-2xl font-bold">{format(lower[key as keyof typeof lower])}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Forecast</h4>
                  <p className="text-2xl font-bold">
                    {format(forecasts[forecasts.length - 1][key as keyof typeof forecasts[0]])}
                  </p>
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