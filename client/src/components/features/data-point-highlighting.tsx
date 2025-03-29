import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, TrendingUp, TrendingDown, AlertCircle, Target, Flag } from 'lucide-react';

// Define an interface for campaign data points
interface CampaignDataPoint {
  day: string;
  acos: number;
  roas: number;
  cpc: number;
  conversion: number;
  [key: string]: string | number; // Index signature to allow string indexing
}

export default function DataPointHighlighting() {
  const [expandedView, setExpandedView] = useState(false);
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('acos');
  
  // Sample campaign performance data
  const data: CampaignDataPoint[] = [
    { day: 'Mar 01', acos: 35.2, roas: 1.8, cpc: 0.72, conversion: 2.1 },
    { day: 'Mar 02', acos: 32.8, roas: 2.0, cpc: 0.68, conversion: 2.3 },
    { day: 'Mar 03', acos: 30.5, roas: 2.2, cpc: 0.65, conversion: 2.5 },
    { day: 'Mar 04', acos: 33.1, roas: 2.1, cpc: 0.70, conversion: 2.2 },
    { day: 'Mar 05', acos: 29.7, roas: 2.4, cpc: 0.63, conversion: 2.7 },
    { day: 'Mar 06', acos: 27.2, roas: 2.6, cpc: 0.61, conversion: 2.9 },
    { day: 'Mar 07', acos: 24.8, roas: 2.8, cpc: 0.58, conversion: 3.2 },
    { day: 'Mar 08', acos: 22.5, roas: 3.1, cpc: 0.55, conversion: 3.5 },
    { day: 'Mar 09', acos: 20.3, roas: 3.4, cpc: 0.53, conversion: 3.8 },
    { day: 'Mar 10', acos: 18.7, roas: 3.7, cpc: 0.51, conversion: 4.1 },
    { day: 'Mar 11', acos: 17.9, roas: 3.9, cpc: 0.50, conversion: 4.2 },
    { day: 'Mar 12', acos: 16.5, roas: 4.2, cpc: 0.48, conversion: 4.5 },
    { day: 'Mar 13', acos: 15.8, roas: 4.4, cpc: 0.47, conversion: 4.7 },
    { day: 'Mar 14', acos: 15.2, roas: 4.6, cpc: 0.46, conversion: 4.9 },
  ];
  
  const metricConfig = {
    acos: {
      color: '#ff9800',
      targetValue: 20,
      unit: '%',
      trendGood: 'down',
      anomalies: [4], // index of days with anomalies
      format: (value: number) => `${value.toFixed(1)}%`,
      yAxisDomain: [10, 40]
    },
    roas: {
      color: '#2196f3',
      targetValue: 3.5,
      unit: 'x',
      trendGood: 'up',
      anomalies: [3], // index of days with anomalies
      format: (value: number) => `${value.toFixed(1)}x`,
      yAxisDomain: [1, 5]
    },
    cpc: {
      color: '#4caf50',
      targetValue: 0.55,
      unit: '$',
      trendGood: 'down',
      anomalies: [9], // index of days with anomalies
      format: (value: number) => `$${value.toFixed(2)}`,
      yAxisDomain: [0.4, 0.8]
    },
    conversion: {
      color: '#9c27b0',
      targetValue: 3.5,
      unit: '%',
      trendGood: 'up',
      anomalies: [7], // index of days with anomalies
      format: (value: number) => `${value.toFixed(1)}%`,
      yAxisDomain: [1, 5]
    }
  };
  
  const currentConfig = metricConfig[activeTab as keyof typeof metricConfig];
  
  const handleMouseMove = (state: any) => {
    if (state.activeTooltipIndex !== undefined) {
      setHighlightedPoint(state.activeTooltipIndex);
    }
  };
  
  const handleMouseLeave = () => {
    setHighlightedPoint(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Data Point Highlighting</CardTitle>
            <CardDescription>
              Interactive visualizations with focus on key metrics and anomalies
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={expandedView ? "h-96" : "h-72"}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="acos">ACoS</TabsTrigger>
            <TabsTrigger value="roas">ROAS</TabsTrigger>
            <TabsTrigger value="cpc">CPC</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>
          
          <div className="rounded-lg border p-2 mb-4 bg-black/20">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span>Normal</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentConfig.color }}></div>
                <span>Highlighted</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Anomaly</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 border-t border-dashed border-green-500"></div>
                <span>Target</span>
              </div>
            </div>
          </div>
          
          {Object.keys(metricConfig).map((metric) => (
            <TabsContent key={metric} value={metric} className="mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis 
                    domain={metricConfig[metric as keyof typeof metricConfig].yAxisDomain}
                    tickFormatter={(value) => metricConfig[metric as keyof typeof metricConfig].format(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      metricConfig[metric as keyof typeof metricConfig].format(value as number),
                      metric.toUpperCase()
                    ]}
                  />
                  
                  {/* Reference line for target value */}
                  <ReferenceLine 
                    y={metricConfig[metric as keyof typeof metricConfig].targetValue} 
                    stroke="#22c55e" 
                    strokeDasharray="3 3"
                    label={{
                      position: 'right',
                      value: 'Target',
                      fill: '#22c55e',
                      fontSize: 12
                    }}
                  />
                  
                  {/* Main data line */}
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={metricConfig[metric as keyof typeof metricConfig].color}
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, index } = props;
                      const isHighlighted = index === highlightedPoint;
                      const isAnomaly = metricConfig[metric as keyof typeof metricConfig].anomalies.includes(index);
                      
                      return (
                        <svg x={cx - 5} y={cy - 5} width={10} height={10}>
                          <motion.circle
                            cx={5}
                            cy={5}
                            r={isHighlighted ? 5 : 3}
                            fill={isAnomaly ? '#ef4444' : (isHighlighted ? metricConfig[metric as keyof typeof metricConfig].color : '#999')}
                            initial={{ scale: 1 }}
                            animate={{ scale: isHighlighted ? 1.5 : 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        </svg>
                      );
                    }}
                    activeDot={(props: any) => {
                      const { cx, cy, index } = props;
                      const isAnomaly = metricConfig[metric as keyof typeof metricConfig].anomalies.includes(index);
                      
                      return (
                        <g>
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={8} 
                            fill={isAnomaly ? '#ef4444' : metricConfig[metric as keyof typeof metricConfig].color} 
                            opacity={0.2} 
                          />
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={4} 
                            fill={isAnomaly ? '#ef4444' : metricConfig[metric as keyof typeof metricConfig].color} 
                          />
                        </g>
                      );
                    }}
                  />
                  
                  {/* Highlight anomalies with reference dots */}
                  {metricConfig[metric as keyof typeof metricConfig].anomalies.map((dayIndex) => (
                    <ReferenceDot
                      key={dayIndex}
                      x={data[dayIndex].day}
                      y={data[dayIndex][metric as keyof typeof data[0]]}
                      r={6}
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="2 2"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
        
        {highlightedPoint !== null && (
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-black border border-gray-700 p-2 flex items-center gap-2">
              {metricConfig[activeTab as keyof typeof metricConfig].anomalies.includes(highlightedPoint) ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : data[highlightedPoint] && 
                  ((metricConfig[activeTab as keyof typeof metricConfig].trendGood === 'down' && 
                    Number(data[highlightedPoint][activeTab]) < metricConfig[activeTab as keyof typeof metricConfig].targetValue) || 
                   (metricConfig[activeTab as keyof typeof metricConfig].trendGood === 'up' && 
                    Number(data[highlightedPoint][activeTab]) > metricConfig[activeTab as keyof typeof metricConfig].targetValue)) ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <Flag className="h-4 w-4 text-orange-500" />
              )}
              <span>
                {metricConfig[activeTab as keyof typeof metricConfig].anomalies.includes(highlightedPoint) 
                  ? 'Anomaly Detected' 
                  : 'Data Point'}
              </span>
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}