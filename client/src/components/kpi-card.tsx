import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

export default function KPICard({
  title,
  value,
  change,
  icon,
  trend
}: KPICardProps) {
  const { isDark } = useTheme();
  
  return (
    <Card className="overflow-hidden relative border hover:shadow-md transition-all duration-200 bg-background">
      {/* Color accent based on trend */}
      {trend && (
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          trend === "up" 
            ? isDark ? "bg-green-600" : "bg-green-500" 
            : isDark ? "bg-red-600" : "bg-red-500"
        )} />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-full",
          isDark ? "bg-muted/30" : "bg-muted/80"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUp className={cn(
                "w-3 h-3 mr-1",
                isDark ? "text-green-400" : "text-green-600"
              )} />
            ) : (
              <ArrowDown className={cn(
                "w-3 h-3 mr-1",
                isDark ? "text-red-400" : "text-red-600"
              )} />
            )}
            <p className={cn(
              "text-xs font-medium",
              trend === "up" 
                ? isDark ? "text-green-400" : "text-green-600" 
                : isDark ? "text-red-400" : "text-red-600"
            )}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
