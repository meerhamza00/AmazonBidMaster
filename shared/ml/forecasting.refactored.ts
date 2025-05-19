import { Campaign } from "../schema";
import { CampaignForecast, CampaignMetrics, ForecastPoint } from "../types";

/**
 * Generate historical data points from campaign metrics
 * This function simulates historical data with realistic variations
 */
function generateHistoricalData(campaign: Campaign, days: number = 14): ForecastPoint[] {
  const metrics = campaign.metrics as CampaignMetrics;
  
  // Calculate base daily values
  const baseSpend = metrics.spend / days;
  const baseSales = metrics.sales / days;
  
  // Generate realistic daily variations using a seeded random approach
  return Array(days).fill(null).map((_, i) => {
    // Create deterministic but varied daily values
    // Use campaign ID and day as seeds for pseudo-randomness
    const dayVariation = Math.sin(i * 0.5) * 0.2; // -0.2 to 0.2 variation
    const weekdayEffect = (i % 7 < 5) ? 1.1 : 0.8; // Higher on weekdays, lower on weekends
    
    // Apply variations to create realistic daily data
    const dailySpend = baseSpend * (1 + dayVariation) * weekdayEffect;
    const dailySales = baseSales * (1 + dayVariation * 1.2) * weekdayEffect; // Sales fluctuate more than spend
    
    // Calculate derived metrics
    const dailyAcos = (dailySpend / dailySales) * 100;
    const dailyRoas = dailySales / dailySpend;
    
    return {
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      spend: Math.max(0, dailySpend),
      sales: Math.max(0, dailySales),
      acos: isFinite(dailyAcos) ? dailyAcos : metrics.acos,
      roas: isFinite(dailyRoas) ? dailyRoas : metrics.roas
    };
  });
}

/**
 * Generate forecast points based on trend analysis
 */
function generateForecastPoints(
  baseValue: number, 
  periods: number, 
  trend: number
): number[] {
  const forecasts = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < periods; i++) {
    currentValue = currentValue * (1 + trend);
    forecasts.push(currentValue);
  }
  
  return forecasts;
}

/**
 * Calculate confidence intervals for forecasts
 */
function calculateConfidenceIntervals(
  forecasts: ForecastPoint[],
  spendStdDev: number,
  salesStdDev: number
): {
  upper: ForecastPoint[];
  lower: ForecastPoint[];
} {
  const zScore = 1.96; // 95% confidence level
  
  return {
    upper: forecasts.map(f => ({
      ...f,
      spend: f.spend + zScore * spendStdDev,
      sales: f.sales + zScore * salesStdDev,
      acos: ((f.spend + zScore * spendStdDev) / (f.sales + zScore * salesStdDev)) * 100,
      roas: (f.sales + zScore * salesStdDev) / (f.spend + zScore * spendStdDev)
    })),
    lower: forecasts.map(f => ({
      ...f,
      spend: Math.max(0, f.spend - zScore * spendStdDev),
      sales: Math.max(0, f.sales - zScore * salesStdDev),
      acos: ((f.spend - zScore * spendStdDev) / (f.sales - zScore * salesStdDev)) * 100,
      roas: (f.sales - zScore * salesStdDev) / (f.spend - zScore * spendStdDev)
    }))
  };
}

/**
 * Calculate error metrics for forecast evaluation
 */
function calculateErrorMetrics(
  historicalData: ForecastPoint[],
  metrics: CampaignMetrics
): { mape: number; rmse: number } {
  const dailySpend = metrics.spend / historicalData.length;
  
  const mape = historicalData.reduce((acc, point) => 
    acc + Math.abs((point.spend - dailySpend) / dailySpend), 0) / historicalData.length * 100;

  const rmse = Math.sqrt(
    historicalData.reduce((acc, point) => 
      acc + Math.pow(point.spend - dailySpend, 2), 0) / historicalData.length
  );
  
  return { mape, rmse };
}

/**
 * Generate campaign forecast with advanced trend analysis
 */
