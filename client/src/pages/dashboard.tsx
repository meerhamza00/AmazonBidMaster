import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Campaign } from "@shared/schema";
import CsvUpload from "@/components/csv-upload";
import KPICard from "@/components/kpi-card";
import PerformanceChart from "@/components/performance-chart";
import CampaignTable from "@/components/campaign-table";
import CampaignForecast from "@/components/campaign-forecast";
import { DashboardFilters } from '@/components/dashboard-filters';
import { DashboardLayoutManager, WidgetConfig } from '@/components/dashboard-layout-manager';
import { DashboardViewManager, DashboardView } from '@/components/dashboard-view-manager';
import { v4 as uuidv4 } from 'uuid';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Activity, 
  ArrowUpRight,
  BarChart, 
  MousePointer, 
  Target,
  RefreshCw,
  LineChart,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type CampaignMetrics = {
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
};

// Default dashboard widgets configuration
const defaultWidgets: WidgetConfig[] = [
  {
    id: 'spend-chart',
    type: 'performance-chart',
    title: 'Spend Overview',
    visible: true,
    props: { metric: 'spend' }
  },
  {
    id: 'sales-chart',
    type: 'performance-chart',
    title: 'Sales Overview',
    visible: true,
    props: { metric: 'sales' }
  },
  {
    id: 'acos-chart',
    type: 'performance-chart',
    title: 'ACOS Overview',
    visible: true,
    props: { metric: 'acos' }
  },
  {
    id: 'roas-chart',
    type: 'performance-chart',
    title: 'ROAS Overview',
    visible: true,
    props: { metric: 'roas' }
  },
  {
    id: 'impressions-chart',
    type: 'performance-chart',
    title: 'Impressions Overview',
    visible: true,
    props: { metric: 'impressions' }
  },
  {
    id: 'clicks-chart',
    type: 'performance-chart',
    title: 'Clicks Overview',
    visible: true,
    props: { metric: 'clicks' }
  },
  {
    id: 'ctr-chart',
    type: 'performance-chart',
    title: 'CTR Overview',
    visible: false,
    props: { metric: 'ctr' }
  },
  {
    id: 'forecast-widget',
    type: 'forecast',
    title: 'Campaign Forecast',
    visible: true,
    props: { campaignId: 'campaign-1' }
  }
];

// Default filters
const defaultFilters = {
  dateRange: '30d',
  campaignType: 'all',
  minSpend: 0,
  maxSpend: 10000,
  minAcos: 0,
  maxAcos: 100,
  minRoas: 0,
  maxRoas: 20,
  showPaused: true,
};

