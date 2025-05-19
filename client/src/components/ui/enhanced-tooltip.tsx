import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metrics: Record<string, {
    label: string;
    formatter: (value: number) => string;
    color: string;
    secondaryInfo?: (value: number) => { label: string; value: string; color?: string }[];
  }>;
  additionalInfo?: React.ReactNode;
  className?: string;
}

export function EnhancedTooltip({
  active,
  payload,
  label,
  metrics,
  additionalInfo,
  className
}: EnhancedTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <Card className={cn("p-0 shadow-lg border border-border bg-background", className)}>
      <CardContent className="p-3 space-y-2">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            const metricKey = entry.dataKey;
            const metricConfig = metrics[metricKey];
            if (!metricConfig) return null;

            return (
              <div key={`tooltip-${index}`} className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: metricConfig.color }}
                    />
                    <span className="text-sm text-muted-foreground">{metricConfig.label}:</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {metricConfig.formatter(entry.value)}
                  </span>
                </div>
                
                {/* Secondary information */}
                {metricConfig.secondaryInfo && (
                  <div className="pl-5 space-y-0.5">
                    {metricConfig.secondaryInfo(entry.value).map((info, i) => (
                      <div key={`secondary-${i}`} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{info.label}:</span>
                        <span 
                          className={cn("font-medium", info.color)}
                        >
                          {info.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {additionalInfo && (
          <div className="pt-1 border-t border-border mt-1">
            {additionalInfo}
          </div>
        )}
      </CardContent>
    </Card>
  );
}