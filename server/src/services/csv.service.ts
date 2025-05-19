import { CsvRow, InsertCampaign } from "@shared/schema";

export const csvService = {
  /**
   * Parse CSV content into an array of objects
   */
  parseCSV(fileContent: string): CsvRow[] {
    return fileContent.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string, index: number) => {
        try {
          const values = line.split(',').map((val: string) => val.trim());
          
          // Skip header row if present
          if (index === 0 && isNaN(parseFloat(values[3]))) {
            return null;
          }

          const [
            campaignName, portfolioName, campaignState, bid, 
            adGroupDefaultBid, spend, sales, orders, 
            clicks, roas, impressions
          ] = values;

          // Convert and validate numeric values
          const parsedBid = parseFloat(bid) || 0;
          const parsedAdGroupBid = parseFloat(adGroupDefaultBid) || 0;
          const parsedSpend = parseFloat(spend) || 0;
          const parsedSales = parseFloat(sales) || 0;
          const parsedOrders = parseInt(orders) || 0;
          const parsedClicks = parseInt(clicks) || 0;
          const parsedRoas = parseFloat(roas) || 0;
          const parsedImpressions = parseInt(impressions) || 0;

          return {
            campaignName: campaignName || '',
            portfolioName: portfolioName || '',
            campaignState: campaignState || '',
            bid: parsedBid,
            adGroupDefaultBid: parsedAdGroupBid,
            spend: parsedSpend,
            sales: parsedSales,
            orders: parsedOrders,
            clicks: parsedClicks,
            roas: parsedRoas,
            impressions: parsedImpressions
          };
        } catch (error) {
          console.error(`Error parsing row ${index + 1}:`, error);
          return null;
        }
      })
      .filter((row: any) => row !== null) as CsvRow[];
  },

  /**
   * Transform CSV rows into campaign objects
   */
  transformToCampaigns(rows: CsvRow[]): InsertCampaign[] {
    return rows.map(row => {
      // Calculate CTR from clicks and impressions
      const ctr = row.clicks > 0 ? (row.clicks / row.impressions) : 0;
      // Calculate ACOS from spend and sales
      const acos = row.sales > 0 ? (row.spend / row.sales) * 100 : 0;
      // Calculate CPC from spend and clicks
      const cpc = row.clicks > 0 ? row.spend / row.clicks : 0;

      return {
        name: row.campaignName,
        budget: row.bid.toString(), // Use bid as budget
        status: row.campaignState,
        metrics: {
          spend: row.spend,
          sales: row.sales,
          acos: acos,
          roas: row.roas,
          impressions: row.impressions,
          clicks: row.clicks,
          ctr: ctr,
          cpc: cpc,
          orders: row.orders
        }
      };
    });
  }
};