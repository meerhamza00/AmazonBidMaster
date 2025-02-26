
import type { Campaign } from "@shared/schema";

interface ForecastMetrics {
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

export function generateForecast(campaign: Campaign, daysAhead: number = 30): ForecastMetrics[] {
  const metrics = campaign.metrics;
  const forecasts: ForecastMetrics[] = [];
  
  // Generate daily forecasts
  for (let day = 1; day <= daysAhead; day++) {
    // Apply seasonal factors and trend analysis
    const seasonalFactor = 1 + Math.sin(2 * Math.PI * day / 30) * 0.1; // Monthly seasonality
    const trendFactor = 1 + (day / daysAhead) * 0.2; // Upward trend
    
    // Calculate core metrics with seasonality and trend
    const spend = metrics.spend * seasonalFactor * trendFactor;
    const impressions = metrics.impressions * seasonalFactor * trendFactor;
    const clicks = metrics.clicks * seasonalFactor * trendFactor;
    const sales = metrics.sales * seasonalFactor * trendFactor;
    
    // Calculate derived metrics
    const acos = (spend / sales) * 100;
    const roas = sales / spend;
    const ctr = (clicks / impressions) * 100;
    const cpc = spend / clicks;
    
    forecasts.push({
      spend,
      sales,
      acos,
      roas,
      impressions,
      clicks,
      ctr,
      cpc
    });
  }
  
  return forecasts;
}

export function calculateConfidenceInterval(forecasts: ForecastMetrics[]): {
  upper: ForecastMetrics,
  lower: ForecastMetrics
} {
  const confidenceFactor = 0.15; // 15% confidence interval
  
  const upper = {} as ForecastMetrics;
  const lower = {} as ForecastMetrics;
  
  Object.keys(forecasts[0]).forEach((key) => {
    const metric = key as keyof ForecastMetrics;
    const lastValue = forecasts[forecasts.length - 1][metric];
    upper[metric] = lastValue * (1 + confidenceFactor);
    lower[metric] = lastValue * (1 - confidenceFactor);
  });
  
  return { upper, lower };
}
