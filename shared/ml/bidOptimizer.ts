import { Campaign } from "@shared/schema";

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

// Features used for bid optimization
export interface CampaignFeatures {
  historicalAcos: number;
  historicalRoas: number;
  historicalCtr: number;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
}

export function extractFeatures(campaign: Campaign): CampaignFeatures {
  const metrics = campaign.metrics as any;
  return {
    historicalAcos: metrics.acos || 0,
    historicalRoas: metrics.roas || 0,
    historicalCtr: metrics.ctr || 0,
    impressions: metrics.impressions || 0,
    clicks: metrics.clicks || 0,
    spend: metrics.spend || 0,
    sales: metrics.sales || 0,
  };
}

// Simple linear regression-based bid optimizer
export function predictOptimalBid(features: CampaignFeatures, targetAcos: number = 30): number {
  // Simple heuristic-based approach for initial implementation
  // This will be replaced with actual ML model later
  const currentAcos = features.historicalAcos;
  const currentBid = features.spend / features.clicks;
  
  if (currentAcos === 0 || isNaN(currentAcos)) return currentBid;
  
  // Adjust bid based on target ACOS
  const adjustment = targetAcos / currentAcos;
  const suggestedBid = currentBid * adjustment;
  
  // Apply reasonable bounds
  const maxIncrease = currentBid * 1.5;
  const minDecrease = currentBid * 0.5;
  
  return Math.min(Math.max(suggestedBid, minDecrease), maxIncrease);
}

export function generateBidPrediction(
  campaign: Campaign, 
  targetAcos: number = 30
): BidPrediction {
  const features = extractFeatures(campaign);
  const currentBid = features.spend / features.clicks || 0;
  const suggestedBid = predictOptimalBid(features, targetAcos);
  
  // Calculate confidence based on data volume
  const confidence = Math.min(
    (features.clicks / 100) * (features.sales / 10),
    100
  );

  return {
    campaignId: campaign.id,
    currentBid,
    suggestedBid,
    confidence,
    metrics: {
      predictedAcos: targetAcos,
      predictedRoas: 100 / targetAcos,
      predictedCtr: features.historicalCtr,
    },
  };
}
