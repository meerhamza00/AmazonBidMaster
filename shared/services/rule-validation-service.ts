import { Campaign, Rule, InsertRule } from '@shared/schema';
import { BidPrediction, generateBidPrediction } from '@shared/ml/bidOptimizer';

export interface ValidationResult {
  affectedCampaigns: Campaign[];
  unaffectedCampaigns: Campaign[];
  impactSummary: {
    totalBidChange: number;
    averageBidChange: number;
    estimatedAcosDelta: number;
    estimatedRoasDelta: number;
    confidence: number;
  };
  metrics: {
    current: {
      spend: number;
      sales: number;
      acos: number;
      roas: number;
      ctr: number;
    };
    projected: {
      spend: number;
      sales: number;
      acos: number;
      roas: number;
      ctr: number;
    };
  };
  campaignImpacts: Array<{
    campaign: Campaign;
    bidChange: number;
    currentBid: number;
    newBid: number;
    metrics: {
      currentAcos: number;
      projectedAcos: number;
      currentRoas: number;
      projectedRoas: number;
      acosDelta: number;
      roasDelta: number;
    };
  }>;
  conflictingRules: Rule[];
  validationScore: number;
  warnings: string[];
}

// Helper function to check if a campaign matches a condition
function campaignMatchesCondition(campaign: Campaign, condition: any): boolean {
  const { metric, operator, value, value2, timeframe } = condition;
  
  // Extract campaign metrics - it's stored as an unknown type so we cast it
  const metrics = campaign.metrics as any;
  
  if (!metrics || metrics[metric] === undefined) {
    return false;
  }
  
  const metricValue = metrics[metric];
  
  switch (operator) {
    case 'greater_than':
      return metricValue > value;
    case 'less_than':
      return metricValue < value;
    case 'equal_to':
      return metricValue === value;
    case 'not_equal_to':
      return metricValue !== value;
    case 'between':
      return metricValue >= value && metricValue <= value2;
    default:
      return false;
  }
}

// Check if a campaign matches a condition group
function campaignMatchesConditionGroup(campaign: Campaign, conditionGroup: any): boolean {
  const { operator, conditions } = conditionGroup;
  
  if (operator === 'AND') {
    return conditions.every((condition: any) => campaignMatchesCondition(campaign, condition));
  } else if (operator === 'OR') {
    return conditions.some((condition: any) => campaignMatchesCondition(campaign, condition));
  }
  
  return false;
}

// Check if a campaign matches the rule conditions
function campaignMatchesRule(campaign: Campaign, rule: Rule | InsertRule): boolean {
  const conditionGroups = rule.conditions as any[];
  
  // A rule typically has multiple condition groups connected by OR logic
  return conditionGroups.some(group => campaignMatchesConditionGroup(campaign, group));
}

// Calculate the estimated impact of applying a rule to a campaign
function calculateRuleImpact(campaign: Campaign, rule: Rule | InsertRule): any {
  const metrics = campaign.metrics as any;
  const { action, adjustment } = rule;
  
  const adjustmentFactor = parseFloat(String(adjustment)) / 100;
  
  // Current metrics
  const currentAcos = metrics.acos || 0;
  const currentRoas = metrics.roas || 0;
  const currentCtr = metrics.ctr || 0;
  
  // Simple projection model - this would be more sophisticated in a real app
  let bidChange = 0;
  let acosDelta = 0;
  let roasDelta = 0;
  
  if (action === 'increase_bid') {
    bidChange = adjustmentFactor;
    // Increasing bids typically increases spend faster than sales in the short term
    acosDelta = currentAcos * 0.1; // Estimated 10% ACOS increase
    roasDelta = -currentRoas * 0.05; // Estimated 5% ROAS decrease
  } else if (action === 'decrease_bid') {
    bidChange = -adjustmentFactor;
    // Decreasing bids typically decreases spend faster than sales in the short term
    acosDelta = -currentAcos * 0.1; // Estimated 10% ACOS decrease
    roasDelta = currentRoas * 0.05; // Estimated 5% ROAS increase
  }
  
  // Get current bid - this would come from actual data
  const currentBid = parseFloat((campaign.budget || '0').replace('$', ''));
  const newBid = currentBid * (1 + bidChange);
  
  // More accurate prediction using the bid optimizer ML model if available
  let bidPrediction: BidPrediction | null = null;
  try {
    // This might throw if the model is not properly trained or campaign data is insufficient
    bidPrediction = generateBidPrediction(campaign, parseFloat(String(adjustment)));
  } catch (error) {
    console.error('Error generating bid prediction:', error);
  }
  
  return {
    bidChange: bidChange * 100, // Convert to percentage
    currentBid,
    newBid,
    metrics: {
      currentAcos,
      projectedAcos: bidPrediction?.metrics.predictedAcos || currentAcos + acosDelta,
      currentRoas,
      projectedRoas: bidPrediction?.metrics.predictedRoas || currentRoas + roasDelta,
      acosDelta: bidPrediction ? 
        bidPrediction.metrics.predictedAcos - currentAcos : 
        acosDelta,
      roasDelta: bidPrediction ? 
        bidPrediction.metrics.predictedRoas - currentRoas : 
        roasDelta
    },
    confidence: bidPrediction?.confidence || 0.7 // Default confidence if ML model is not available
  };
}

