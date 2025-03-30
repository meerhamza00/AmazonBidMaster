import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Campaign, Rule, Recommendation } from '../schema';

type ExportFormat = 'csv' | 'pdf' | 'xlsx' | 'json';
type ReportType = 
  | 'campaign-performance' 
  | 'rule-analysis' 
  | 'bid-optimization' 
  | 'forecasting' 
  | 'historical-trends'
  | 'anomaly-detection'
  | 'time-of-day'
  | 'custom-metrics';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ExportOptions {
  format: ExportFormat;
  reportType: ReportType;
  dateRange?: DateRange;
  selectedCampaigns?: number[];  // Campaign IDs to include
  selectedMetrics?: string[];    // Metrics to include
  customTitle?: string;
  includeBranding?: boolean;
  includeTimestamp?: boolean;
  includeExecutiveSummary?: boolean;
  includeGlossary?: boolean;
  includeRecommendations?: boolean;
  themeColor?: string;  // Theme color for PDF exports
  pageSize?: string;    // Page size for PDF exports
}

interface ExportData {
  campaigns?: Campaign[];
  rules?: Rule[];
  recommendations?: Recommendation[];
  forecasts?: any[];
  historicalData?: any[];
  anomalies?: any[];
  timeOfDayData?: any[];
  customMetrics?: any[];
}

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate filename based on report type and options
const generateFilename = (options: ExportOptions): string => {
  const timestamp = options.includeTimestamp 
    ? `_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}` 
    : '';
  
  const title = options.customTitle 
    ? options.customTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
    : options.reportType.replace(/-/g, '_');
  
  return `${title}${timestamp}.${options.format}`;
};

// Add executive summary to data
const addExecutiveSummary = (data: any, reportType: ReportType): any => {
  const summaries = {
    'campaign-performance': 'This report provides a comprehensive overview of your campaign performance metrics, including spend, sales, ACoS, ROAS, impressions, clicks, and CTR.',
    'rule-analysis': 'This analysis shows the impact of your optimization rules on campaign performance, including which rules are active and their effects.',
    'bid-optimization': 'These bid recommendations are calculated based on historical performance data to optimize your campaign for your target metrics.',
    'forecasting': 'This forecast predicts future campaign performance based on historical trends and seasonality patterns.',
    'historical-trends': 'This trend analysis compares current performance with previous periods to identify long-term patterns.',
    'anomaly-detection': 'This report highlights unusual patterns or outliers in your campaign data that may require attention.',
    'time-of-day': 'This analysis shows how your campaigns perform at different times of day to help optimize scheduling.',
    'custom-metrics': 'This report includes the custom metrics you\'ve selected for analysis.'
  };

  // Add the summary to the data object
  return {
    executiveSummary: summaries[reportType],
    ...data
  };
};

// Add glossary of terms
const addGlossary = (data: any): any => {
  const glossary = {
    'ACoS': 'Advertising Cost of Sale - The ratio of ad spend to sales generated from those ads.',
    'ROAS': 'Return on Ad Spend - The ratio of sales generated to ad spend.',
    'CTR': 'Click-Through Rate - The percentage of impressions that resulted in clicks.',
    'CPC': 'Cost Per Click - The average cost paid per click on an ad.',
    'Impressions': 'The number of times your ads were displayed.',
    'Conversion Rate': 'The percentage of clicks that resulted in sales.',
    'Bid': 'The maximum amount you\'re willing to pay for a click on your ad.',
    'Budget': 'The maximum amount you\'re willing to spend on a campaign per day.',
    'Rule Impact': 'The effect of an optimization rule on key performance metrics.'
  };

  // Add the glossary to the data object
  return {
    ...data,
    glossary
  };
};

