import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { cva } from 'class-variance-authority';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

// Define variants for different metric types
const metricVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        positive: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950 dark:text-green-300 dark:ring-green-500/30",
        negative: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950 dark:text-red-300 dark:ring-red-500/30",
        neutral: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-500/30",
        warning: "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-950 dark:text-yellow-300 dark:ring-yellow-500/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  changeTimeframe?: string;
  footer?: React.ReactNode;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  inverseColors?: boolean; // For metrics where negative is good (e.g., cost reduction)
  isLoading?: boolean;
  variant?: "default" | "primary" | "secondary" | "outline";
}

export function MetricCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  changeTimeframe = "vs. previous period",
  footer,
  className,
  valuePrefix,
  valueSuffix,
  inverseColors = false,
  isLoading = false,
  variant = "default",
}: MetricCardProps) {
  const { isDark } = useTheme();
  
  // Determine change variant
  let changeVariant: "positive" | "negative" | "neutral" = "neutral";
  
  if (change !== undefined) {
    if (change > 0) {
      changeVariant = inverseColors ? "negative" : "positive";
    } else if (change < 0) {
      changeVariant = inverseColors ? "positive" : "negative";
    }
  }
  
  // Format change value
  const formattedChange = change !== undefined 
    ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` 
    : undefined;
  
  // Change icon based on direction
  const changeIcon = change === undefined ? null : (
    change > 0 ? (
      <ArrowUpIcon className="h-3 w-3" />
    ) : change < 0 ? (
      <ArrowDownIcon className="h-3 w-3" />
    ) : (
      <MinusIcon className="h-3 w-3" />
    )
  );

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      variant === "primary" && "border-primary/50 bg-primary/5 dark:bg-primary/10",
      variant === "secondary" && "border-secondary/50 bg-secondary/5 dark:bg-secondary/10",
      variant === "outline" && "border-2",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {valuePrefix}{value}{valueSuffix}
            </div>
            
            {change !== undefined && (
              <div className="mt-1 flex items-center gap-1">
                <span className={metricVariants({ variant: changeVariant })}>
                  {changeIcon}
                  <span className="ml-1">{formattedChange}</span>
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {changeLabel || changeTimeframe}
                </span>
              </div>
            )}
            
            {footer && (
              <div className="mt-3 text-xs text-muted-foreground">
                {footer}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}