// Check if a rule conflicts with existing rules
function findConflictingRules(newRule: Rule | InsertRule, existingRules: Rule[]): Rule[] {
  return existingRules.filter(existingRule => {
    // Rules conflict if they have similar conditions but different actions
    const newRuleConditions = JSON.stringify(newRule.conditions);
    const existingRuleConditions = JSON.stringify(existingRule.conditions);
    
    const conditionSimilarity = newRuleConditions === existingRuleConditions;
    const actionConflict = newRule.action !== existingRule.action;
    
    return conditionSimilarity && actionConflict;
  });
}

// Calculate validation score based on various factors
function calculateValidationScore(result: Partial<ValidationResult>): number {
  const {
    affectedCampaigns = [],
    conflictingRules = [],
    impactSummary = { confidence: 0, estimatedAcosDelta: 0, estimatedRoasDelta: 0 },
    warnings = []
  } = result;
  
  // Base score
  let score = 70;
  
  // Affected campaigns factor
  if (affectedCampaigns.length === 0) {
    score -= 30; // Big penalty if no campaigns are affected
  } else if (affectedCampaigns.length > 10) {
    score -= 10; // Small penalty if too many campaigns are affected (may be too broad)
  }
  
  // Conflicting rules penalty
  score -= conflictingRules.length * 15;
  
  // Impact confidence boost
  score += (impactSummary.confidence || 0) * 20;
  
  // Warning penalty
  score -= warnings.length * 5;
  
  // Performance impact boost/penalty
  const acosDelta = impactSummary.estimatedAcosDelta || 0;
  const roasDelta = impactSummary.estimatedRoasDelta || 0;
  
  if ((acosDelta < 0 && roasDelta > 0) || (acosDelta > 0 && roasDelta < 0)) {
    // This is a good sign - either ACOS is decreasing and ROAS increasing,
    // or ACOS is increasing and ROAS decreasing (which is expected)
    score += 10;
  } else if (acosDelta > 0 && roasDelta < 0) {
    // Bad sign - both metrics are moving in unfavorable directions
    score -= 15;
  }
  
  // Keep score within 0-100 range
  return Math.max(0, Math.min(100, score));
}

// Generate warnings based on validation results
function generateWarnings(result: Partial<ValidationResult>, rule: Rule | InsertRule): string[] {
  const warnings: string[] = [];
  
  // Check if no campaigns are affected
  if (result.affectedCampaigns?.length === 0) {
    warnings.push('No campaigns currently match this rule\'s conditions.');
  }
  
  // Check for conflicting rules
  if (result.conflictingRules && result.conflictingRules.length > 0) {
    warnings.push(`This rule conflicts with ${result.conflictingRules.length} existing rule(s).`);
  }
  
  // Check for extreme bid adjustments
  const adjustment = parseFloat(String(rule.adjustment));
  if (Math.abs(adjustment) > 30) {
    warnings.push(`Bid adjustment of ${adjustment}% is significant and may cause rapid budget changes.`);
  }
  
  // Check for too broad conditions
  if (result.affectedCampaigns && result.affectedCampaigns.length > 10) {
    warnings.push('This rule affects a large number of campaigns. Consider making conditions more specific.');
  }
  
  // Check for negative impact
  if (result.impactSummary) {
    if (
      (rule.action === 'increase_bid' && result.impactSummary.estimatedAcosDelta > 5) ||
      (rule.action === 'decrease_bid' && result.impactSummary.estimatedRoasDelta < -0.5)
    ) {
      warnings.push('This rule may have a negative impact on campaign performance.');
    }
  }
  
  return warnings;
}