// Add recommendations based on data
const addRecommendations = (data: any, reportType: ReportType): any => {
  let recommendations = [];
  
  // Generate recommendations based on report type and available data
  switch (reportType) {
    case 'campaign-performance':
      if (data.campaigns) {
        // Find high ACoS campaigns
        const highACosCampaigns = data.campaigns.filter(c => c.metrics?.acos > 35);
        if (highACosCampaigns.length > 0) {
          recommendations.push(`Consider lowering bids for ${highACosCampaigns.length} campaigns with ACoS > 35%.`);
        }
        
        // Find low CTR campaigns
        const lowCtrCampaigns = data.campaigns.filter(c => c.metrics?.ctr < 0.2);
        if (lowCtrCampaigns.length > 0) {
          recommendations.push(`Review ad copy for ${lowCtrCampaigns.length} campaigns with CTR < 0.2%.`);
        }
      }
      break;
      
    case 'rule-analysis':
      if (data.rules) {
        const inactiveRules = data.rules.filter(r => !r.isActive);
        if (inactiveRules.length > 0) {
          recommendations.push(`You have ${inactiveRules.length} inactive rules that could be activated to improve performance.`);
        }
      }
      break;
      
    case 'bid-optimization':
      if (data.recommendations) {
        recommendations.push(`Implementing the suggested bid changes could improve your overall ROAS by approximately 10-15%.`);
      }
      break;
      
    case 'forecasting':
      recommendations.push(`Based on forecasted trends, consider increasing your budget for the upcoming holiday season to capitalize on expected increased traffic.`);
      break;
      
    default:
      recommendations.push(`Review the data in this report to identify opportunities for optimization.`);
  }
  
  // Add the recommendations to the data object
  return {
    ...data,
    recommendations
  };
};

// Convert data to CSV format
const exportToCsv = (data: any, options: ExportOptions): string => {
  let csvData: any[] = [];
  
  // Process data based on report type
  switch (options.reportType) {
    case 'campaign-performance':
      if (data.campaigns) {
        csvData = data.campaigns.map((campaign: Campaign) => ({
          'Campaign Name': campaign.name,
          'Status': campaign.status,
          'Budget': campaign.budget,
          'Spend': campaign.metrics?.spend || 0,
          'Sales': campaign.metrics?.sales || 0,
          'ACoS': campaign.metrics?.acos || 0,
          'ROAS': campaign.metrics?.roas || 0,
          'Impressions': campaign.metrics?.impressions || 0,
          'Clicks': campaign.metrics?.clicks || 0,
          'CTR': campaign.metrics?.ctr || 0,
          'Start Date': campaign.startDate,
          'End Date': campaign.endDate || 'Ongoing'
        }));
      }
      break;
      
    case 'rule-analysis':
      if (data.rules) {
        csvData = data.rules.map((rule: Rule) => ({
          'Rule Name': rule.name,
          'Description': rule.description,
          'Action': rule.action,
          'Adjustment': rule.adjustment,
          'Status': rule.isActive ? 'Active' : 'Inactive',
          'Priority': rule.priority
        }));
      }
      break;
      
    // Handle other report types similarly...
    
    default:
      csvData = [{ 'Error': 'Unsupported report type' }];
  }
  
  // Add executive summary if requested
  if (options.includeExecutiveSummary) {
    csvData.unshift({ 'Executive Summary': data.executiveSummary });
    csvData.unshift({}); // Empty row as separator
  }
  
  // Add recommendations if requested
  if (options.includeRecommendations && data.recommendations) {
    csvData.push({}); // Empty row as separator
    csvData.push({ 'Recommendations': 'Based on this data, we recommend:' });
    data.recommendations.forEach((rec: string, index: number) => {
      csvData.push({ [index + 1]: rec });
    });
  }
  
  // Add glossary if requested
  if (options.includeGlossary && data.glossary) {
    csvData.push({}); // Empty row as separator
    csvData.push({ 'Glossary': 'Key terms and definitions:' });
    
    for (const [term, definition] of Object.entries(data.glossary)) {
      csvData.push({ 'Term': term, 'Definition': definition });
    }
  }
  
  // Convert to CSV string
  return Papa.unparse(csvData);
};

