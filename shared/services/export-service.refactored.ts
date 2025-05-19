import { Campaign, Rule, Recommendation } from "../schema";

/**
 * Export campaigns to CSV format
 */
export function exportCampaignsToCSV(campaigns: Campaign[]): string {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Budget',
    'Status',
    'Spend',
    'Sales',
    'ACOS',
    'ROAS',
    'Impressions',
    'Clicks',
    'CTR',
    'CPC',
    'Orders'
  ];
  
  // Create CSV content
  let csv = headers.join(',') + '\n';
  
  // Add campaign data
  campaigns.forEach(campaign => {
    const metrics = campaign.metrics as any;
    const row = [
      campaign.id,
      `"${campaign.name}"`,
      campaign.budget,
      campaign.status,
      metrics.spend,
      metrics.sales,
      metrics.acos,
      metrics.roas,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.cpc,
      metrics.orders
    ];
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Export rules to CSV format
 */
export function exportRulesToCSV(rules: Rule[]): string {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Description',
    'Action',
    'Adjustment',
    'Priority',
    'Status'
  ];
  
  // Create CSV content
  let csv = headers.join(',') + '\n';
  
  // Add rule data
  rules.forEach(rule => {
    const row = [
      rule.id,
      `"${rule.name}"`,
      `"${rule.description || ''}"`,
      rule.action,
      rule.adjustment,
      rule.priority,
      rule.isActive ? 'Active' : 'Inactive'
    ];
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Export recommendations to CSV format
 */
export function exportRecommendationsToCSV(recommendations: Recommendation[]): string {
  // Define CSV headers
  const headers = [
    'ID',
    'Campaign ID',
    'Rule ID',
    'Old Bid',
    'New Bid',
    'Justification',
    'Created At'
  ];
  
  // Create CSV content
  let csv = headers.join(',') + '\n';
  
  // Add recommendation data
  recommendations.forEach(rec => {
    const row = [
      rec.id,
      rec.campaignId,
      rec.ruleId,
      rec.oldBid,
      rec.newBid,
      `"${rec.justification}"`,
      new Date(rec.createdAt).toISOString()
    ];
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Export data to JSON format
 */
export function exportToJSON<T>(data: T[]): string {
  return JSON.stringify(data, null, 2);
}