// Main validation function
export function validateRule(rule: Rule | InsertRule, campaigns: Campaign[], existingRules: Rule[] = []): ValidationResult {
  // Find campaigns affected by the rule
  const affectedCampaigns = campaigns.filter(campaign => campaignMatchesRule(campaign, rule));
  const unaffectedCampaigns = campaigns.filter(campaign => !campaignMatchesRule(campaign, rule));
  
  // Calculate impact for each affected campaign
  const campaignImpacts = affectedCampaigns.map(campaign => {
    const impact = calculateRuleImpact(campaign, rule);
    return {
      campaign,
      ...impact
    };
  });
  
  // Calculate overall impact summary
  const impactSummary = {
    totalBidChange: campaignImpacts.reduce((sum, impact) => sum + impact.bidChange, 0),
    averageBidChange: campaignImpacts.length > 0 
      ? campaignImpacts.reduce((sum, impact) => sum + impact.bidChange, 0) / campaignImpacts.length 
      : 0,
    estimatedAcosDelta: campaignImpacts.length > 0 
      ? campaignImpacts.reduce((sum, impact) => sum + impact.metrics.acosDelta, 0) / campaignImpacts.length 
      : 0,
    estimatedRoasDelta: campaignImpacts.length > 0 
      ? campaignImpacts.reduce((sum, impact) => sum + impact.metrics.roasDelta, 0) / campaignImpacts.length 
      : 0,
    confidence: campaignImpacts.length > 0 
      ? campaignImpacts.reduce((sum, impact) => sum + impact.confidence, 0) / campaignImpacts.length 
      : 0
  };
  
  // Find conflicting rules
  const conflictingRules = findConflictingRules(rule, existingRules);
  
  // Calculate current and projected metrics
  const currentMetrics = affectedCampaigns.reduce((metrics, campaign) => {
    const campaignMetrics = campaign.metrics as any;
    return {
      spend: metrics.spend + (campaignMetrics.spend || 0),
      sales: metrics.sales + (campaignMetrics.sales || 0),
      acos: metrics.acos + (campaignMetrics.acos || 0),
      roas: metrics.roas + (campaignMetrics.roas || 0),
      ctr: metrics.ctr + (campaignMetrics.ctr || 0)
    };
  }, { spend: 0, sales: 0, acos: 0, roas: 0, ctr: 0 });
  
  // Average ACOS, ROAS, and CTR
  if (affectedCampaigns.length > 0) {
    currentMetrics.acos /= affectedCampaigns.length;
    currentMetrics.roas /= affectedCampaigns.length;
    currentMetrics.ctr /= affectedCampaigns.length;
  }
  
  // Calculate projected metrics
  const projectedMetrics = {
    spend: currentMetrics.spend * (1 + impactSummary.averageBidChange / 100),
    sales: currentMetrics.sales * (1 + impactSummary.averageBidChange / 200), // Sales typically grow slower than spend
    acos: currentMetrics.acos + impactSummary.estimatedAcosDelta,
    roas: currentMetrics.roas + impactSummary.estimatedRoasDelta,
    ctr: currentMetrics.ctr, // CTR usually doesn't change much with bid changes
  };
  
  // Partial result for generating warnings and calculating score
  const partialResult: Partial<ValidationResult> = {
    affectedCampaigns,
    conflictingRules,
    impactSummary
  };
  
  // Generate warnings
  const warnings = generateWarnings(partialResult, rule);
  partialResult.warnings = warnings;
  
  // Calculate validation score
  const validationScore = calculateValidationScore(partialResult);
  
  // Final validation result
  return {
    affectedCampaigns,
    unaffectedCampaigns,
    impactSummary,
    metrics: {
      current: currentMetrics,
      projected: projectedMetrics
    },
    campaignImpacts,
    conflictingRules,
    validationScore,
    warnings
  };
}