// Convert data to Excel format
const exportToExcel = (data: any, options: ExportOptions): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  
  // Process data based on report type
  switch (options.reportType) {
    case 'campaign-performance':
      if (data.campaigns) {
        const worksheetData = data.campaigns.map((campaign: Campaign) => ({
          'Campaign Name': campaign.name,
          'Status': campaign.status,
          'Budget': campaign.budget,
          'Spend': campaign.metrics?.spend || 0,
          'Sales': campaign.metrics?.sales || 0,
          'ACoS (%)': campaign.metrics?.acos || 0,
          'ROAS': campaign.metrics?.roas || 0,
          'Impressions': campaign.metrics?.impressions || 0,
          'Clicks': campaign.metrics?.clicks || 0,
          'CTR (%)': campaign.metrics?.ctr || 0,
          'Start Date': campaign.startDate,
          'End Date': campaign.endDate || 'Ongoing'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Performance');
      }
      break;
      
    case 'rule-analysis':
      if (data.rules) {
        const worksheetData = data.rules.map((rule: Rule) => ({
          'Rule Name': rule.name,
          'Description': rule.description,
          'Action': rule.action,
          'Adjustment': rule.adjustment,
          'Status': rule.isActive ? 'Active' : 'Inactive',
          'Priority': rule.priority
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rule Analysis');
      }
      break;
      
    // Add sheets for other report types similarly...
  }
  
  // Add executive summary if requested
  if (options.includeExecutiveSummary) {
    const summaryData = [
      ['Executive Summary'],
      [data.executiveSummary],
      ['Report Type', options.reportType],
      ['Date Generated', new Date().toLocaleString()],
      ['Date Range', options.dateRange ? `${formatDate(options.dateRange.startDate)} to ${formatDate(options.dateRange.endDate)}` : 'All Time']
    ];
    
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
  }
  
  // Add recommendations if requested
  if (options.includeRecommendations && data.recommendations) {
    const recommendationsData = [
      ['Recommendations'],
      ['Based on this data, we recommend:'],
      ['']
    ];
    
    data.recommendations.forEach((rec: string) => {
      recommendationsData.push([rec]);
    });
    
    const recommendationsWorksheet = XLSX.utils.aoa_to_sheet(recommendationsData);
    XLSX.utils.book_append_sheet(workbook, recommendationsWorksheet, 'Recommendations');
  }
  
  // Add glossary if requested
  if (options.includeGlossary && data.glossary) {
    const glossaryData = [['Term', 'Definition']];
    
    for (const [term, definition] of Object.entries(data.glossary)) {
      glossaryData.push([term, definition]);
    }
    
    const glossaryWorksheet = XLSX.utils.aoa_to_sheet(glossaryData);
    XLSX.utils.book_append_sheet(workbook, glossaryWorksheet, 'Glossary');
  }
  
  return workbook;
};

// Convert data to PDF format
const exportToPdf = (data: any, options: ExportOptions): jsPDF => {
  const pdf = new jsPDF();
  
  // Add title
  const title = options.customTitle || `${options.reportType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report`;
  pdf.setFontSize(18);
  pdf.text(title, 105, 15, { align: 'center' });
  
  // Add date and branding
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 25);
  
  if (options.includeBranding) {
    pdf.setFontSize(10);
    pdf.text('Ecom Hawks - Amazon PPC Optimizer', 195, 25, { align: 'right' });
  }
  
  let yPosition = 35;
  
  // Add executive summary
  if (options.includeExecutiveSummary && data.executiveSummary) {
    pdf.setFontSize(14);
    pdf.text('Executive Summary', 20, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    const splitSummary = pdf.splitTextToSize(data.executiveSummary, 170);
    pdf.text(splitSummary, 20, yPosition);
    
    yPosition += splitSummary.length * 6 + 10;
  }
  
  // Add table data based on report type
  switch (options.reportType) {
    case 'campaign-performance':
      if (data.campaigns) {
        const tableData = data.campaigns.map((campaign: Campaign) => [
          campaign.name,
          campaign.status,
          campaign.budget,
          campaign.metrics?.spend || 0,
          campaign.metrics?.sales || 0,
          campaign.metrics?.acos || 0,
          campaign.metrics?.roas || 0,
          campaign.metrics?.impressions || 0,
          campaign.metrics?.clicks || 0,
          campaign.metrics?.ctr || 0
        ]);
        
        pdf.setFontSize(14);
        pdf.text('Campaign Performance', 20, yPosition);
        yPosition += 8;
        
        (pdf as any).autoTable({
          startY: yPosition,
          head: [['Name', 'Status', 'Budget', 'Spend', 'Sales', 'ACoS', 'ROAS', 'Impressions', 'Clicks', 'CTR']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [231, 76, 60] }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }
      break;
      
    case 'rule-analysis':
      if (data.rules) {
        const tableData = data.rules.map((rule: Rule) => [
          rule.name,
          rule.description,
          rule.action,
          rule.adjustment,
          rule.isActive ? 'Active' : 'Inactive',
          rule.priority
        ]);
        
        pdf.setFontSize(14);
        pdf.text('Rule Analysis', 20, yPosition);
        yPosition += 8;
        
        (pdf as any).autoTable({
          startY: yPosition,
          head: [['Name', 'Description', 'Action', 'Adjustment', 'Status', 'Priority']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [231, 76, 60] }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }
      break;
      
    // Handle other report types similarly...
  }
  
  // Add recommendations
  if (options.includeRecommendations && data.recommendations) {
    pdf.setFontSize(14);
    pdf.text('Recommendations', 20, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    
    data.recommendations.forEach((rec: string) => {
      const splitRec = pdf.splitTextToSize(`• ${rec}`, 170);
      pdf.text(splitRec, 20, yPosition);
      yPosition += splitRec.length * 6 + 5;
    });
    
    yPosition += 10;
  }
  
  // Add glossary
  if (options.includeGlossary && data.glossary) {
    // Check if we need a new page
    if (yPosition > 240) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.text('Glossary of Terms', 20, yPosition);
    yPosition += 8;
    
    const glossaryData = Object.entries(data.glossary).map(([term, definition]) => 
      [term, definition]);
    
    (pdf as any).autoTable({
      startY: yPosition,
      head: [['Term', 'Definition']],
      body: glossaryData,
      theme: 'plain',
      headStyles: { fillColor: [231, 76, 60] }
    });
  }
  
  // Add page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }
  
  return pdf;
};

// Main export function
export const exportData = async (
  data: ExportData,
  options: ExportOptions
): Promise<void> => {
  let processedData = { ...data };
  
  // Add additional elements if requested
  if (options.includeExecutiveSummary) {
    processedData = addExecutiveSummary(processedData, options.reportType);
  }
  
  if (options.includeGlossary) {
    processedData = addGlossary(processedData);
  }
  
  if (options.includeRecommendations) {
    processedData = addRecommendations(processedData, options.reportType);
  }
  
  // Generate the export based on the requested format
  const filename = generateFilename(options);
  
  switch (options.format) {
    case 'csv':
      const csvContent = exportToCsv(processedData, options);
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, filename);
      break;
      
    case 'xlsx':
      const workbook = exportToExcel(processedData, options);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, filename);
      break;
      
    case 'pdf':
      const pdf = exportToPdf(processedData, options);
      pdf.save(filename);
      break;
      
    case 'json':
      const jsonBlob = new Blob([JSON.stringify(processedData, null, 2)], { type: 'application/json' });
      saveAs(jsonBlob, filename);
      break;
      
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

export type { ExportFormat, ReportType, DateRange, ExportOptions, ExportData };