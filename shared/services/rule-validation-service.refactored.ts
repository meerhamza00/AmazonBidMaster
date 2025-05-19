import { Campaign, Rule, InsertRule } from "../schema";

interface ValidationResult {
  isValid: boolean;
  affectedCampaigns: number;
  potentialConflicts: number;
  warnings: string[];
  errors: string[];
}

/**
 * Validate a rule against campaigns and existing rules
 */
export function validateRule(
  rule: InsertRule,
  campaigns: Campaign[],
  existingRules: Rule[]
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    affectedCampaigns: 0,
    potentialConflicts: 0,
    warnings: [],
    errors: []
  };
  
  // Check if rule has valid conditions
  if (!rule.conditions || rule.conditions.length === 0) {
    result.isValid = false;
    result.errors.push("Rule must have at least one condition group");
    return result;
  }
  
  // Check if any condition group is empty
  const hasEmptyConditionGroup = rule.conditions.some(group => 
    !group.conditions || group.conditions.length === 0
  );
  
  if (hasEmptyConditionGroup) {
    result.isValid = false;
    result.errors.push("Each condition group must have at least one condition");
    return result;
  }
  
  // Count affected campaigns
  result.affectedCampaigns = countAffectedCampaigns(rule, campaigns);
  
  // Check for potential conflicts with existing rules
  result.potentialConflicts = findPotentialConflicts(rule, existingRules);
  
  if (result.potentialConflicts > 0) {
    result.warnings.push(`This rule may conflict with ${result.potentialConflicts} existing rule(s)`);
  }
  
  // Check if rule has a valid action
  if (!isValidAction(rule.action)) {
    result.isValid = false;
    result.errors.push(`Invalid action: ${rule.action}`);
  }
  
  // Check if adjustment is reasonable
  if (!isReasonableAdjustment(rule.action, rule.adjustment)) {
    result.warnings.push(`The adjustment value of ${rule.adjustment} may be too extreme`);
  }
  
  return result;
}

/**
 * Count campaigns that would be affected by this rule
 */
function countAffectedCampaigns(rule: InsertRule, campaigns: Campaign[]): number {
  return campaigns.filter(campaign => 
    evaluateRuleAgainstCampaign(rule, campaign)
  ).length;
}

/**
 * Evaluate if a rule applies to a campaign
 */
function evaluateRuleAgainstCampaign(rule: InsertRule, campaign: Campaign): boolean {
  // Evaluate each condition group
  return rule.conditions.some(group => {
    // For each group, evaluate all conditions based on the operator (AND/OR)
    const conditions = group.conditions;
    const operator = group.operator;
    
    if (operator === 'AND') {
      return conditions.every(condition => 
        evaluateCondition(condition, campaign)
      );
    } else { // OR
      return conditions.some(condition => 
        evaluateCondition(condition, campaign)
      );
    }
  });
}

/**
 * Evaluate a single condition against a campaign
 */
function evaluateCondition(condition: any, campaign: Campaign): boolean {
  const { metric, operator, value, value2 } = condition;
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

/**
 * Find potential conflicts with existing rules
 */
function findPotentialConflicts(rule: InsertRule, existingRules: Rule[]): number {
  return existingRules.filter(existingRule => {
    // Rules conflict if they have the same metric but different actions
    const ruleMetrics = getMetricsFromRule(rule);
    const existingMetrics = getMetricsFromRule(existingRule);
    
    const hasOverlappingMetrics = ruleMetrics.some(metric => 
      existingMetrics.includes(metric)
    );
    
    return hasOverlappingMetrics && rule.action !== existingRule.action;
  }).length;
}

/**
 * Get all metrics used in a rule
 */
function getMetricsFromRule(rule: InsertRule | Rule): string[] {
  const metrics: string[] = [];
  
  rule.conditions.forEach(group => {
    group.conditions.forEach(condition => {
      if (!metrics.includes(condition.metric)) {
        metrics.push(condition.metric);
      }
    });
  });
  
  return metrics;
}

/**
 * Check if action is valid
 */
function isValidAction(action: string): boolean {
  const validActions = [
    'increase_bid',
    'decrease_bid',
    'pause_campaign',
    'enable_campaign',
    'set_bid'
  ];
  
  return validActions.includes(action);
}

/**
 * Check if adjustment is reasonable
 */
function isReasonableAdjustment(action: string, adjustment: any): boolean {
  const numAdjustment = parseFloat(adjustment);
  
  if (isNaN(numAdjustment)) {
    return false;
  }
  
  if (action === 'increase_bid' || action === 'decrease_bid') {
    // For percentage adjustments, check if it's between 1% and 100%
    return numAdjustment >= 1 && numAdjustment <= 100;
  }
  
  if (action === 'set_bid') {
    // For absolute bid values, check if it's between $0.01 and $10
    return numAdjustment >= 0.01 && numAdjustment <= 10;
  }
  
  return true;
}