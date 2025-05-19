import { useState, useRef, ReactNode } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend,
  TooltipProps,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

interface ZoomableChartProps {
  data: any[];
  areaKey: string;
  xAxisKey: string;
  areaColor: string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
  children?: React.ReactNode;
  tooltipContent?: React.FC<TooltipProps<any, any>> | React.ReactElement;
}

export function ZoomableChart({
  data,
  areaKey,
  xAxisKey,
  areaColor,
  formatYAxis = (value) => `${value}`,
  formatTooltip = (value) => `${value}`,
  children,
  tooltipContent
}: ZoomableChartProps) {
  const [left, setLeft] = useState<string | number | undefined>(undefined);
  const [right, setRight] = useState<string | number | undefined>(undefined);
  const [refAreaLeft, setRefAreaLeft] = useState<string | number | undefined>(undefined);
  const [refAreaRight, setRefAreaRight] = useState<string | number | undefined>(undefined);
  const [zoomedData, setZoomedData] = useState(data);
  const [isZoomed, setIsZoomed] = useState(false);

  type AxisDomainType = string | number;

  const getAxisYDomain = (from: number, to: number, offset: number) => {
    const dataSlice = data.slice(from, to + 1);
    let [bottom, top] = [
      Math.min(...dataSlice.map(d => d[areaKey] || 0)),
      Math.max(...dataSlice.map(d => d[areaKey] || 0))
    ];
    
    bottom = bottom - offset;
    top = top + offset;
    
    return [bottom, top];
  };

  const zoom = () => {
    if (refAreaLeft === refAreaRight || !refAreaRight) {
      setRefAreaLeft(undefined);
      setRefAreaRight(undefined);
      return;
    }

    // Ensure left is always less than right
    let indexLeft = data.findIndex(d => d[xAxisKey] === refAreaLeft);
    let indexRight = data.findIndex(d => d[xAxisKey] === refAreaRight);

    if (indexLeft > indexRight) {
      [indexLeft, indexRight] = [indexRight, indexLeft];
    }

    const [bottom, top] = getAxisYDomain(indexLeft, indexRight, (data[indexRight]?.[areaKey] - data[indexLeft]?.[areaKey]) * 0.1);

    setZoomedData(data.slice(indexLeft, indexRight + 1));
    setLeft(data[indexLeft]?.[xAxisKey]) as AxisDomainType | undefined;
    setRight(data[indexRight]?.[xAxisKey]) as AxisDomainType | undefined;
    setRefAreaLeft(undefined);
    setRefAreaRight(undefined);
    setIsZoomed(true);
  };

  const zoomOut = () => {
    setZoomedData(data);
    setLeft(undefined);
    setRight(undefined);
    setIsZoomed(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={zoomOut}
          disabled={!isZoomed}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={() => setZoomedData(data)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={zoomedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => refAreaLeft && e && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <defs>
            <linearGradient id={`color${areaKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey={xAxisKey}
            allowDataOverflow
            domain={
              typeof left === 'number' && typeof right === 'number'
                ? ([left, right] as [number, number])
                : typeof left === 'string' && typeof right === 'string'
                  ? ([left, right] as [string, string])
                  : undefined
            }
            tick={{ fontSize: 11 }}
          />
          <YAxis
            allowDataOverflow
            domain={['auto', 'auto']}
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11 }}
          />
          {tooltipContent ? (
            <Tooltip content={tooltipContent} />
          ) : (
            <Tooltip formatter={formatTooltip} />
          )}

          <Area
            type="monotone"
            dataKey={areaKey}
            stroke={areaColor}
            fillOpacity={1}
            fill={`url(#color${areaKey})`}
          />

          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="#ff6b00"
              fillOpacity={0.1}
            />
          )} {/* Closing parenthesis added */}

          {children}
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Click and drag to zoom in on a specific time period
      </div>
    </div>
  );
}
