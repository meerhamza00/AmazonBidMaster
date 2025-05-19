import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Define theme-specific colors
const chartColors = {
  light: {
    grid: '#e5e7eb',
    text: '#1f2937',
    tooltip: {
      background: '#ffffff',
      border: '#d1d5db',
      text: '#1f2937'
    },
    series: [
      '#ff6b00', // primary orange
      '#8b5cf6', // purple
      '#10b981', // green
      '#0369a1', // blue
      '#ef4444'  // red
    ]
  },
  dark: {
    grid: '#374151',
    text: '#f3f4f6',
    tooltip: {
      background: '#1f2937',
      border: '#4b5563',
      text: '#f3f4f6'
    },
    series: [
      '#ff8533', // brighter orange for dark mode
      '#a78bfa', // brighter purple
      '#34d399', // brighter green
      '#38bdf8', // brighter blue
      '#f87171'  // brighter red
    ]
  }
};

// Custom tooltip component that respects the current theme
const ThemedTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    const colors = chartColors[theme];
    return (
      <div 
        className="rounded-md shadow-lg p-3 text-sm"
        style={{ 
          backgroundColor: colors.tooltip.background,
          border: `1px solid ${colors.tooltip.border}`,
          color: colors.tooltip.text
        }}
      >
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-item-${index}`} className="flex items-center gap-2 my-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color || colors.series[index % colors.series.length] }}
            />
            <span className="font-medium">{entry.name}:</span>
            <span>{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ThemedChartProps {
  type: 'line' | 'bar' | 'area';
  data: any[];
  series: Array<{
    dataKey: string;
    name: string;
    color?: string;
    strokeDasharray?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepAfter' | 'stepBefore';
  }>;
  xAxisDataKey: string;
  yAxisLabel?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  stacked?: boolean;
}

export function ThemedChart({
  type,
  data,
  series,
  xAxisDataKey,
  yAxisLabel,
  height = 300,
  showGrid = true,
  showLegend = true,
  legendPosition = 'bottom',
  stacked = false
}: ThemedChartProps) {
  const { theme } = useTheme();
  const colors = chartColors[theme];

  // Common props for all chart types
  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
    height
  };

  // Common axis props
  const axisProps = {
    stroke: colors.text,
    style: { fontSize: '12px', fill: colors.text }
  };

  // Render the appropriate chart type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
            <XAxis dataKey={xAxisDataKey} {...axisProps} />
            <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: colors.text } } : undefined} {...axisProps} />
            <Tooltip content={<ThemedTooltip theme={theme} />} />
            {showLegend && <Legend layout={legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal'} verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} align={legendPosition === 'right' ? 'right' : legendPosition === 'left' ? 'left' : 'center'} wrapperStyle={{ color: colors.text }} />}
            {series.map((s, i) => (
              <Line
                key={s.dataKey}
                type={s.type || "monotone"}
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color || colors.series[i % colors.series.length]}
                strokeWidth={2}
                dot={{ r: 3, fill: s.color || colors.series[i % colors.series.length], stroke: s.color || colors.series[i % colors.series.length] }}
                activeDot={{ r: 5 }}
                strokeDasharray={s.strokeDasharray}
              />
            ))}
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
            <XAxis dataKey={xAxisDataKey} {...axisProps} />
            <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: colors.text } } : undefined} {...axisProps} />
            <Tooltip content={<ThemedTooltip theme={theme} />} />
            {showLegend && <Legend layout={legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal'} verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} align={legendPosition === 'right' ? 'right' : legendPosition === 'left' ? 'left' : 'center'} wrapperStyle={{ color: colors.text }} />}
            {series.map((s, i) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color || colors.series[i % colors.series.length]}
                stackId={stacked ? 'stack' : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
            <XAxis dataKey={xAxisDataKey} {...axisProps} />
            <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: colors.text } } : undefined} {...axisProps} />
            <Tooltip content={<ThemedTooltip theme={theme} />} />
            {showLegend && <Legend layout={legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal'} verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} align={legendPosition === 'right' ? 'right' : legendPosition === 'left' ? 'left' : 'center'} wrapperStyle={{ color: colors.text }} />}
            {series.map((s, i) => (
              <Area
                key={s.dataKey}
                type={s.type || "monotone"}
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color || colors.series[i % colors.series.length]}
                fill={s.color || colors.series[i % colors.series.length]}
                fillOpacity={0.3}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}