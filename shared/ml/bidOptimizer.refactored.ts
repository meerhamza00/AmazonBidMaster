import { Campaign } from "../schema";
import { BidPrediction, CampaignFeatures, CampaignMetrics } from "../types";

/**
 * Extract features from a campaign for bid optimization
 */
export function extractFeatures(campaign: Campaign): CampaignFeatures {
  const metrics = campaign.metrics as CampaignMetrics;
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

/**
 * Predict optimal bid based on campaign features
 */
export function predictOptimalBid(features: CampaignFeatures, targetAcos: number = 30): number {
  // Handle edge cases
  if (features.clicks === 0 || features.spend === 0) {
    // No click data - use a conservative default bid
    return 0.25; // Default starting bid
  }
  
  const currentAcos = features.historicalAcos;
  const currentBid = features.spend / features.clicks;
  
  // If ACOS is zero or invalid, use alternative approach
  if (currentAcos === 0 || isNaN(currentAcos)) {
    // Use CTR-based approach if available
    if (features.historicalCtr > 0 && features.impressions > 100) {
      const avgCtr = 0.01; // 1% industry average CTR
      const ctrRatio = features.historicalCtr / avgCtr;
      
      // If CTR is above average, we can afford a higher bid
      return currentBid * Math.min(ctrRatio, 1.5);
    }
    return currentBid; // Keep current bid if no data
  }
  
  // Calculate adjustment based on target ACOS
  const adjustment = targetAcos / currentAcos;
  
  // Apply more sophisticated adjustment based on performance
  let suggestedBid = currentBid * adjustment;
  
  // Apply data-driven bounds
  const dataVolume = Math.min(features.clicks / 100, 1); // 0-1 scale based on click volume
  
  // More conservative bounds for low data volume, more aggressive for high volume
  const maxIncrease = currentBid * (1.2 + (0.3 * dataVolume)); // 1.2x to 1.5x
  const minDecrease = currentBid * (0.7 - (0.2 * dataVolume)); // 0.7x to 0.5x
  
  // Apply absolute minimum and maximum bounds
  const absoluteMin = 0.10; // $0.10 minimum bid
  const absoluteMax = 10.00; // $10.00 maximum bid
  
  // Apply all bounds
  suggestedBid = Math.min(Math.max(suggestedBid, minDecrease), maxIncrease);
  suggestedBid = Math.min(Math.max(suggestedBid, absoluteMin), absoluteMax);
  
  // Round to nearest cent for readability
  return Math.round(suggestedBid * 100) / 100;
}

/**
 * Calculate confidence score based on data volume and consistency
 */
function calculateConfidence(features: CampaignFeatures): number {
  // Base confidence on data volume
  const clickConfidence = Math.min(features.clicks / 200, 0.5); // 0-50% based on clicks
  const salesConfidence = Math.min(features.sales / 20, 0.3); // 0-30% based on sales
  const impressionConfidence = Math.min(features.impressions / 10000, 0.2); // 0-20% based on impressions
  
  // Calculate base confidence score
  let confidence = (clickConfidence + salesConfidence + impressionConfidence) * 100;
  
  // Adjust confidence based on data consistency
  if (features.historicalAcos > 0 && features.historicalRoas > 0) {
    // If we have both ACOS and ROAS data, add bonus confidence
    confidence += 10;
  }
  
  // Penalize confidence for very low CTR (might indicate targeting issues)
  if (features.historicalCtr < 0.001 && features.impressions > 1000) {
    confidence -= 20;
  }
  
  // Penalize confidence for very high ACOS (might indicate unprofitable campaign)
  if (features.historicalAcos > 100) {
    confidence -= 15;
  }
  
  // Ensure confidence is between 0-100%
  return Math.min(Math.max(confidence, 0), 100);
}

/**
 * Generate bid prediction for a campaign
 */
export function generateBidPrediction(
  campaign: Campaign, 
  targetAcos: number = 30
): BidPrediction {
  const features = extractFeatures(campaign);
  const currentBid = features.spend / features.clicks || 0;
  const suggestedBid = predictOptimalBid(features, targetAcos);
  const confidence = calculateConfidence(features);

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