export default function Dashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [forecastCampaign, setForecastCampaign] = useState<Campaign | null>(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentView, setCurrentView] = useState<DashboardView>({
    id: 'default',
    name: 'Default View',
    layout: defaultWidgets,
    filters: defaultFilters,
    isDefault: true
  });
  
  const { data: campaigns = [], isLoading: isLoadingCampaigns, refetch } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });
  
  // Fetch performance data based on filters
  const { data: performanceData = [], isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performance-data', filters],
    // This would be replaced with your actual API call
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate random data with some trends
        const spend = 100 + Math.random() * 900;
        const sales = spend * (0.8 + Math.random() * 1.2);
        const impressions = 1000 + Math.random() * 9000;
        const clicks = impressions * (0.01 + Math.random() * 0.09);
        
        return {
          date: dateStr,
          spend,
          sales,
          acos: (spend / sales) * 100,
          roas: sales / spend,
          impressions,
          clicks,
          ctr: (clicks / impressions) * 100
        };
      });
      
      return data;
    }
  });

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Dashboard data is being updated.",
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  // Handle view changes
  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
    setFilters(view.filters);
    setActiveTab("overview"); // Reset to overview tab when changing views
  };

  // Save current view
  const saveCurrentView = (name: string): DashboardView => {
    const newView: DashboardView = {
      id: uuidv4(),
      name,
      layout: currentView.layout,
      filters
    };
    return newView;
  };

  // Handle layout changes
  const handleLayoutChange = (layout: WidgetConfig[]) => {
    setCurrentView(prev => ({
      ...prev,
      layout
    }));
  };
  
  // Render widget based on type
  const renderWidget = (widget: WidgetConfig, index?: number) => {
    if (isLoadingCampaigns || isLoadingPerformance) {
      return (
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      );
    }

    switch (widget.type) {
      case 'performance-chart':
        return (
          <PerformanceChart 
            data={performanceData || []} 
            metric={widget.props?.metric || 'spend'} 
            title={widget.title} 
          />
        );
      case 'forecast':
        if (!forecastCampaign) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Forecast</CardTitle>
                <CardDescription>Select a campaign to view forecast</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No campaign selected</p>
              </CardContent>
            </Card>
          );
        }
        return <CampaignForecast campaign={forecastCampaign} daysAhead={30} />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Widget type not implemented
              </div>
            </CardContent>
          </Card>
        );
    }
  };
  
  // Check if we're accessing via a hash link
  const checkHashLink = () => {
    if (window.location.hash === '#features') {
      setActiveTab('features');
    }
  };
  
  // Add event listener for hash changes
  // This hook runs when the component mounts
  useEffect(() => {
    checkHashLink(); // Check on initial load
    window.addEventListener('hashchange', checkHashLink);
    
    // Cleanup function when component unmounts
    return () => {
      window.removeEventListener('hashchange', checkHashLink);
    };
  }, []);

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

  const acos = totalMetrics.sales > 0 ? (totalMetrics.spend / totalMetrics.sales) * 100 : 0;
  const roas = totalMetrics.spend > 0 ? totalMetrics.sales / totalMetrics.spend : 0;
  const ctr = totalMetrics.impressions > 0 ? (totalMetrics.clicks / totalMetrics.impressions) * 100 : 0;

  // Generate chart data from the campaigns
  const campaignPerformanceData = campaigns.map(campaign => ({
    date: campaign.name, // Using campaign name as date for now
    spend: (campaign.metrics as CampaignMetrics).spend,
    sales: (campaign.metrics as CampaignMetrics).sales,
    acos: (campaign.metrics as CampaignMetrics).acos,
    roas: (campaign.metrics as CampaignMetrics).roas,
    impressions: (campaign.metrics as CampaignMetrics).impressions,
    clicks: (campaign.metrics as CampaignMetrics).clicks,
    ctr: (campaign.metrics as CampaignMetrics).ctr
  }));

  // Set default forecast campaign when campaigns load
  if (campaigns.length > 0 && !forecastCampaign) {
    setForecastCampaign(campaigns[0]);
  }

  // Handle showing campaign forecast
  const showCampaignForecast = (campaign: Campaign) => {
    setForecastCampaign(campaign);
    setActiveTab("forecast");
    
    // Scroll to forecast section
    setTimeout(() => {
      document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Loading skeleton
  if (isLoadingCampaigns || isLoadingPerformance) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-40" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
        
        <Skeleton className="h-96 mt-8 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Amazon PPC Dashboard</h1>
          <p className="text-muted-foreground">Optimize your campaign performance and increase ROI</p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardViewManager
            currentView={currentView}
            onViewChange={handleViewChange}
            onSaveCurrentView={saveCurrentView}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh dashboard data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <DashboardFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {campaigns.length === 0 ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to Amazon PPC Optimizer</CardTitle>
            <CardDescription>
              Get started by uploading your campaign data to visualize performance and optimize your bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CsvUpload />
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="custom">Custom Dashboard</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="forecast" id="forecast-tab">Forecast</TabsTrigger>
              <TabsTrigger value="features">Advanced Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custom" className="space-y-6">
              <DashboardLayoutManager
                defaultLayout={currentView.layout}
                renderWidget={renderWidget}
                onLayoutChange={handleLayoutChange}
              />
            </TabsContent>
            
            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <KPICard
                  title="Total Ad Spend"
                  value={`$${totalMetrics.spend.toFixed(2)}`}
                  icon={<DollarSign className="h-5 w-5" />}
                  trend="up"
                  change="+5.2% vs last week"
                />
                <KPICard
                  title="Total Sales"
                  value={`$${totalMetrics.sales.toFixed(2)}`}
                  icon={<TrendingUp className="h-5 w-5" />}
                  trend="up"
                  change="+8.1% vs last week"
                />
                <KPICard
                  title="ACOS"
                  value={`${acos.toFixed(2)}%`}
                  icon={<BarChart className="h-5 w-5" />}
                  trend={acos < 25 ? "down" : "up"}
                  change={acos < 25 ? "-2.3% vs target" : "+2.3% vs target"}
                />
                <KPICard
                  title="ROAS"
                  value={`${roas.toFixed(2)}x`}
                  icon={<ArrowUpRight className="h-5 w-5" />}
                  trend={roas > 3 ? "up" : "down"}
                  change={roas > 3 ? "+0.5x vs target" : "-0.5x vs target"}
                />
              </div>
              
              {/* Secondary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <KPICard
                  title="Impressions"
                  value={totalMetrics.impressions.toLocaleString()}
                  icon={<Users className="h-5 w-5" />}
                  trend="up"
                  change="+12.4% vs last week"
                />
                <KPICard
                  title="Clicks"
                  value={totalMetrics.clicks.toLocaleString()}
                  icon={<MousePointer className="h-5 w-5" />}
                  trend="up"
                  change="+7.8% vs last week"
                />
                <KPICard
                  title="CTR"
                  value={`${ctr.toFixed(2)}%`}
                  icon={<Target className="h-5 w-5" />}
                  trend={ctr > 1 ? "up" : "down"}
                  change={ctr > 1 ? "+0.3% vs target" : "-0.3% vs target"}
                />
              </div>
              
              {/* Key Performance Charts */}
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <PerformanceChart
                  data={performanceData}
                  metric="spend"
                  title="Campaign Spend"
                />
                <PerformanceChart
                  data={performanceData}
                  metric="sales"
                  title="Campaign Sales"
                />
                <PerformanceChart
                  data={performanceData}
                  metric="acos"
                  title="Campaign ACOS"
                />
              </div>
              
              {/* Campaign Table with Action Button */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold">Campaign Performance</CardTitle>
                    <CardDescription>
                      View and analyze all your campaign metrics
                    </CardDescription>
                  </div>
                  <Badge className="bg-orange-500">
                    {campaigns.length} Campaigns
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CampaignTable campaigns={campaigns} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Metrics</CardTitle>
                  <CardDescription>
                    Analyze all key performance indicators across your campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <PerformanceChart
                      data={performanceData}
                      metric="spend"
                      title="Campaign Spend"
                    />
                    <PerformanceChart
                      data={performanceData}
                      metric="sales"
                      title="Campaign Sales"
                    />
                    <PerformanceChart
                      data={performanceData}
                      metric="acos"
                      title="Campaign ACOS"
                    />
                    <PerformanceChart
                      data={performanceData}
                      metric="roas"
                      title="Campaign ROAS"
                    />
                    <PerformanceChart
                      data={performanceData}
                      metric="impressions"
                      title="Campaign Impressions"
                    />
                    <PerformanceChart
                      data={performanceData}
                      metric="clicks"
                      title="Campaign Clicks"
                    />
                    {/* We added CTR metric to the performance chart component */}
                    <PerformanceChart
                      data={performanceData}
                      metric="ctr"
                      title="Campaign CTR"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="forecast" className="space-y-6" id="forecast-section">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle>Campaign Forecast Analysis</CardTitle>
                      <CardDescription>
                        30-day prediction with confidence intervals
                      </CardDescription>
                    </div>
                    {forecastCampaign && (
                      <Badge variant="outline" className="mt-2 sm:mt-0 border-orange-500 text-orange-500">
                        {forecastCampaign.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {forecastCampaign ? (
                    <CampaignForecast campaign={forecastCampaign} daysAhead={30} />
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">Select a campaign to view forecast</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Forecasts are based on historical performance and market trends
                  </p>
                  {campaigns.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("overview")}>
                      View All Campaigns <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced PPC Management Features</CardTitle>
                  <CardDescription>
                    Unlock powerful capabilities to take your campaign optimization to the next level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Advanced Feature Cards */}
                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The conversational AI coach feature will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Conversational AI coach for marketing strategy</h3>
                        <p className="text-sm text-muted-foreground">Get personalized guidance and recommendations through an interactive chat interface</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The one-click export feature will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">One-click export of campaign insights to presentation slides</h3>
                        <p className="text-sm text-muted-foreground">Quickly generate professional presentations with your most important metrics and findings</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The competitor keyword tracking heatmap will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Real-time competitor keyword tracking heatmap</h3>
                        <p className="text-sm text-muted-foreground">Visualize keyword competition intensity and identify untapped opportunities</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The gamified learning path will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Gamified learning path for PPC optimization techniques</h3>
                        <p className="text-sm text-muted-foreground">Master Amazon PPC strategies through interactive exercises and achieve certifications</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The interactive campaign mood board will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Interactive campaign mood board with drag-and-drop widgets</h3>
                        <p className="text-sm text-muted-foreground">Customize your dashboard with the metrics and visualizations most important to you</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-6 justify-start text-left bg-background hover:bg-background/90 border-2 border-border"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The Amazon Advertising API integration will be available in the next update.",
                        });
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Integration with Amazon Advertising API</h3>
                        <p className="text-sm text-muted-foreground">Connect directly to your Amazon Advertising account for real-time data and automated bid adjustments</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    These advanced features are under development and will be rolled out in upcoming releases
                  </p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Rule Customization Interface</CardTitle>
                  <CardDescription>
                    Create sophisticated optimization rules with our intuitive visual builder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full h-auto p-8 justify-center bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      // Navigate to the rules page
                      window.location.href = '/rules';
                    }}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Open Rule Builder</h3>
                      <p className="text-sm">Create and manage sophisticated bid adjustment rules based on campaign performance metrics</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}