import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Target, 
  MousePointer, 
  Clipboard, 
  BarChart2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function MarketingTooltips() {
  const [demoMode, setDemoMode] = useState(false);
  
  const marketingTips = [
    {
      id: 'acos',
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
      title: 'ACoS Optimization',
      description: 'Reduce ACoS by targeting high-converting keywords and removing low-performers',
      tip: 'Pro Tip: For established products, aim for ACoS 15-20% below your profit margin. For new products, allow higher ACoS (30-40%) to build visibility.',
      metric: '24.3%',
      trend: 'down',
      trendValue: '3.2%'
    },
    {
      id: 'ctr',
      icon: <MousePointer className="h-5 w-5 text-orange-500" />,
      title: 'Click-Through Rate',
      description: 'Improve your ad creative and targeting to boost CTR',
      tip: 'Pro Tip: A/B test your main product image and try different headline formats. Including specific numbers or benefits can increase CTR by up to 30%.',
      metric: '0.48%',
      trend: 'up',
      trendValue: '0.12%'
    },
    {
      id: 'targeting',
      icon: <Target className="h-5 w-5 text-orange-500" />,
      title: 'Audience Targeting',
      description: 'Focus on the most relevant audience segments for your products',
      tip: 'Pro Tip: Create separate campaigns for branded vs. non-branded keywords. Branded terms typically convert 3-5x better and deserve separate bidding strategies.',
      metric: '82%',
      trend: 'up',
      trendValue: '7%'
    },
    {
      id: 'bidding',
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      title: 'Dynamic Bidding',
      description: 'Adjust bids based on performance data and competition',
      tip: 'Pro Tip: Use "Down Only" bidding for exploratory campaigns and "Up and Down" for proven performers. This can reduce wasted ad spend by up to 20%.',
      metric: '$1.45',
      trend: 'up',
      trendValue: '$0.25'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Interactive Tooltips with Marketing Wisdom
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Hover over cards to reveal expert PPC marketing tips</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Contextual marketing insights that appear when you interact with key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {marketingTips.map((tip) => (
            <HoverCard key={tip.id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-orange-500 transition-all duration-300 cursor-help">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {tip.icon}
                      <h3 className="font-medium">{tip.title}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">{tip.metric}</span>
                      <span className={`ml-1 text-xs ${tip.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {tip.trend === 'up' ? '↑' : '↓'} {tip.trendValue}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{tip.description}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-black border border-orange-500">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <h4 className="text-sm font-semibold">Expert Insight</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tip.tip}
                    </p>
                    <div className="pt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <BarChart2 className="mr-1 h-3 w-3" />
                        <span>Industry benchmark: {tip.id === 'acos' ? '18.5%' : 
                                            tip.id === 'ctr' ? '0.4%' : 
                                            tip.id === 'targeting' ? '75%' : '$1.20'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        
        <div className="mt-4 p-3 border border-dashed border-orange-500 rounded-md bg-gray-900/50">
          <div className="flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Usage Tip:</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Hover over any metric card to reveal expert marketing advice specific to that KPI. 
            These contextual tips are designed to help optimize your campaigns based on industry best practices.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}