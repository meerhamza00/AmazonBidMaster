
import type { Campaign } from "@shared/schema";

export function generateForecast(campaign: Campaign, daysAhead: number = 30) {
  const metrics = campaign.metrics;
  
  // Simple linear regression for forecasting
  const forecastedMetrics = {
    spend: metrics.spend * (1 + 0.05 * daysAhead), // Assume 5% daily growth
    impressions: metrics.impressions * (1 + 0.03 * daysAhead),
    clicks: metrics.clicks * (1 + 0.04 * daysAhead),
    sales: metrics.sales * (1 + 0.06 * daysAhead)
  };
  
  // Calculate derived metrics
  const forecastedAcos = (forecastedMetrics.spend / forecastedMetrics.sales) * 100;
  const forecastedRoas = forecastedMetrics.sales / forecastedMetrics.spend;
  const forecastedCtr = (forecastedMetrics.clicks / forecastedMetrics.impressions) * 100;
  
  return {
    ...forecastedMetrics,
    acos: forecastedAcos,
    roas: forecastedRoas,
    ctr: forecastedCtr
  };
}
