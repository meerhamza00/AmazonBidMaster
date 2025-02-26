
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
