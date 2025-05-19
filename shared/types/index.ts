import { Campaign, Rule, Recommendation } from "../schema";

// Campaign types
export interface CampaignMetrics {
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  orders: number;
}

// Bid prediction types
export interface BidPrediction {
  campaignId: number;
  currentBid: number;
  suggestedBid: number;
  confidence: number;
  metrics: {
    predictedAcos: number;
    predictedRoas: number;
    predictedCtr: number;
  };
}

export interface CampaignFeatures {
  historicalAcos: number;
  historicalRoas: number;
  historicalCtr: number;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
}

// Forecast types
export interface ForecastPoint {
  date: string;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
}

export interface CampaignForecast {
  historicalData: ForecastPoint[];
  forecasts: ForecastPoint[];
  confidenceInterval: {
    upper: ForecastPoint[];
    lower: ForecastPoint[];
  };
  metrics: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
  };
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIServiceInterface {
  generateResponse(messages: ChatMessage[]): Promise<string>;
  generateTitle(message: string): Promise<string>;
}

// Export schema types for convenience
export type { Campaign, Rule, Recommendation };