import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

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
  return (
    <Card className="overflow-hidden relative border-2 hover:shadow-md transition-all duration-200">
      {/* Color accent based on trend */}
      {trend && (
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          trend === "up" ? "bg-green-500" : "bg-red-500"
        )} />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="p-2 bg-muted rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
            )}
            <p className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-green-500" : "text-red-500"
            )}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
