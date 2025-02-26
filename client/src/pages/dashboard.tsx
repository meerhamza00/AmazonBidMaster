import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import CsvUpload from "@/components/csv-upload";
import KPICard from "@/components/kpi-card";
import PerformanceChart from "@/components/performance-chart";
import CampaignTable from "@/components/campaign-table";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle"; // Added import

type CampaignMetrics = {
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
};

export default function Dashboard() {
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Calculate total metrics
  const totalMetrics = campaigns.reduce(
    (acc, campaign) => ({
      spend: acc.spend + (campaign.metrics as CampaignMetrics).spend,
      sales: acc.sales + (campaign.metrics as CampaignMetrics).sales,
      impressions: acc.impressions + (campaign.metrics as CampaignMetrics).impressions,
      clicks: acc.clicks + (campaign.metrics as CampaignMetrics).clicks,
    }),
    { spend: 0, sales: 0, impressions: 0, clicks: 0 }
  );

  const acos = (totalMetrics.spend / totalMetrics.sales) * 100;

  // Generate chart data from the campaigns
  const performanceData = campaigns.map(campaign => ({
    date: campaign.name, // Using campaign name as date for now
    spend: (campaign.metrics as CampaignMetrics).spend,
    sales: (campaign.metrics as CampaignMetrics).sales,
    acos: (campaign.metrics as CampaignMetrics).acos,
    roas: (campaign.metrics as CampaignMetrics).roas,
    impressions: (campaign.metrics as CampaignMetrics).impressions,
    clicks: (campaign.metrics as CampaignMetrics).clicks
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ThemeToggle />
      </div>
      <CsvUpload />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Spend"
          value={`$${totalMetrics.spend.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Total Sales"
          value={`$${totalMetrics.sales.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="ACOS"
          value={`${acos.toFixed(2)}%`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Impressions"
          value={totalMetrics.impressions.toLocaleString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <PerformanceChart
          data={performanceData}
          metric="spend"
          title="Spend Over Time"
        />
        <PerformanceChart
          data={performanceData}
          metric="sales"
          title="Sales Over Time"
        />
        <PerformanceChart
          data={performanceData}
          metric="acos"
          title="ACOS Over Time"
        />
        <PerformanceChart
          data={performanceData}
          metric="roas"
          title="ROAS Over Time"
        />
        <PerformanceChart
          data={performanceData}
          metric="impressions"
          title="Impressions Over Time"
        />
        <PerformanceChart
          data={performanceData}
          metric="clicks"
          title="Clicks Over Time"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Campaign Performance</h2>
        <CampaignTable campaigns={campaigns} />
      </div>
    </div>
  );
}