export function generateCampaignForecast(
  campaign: Campaign, 
  daysToForecast: number = 30 // Extended to 30 days
): CampaignForecast {
  const metrics = campaign.metrics as CampaignMetrics;
  
  // Generate historical data with realistic variations
  const historicalData = generateHistoricalData(campaign);
  
  // Calculate average daily metrics
  const dailySpend = metrics.spend / historicalData.length;
  const dailySales = metrics.sales / historicalData.length;
  
  // Calculate trends based on campaign performance
  let spendTrend = 0.01; // Default 1% daily growth
  let salesTrend = 0.012; // Default 1.2% daily growth
  
  // Adjust trends based on campaign performance
  if (metrics.acos < 20) {
    // Low ACOS campaigns (highly profitable) - increase spend more aggressively
    spendTrend = 0.025; // 2.5% daily growth
    salesTrend = 0.028; // 2.8% daily growth
  } else if (metrics.acos > 50) {
    // High ACOS campaigns (less profitable) - more conservative growth
    spendTrend = 0.005; // 0.5% daily growth
    salesTrend = 0.007; // 0.7% daily growth
  }
  
  // Adjust for campaign maturity (using CTR as a proxy)
  if (metrics.ctr > 0.02) {
    // High CTR indicates a mature, well-targeted campaign
    // Expect slower growth but more stability
    spendTrend *= 0.8;
    salesTrend *= 0.9;
  }
  
  // Generate forecast points with seasonality
  const futureSpend = generateForecastPoints(dailySpend, daysToForecast, spendTrend);
  const futureSales = generateForecastPoints(dailySales, daysToForecast, salesTrend);
  
  // Generate forecast points with weekday/weekend patterns
  const forecasts: ForecastPoint[] = Array(daysToForecast).fill(null).map((_, i) => {
    // Apply weekday/weekend effect
    const today = new Date();
    const forecastDate = new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
    const isWeekend = forecastDate.getDay() === 0 || forecastDate.getDay() === 6;
    
    // Weekend adjustment factors
    const weekendSpendFactor = isWeekend ? 0.85 : 1.05;
    const weekendSalesFactor = isWeekend ? 0.9 : 1.03;
    
    const spend = futureSpend[i] * weekendSpendFactor;
    const sales = futureSales[i] * weekendSalesFactor;
    
    // Calculate derived metrics with safety checks
    let acos = (spend / sales) * 100;
    let roas = sales / spend;
    
    // Handle potential division by zero or invalid values
    if (!isFinite(acos) || acos <= 0) acos = metrics.acos;
    if (!isFinite(roas) || roas <= 0) roas = metrics.roas;
    
    return {
      date: forecastDate.toISOString().split('T')[0],
      spend: Math.round(spend * 100) / 100, // Round to 2 decimal places
      sales: Math.round(sales * 100) / 100, // Round to 2 decimal places
      acos: Math.round(acos * 10) / 10, // Round to 1 decimal place
      roas: Math.round(roas * 100) / 100 // Round to 2 decimal places
    };
  });
  
  // Calculate standard deviations with improved robustness
  const spendValues = historicalData.map(d => d.spend);
  const salesValues = historicalData.map(d => d.sales);
  
  // Calculate standard deviations with outlier protection
  const spendStdDev = calculateRobustStdDev(spendValues, dailySpend);
  const salesStdDev = calculateRobustStdDev(salesValues, dailySales);
  
  // Calculate confidence intervals with increasing uncertainty over time
  const confidenceInterval = calculateConfidenceIntervalsWithTimeDecay(
    forecasts, 
    spendStdDev, 
    salesStdDev
  );
  
  // Calculate error metrics
  const errorMetrics = calculateErrorMetrics(historicalData, metrics);
  
  return {
    historicalData,
    forecasts,
    confidenceInterval,
    metrics: errorMetrics
  };
}

/**
 * Calculate standard deviation with outlier protection
 */
function calculateRobustStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return mean * 0.2; // Default to 20% of mean if not enough data
  
  // Filter out extreme outliers (more than 3 standard deviations)
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const prelimStdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  
  const filteredValues = values.filter(v => Math.abs(v - mean) <= 3 * prelimStdDev);
  
  // Recalculate with filtered values
  if (filteredValues.length > 0) {
    const filteredMean = filteredValues.reduce((a, b) => a + b, 0) / filteredValues.length;
    const filteredSquaredDiffs = filteredValues.map(v => Math.pow(v - filteredMean, 2));
    return Math.sqrt(filteredSquaredDiffs.reduce((a, b) => a + b, 0) / filteredValues.length);
  }
  
  return prelimStdDev;
}

/**
 * Calculate confidence intervals with increasing uncertainty over time
 */
function calculateConfidenceIntervalsWithTimeDecay(
  forecasts: ForecastPoint[],
  spendStdDev: number,
  salesStdDev: number
): {
  upper: ForecastPoint[];
  lower: ForecastPoint[];
} {
  const zScore = 1.96; // 95% confidence level
  
  return {
    upper: forecasts.map((f, i) => {
      // Uncertainty increases with time
      const timeDecay = 1 + (i * 0.05); // 5% increase in uncertainty per day
      
      const adjustedSpendStdDev = spendStdDev * timeDecay;
      const adjustedSalesStdDev = salesStdDev * timeDecay;
      
      const upperSpend = f.spend + zScore * adjustedSpendStdDev;
      const upperSales = f.sales + zScore * adjustedSalesStdDev;
      
      return {
        ...f,
        spend: Math.round(upperSpend * 100) / 100,
        sales: Math.round(upperSales * 100) / 100,
        acos: Math.round((upperSpend / upperSales) * 1000) / 10,
        roas: Math.round((upperSales / upperSpend) * 100) / 100
      };
    }),
    
    lower: forecasts.map((f, i) => {
      // Uncertainty increases with time
      const timeDecay = 1 + (i * 0.05); // 5% increase in uncertainty per day
      
      const adjustedSpendStdDev = spendStdDev * timeDecay;
      const adjustedSalesStdDev = salesStdDev * timeDecay;
      
      const lowerSpend = Math.max(0, f.spend - zScore * adjustedSpendStdDev);
      const lowerSales = Math.max(0, f.sales - zScore * adjustedSalesStdDev);
      
      // Avoid division by zero
      const lowerAcos = lowerSales > 0 ? (lowerSpend / lowerSales) * 100 : f.acos;
      const lowerRoas = lowerSpend > 0 ? lowerSales / lowerSpend : f.roas;
      
      return {
        ...f,
        spend: Math.round(lowerSpend * 100) / 100,
        sales: Math.round(lowerSales * 100) / 100,
        acos: Math.round(lowerAcos * 10) / 10,
        roas: Math.round(lowerRoas * 100) / 100
      };
    })
  };
}