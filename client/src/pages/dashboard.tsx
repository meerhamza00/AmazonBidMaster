import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import CsvUpload from "@/components/csv-upload";
import KPICard from "@/components/kpi-card";
import PerformanceChart from "@/components/performance-chart";
import CampaignTable from "@/components/campaign-table";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";

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

  // Mock data for the performance chart
  const chartData = [
    { date: "2024-01", spend: 1200, sales: 3600, acos: 33.33 },
    { date: "2024-02", spend: 1500, sales: 4500, acos: 33.33 },
    { date: "2024-03", spend: 1800, sales: 5400, acos: 33.33 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <CsvUpload />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceChart
          data={chartData}
          metric="spend"
          title="Spend Over Time"
        />
        <PerformanceChart
          data={chartData}
          metric="acos"
          title="ACOS Over Time"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Campaign Performance</h2>
        <CampaignTable campaigns={campaigns} />
      </div>
    </div>
  );
}