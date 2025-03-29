import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GradientVisualization() {
  const [metricType, setMetricType] = useState('acos');
  
  const data = [
    { date: 'Mar 01', acos: 28, roas: 2.1, ctr: 1.2 },
    { date: 'Mar 05', acos: 25, roas: 2.3, ctr: 1.3 },
    { date: 'Mar 10', acos: 20, roas: 2.6, ctr: 1.5 },
    { date: 'Mar 15', acos: 22, roas: 2.5, ctr: 1.4 },
    { date: 'Mar 20', acos: 18, roas: 3.1, ctr: 1.6 },
    { date: 'Mar 25', acos: 15, roas: 3.5, ctr: 1.7 },
    { date: 'Mar 30', acos: 12, roas: 4.0, ctr: 1.9 },
  ];
  
  // Determine gradient color based on metric
  const getGradient = () => {
    switch (metricType) {
      case 'acos':
        return {
          min: '#4caf50', // Green for low ACoS (good)
          mid: '#ff9800', // Orange for mid ACoS
          max: '#f44336'  // Red for high ACoS (bad)
        };
      case 'roas':
        return {
          min: '#f44336', // Red for low ROAS (bad)
          mid: '#ff9800', // Orange for mid ROAS
          max: '#4caf50'  // Green for high ROAS (good)
        };
      case 'ctr':
        return {
          min: '#f44336', // Red for low CTR (bad)
          mid: '#ff9800', // Orange for mid CTR
          max: '#4caf50'  // Green for high CTR (good)
        };
      default:
        return {
          min: '#f44336',
          mid: '#ff9800',
          max: '#4caf50'
        };
    }
  };
  
  const { min, mid, max } = getGradient();
  
  // Performance indicators based on metric type
  const getPerformanceZones = () => {
    switch (metricType) {
      case 'acos':
        return {
          great: 'ACoS < 15%',
          good: 'ACoS 15-20%',
          average: 'ACoS 20-25%',
          poor: 'ACoS > 25%'
        };
      case 'roas':
        return {
          great: 'ROAS > 3.5',
          good: 'ROAS 2.5-3.5',
          average: 'ROAS 2.0-2.5',
          poor: 'ROAS < 2.0'
        };
      case 'ctr':
        return {
          great: 'CTR > 1.7%',
          good: 'CTR 1.5-1.7%',
          average: 'CTR 1.2-1.5%',
          poor: 'CTR < 1.2%'
        };
      default:
        return {
          great: '',
          good: '',
          average: '',
          poor: ''
        };
    }
  };
  
  const zones = getPerformanceZones();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Color-coded Performance Gradient Visualization</CardTitle>
        <CardDescription>
          Visualize your campaign performance trends with intuitive color gradients
        </CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Metric:</span>
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acos">ACoS</SelectItem>
              <SelectItem value="roas">ROAS</SelectItem>
              <SelectItem value="ctr">CTR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricType === 'acos' ? min : max} stopOpacity={0.8} />
                <stop offset="50%" stopColor={mid} stopOpacity={0.5} />
                <stop offset="95%" stopColor={metricType === 'acos' ? max : min} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={metricType === 'acos' ? [0, 30] : metricType === 'roas' ? [0, 5] : [0, 2.5]} 
              tickFormatter={(value) => metricType === 'acos' ? `${value}%` : value.toString()}
            />
            <Tooltip 
              formatter={(value) => [
                metricType === 'acos' ? `${value}%` : 
                metricType === 'roas' ? `${value}x` : 
                `${value}%`, 
                metricType.toUpperCase()
              ]}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={metricType} 
              stroke="#ff9800" 
              fillOpacity={1} 
              fill="url(#colorGradient)" 
              animationDuration={1000}
              name={metricType.toUpperCase()}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Performance zone legend */}
        <div className="flex justify-between mt-2 px-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: metricType === 'acos' ? min : max }}></span>
            <span className="text-xs">{zones.great}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: metricType === 'acos' ? '#8bc34a' : '#66bb6a' }}></span>
            <span className="text-xs">{zones.good}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mid }}></span>
            <span className="text-xs">{zones.average}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: metricType === 'acos' ? max : min }}></span>
            <span className="text-xs">{zones.poor}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}