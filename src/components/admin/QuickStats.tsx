
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// Определение вариантов стилей для индикатора тренда
const trendIndicatorVariants = cva("flex items-center text-xs font-medium", {
  variants: {
    trend: {
      up: "text-green-600",
      down: "text-red-600",
      neutral: "text-gray-500"
    }
  },
  defaultVariants: {
    trend: "neutral"
  }
});

interface TrendIndicatorProps extends VariantProps<typeof trendIndicatorVariants> {
  value: number | string;
  className?: string;
}

function TrendIndicator({ trend, value, className }: TrendIndicatorProps) {
  return (
    <div className={trendIndicatorVariants({ trend, className })}>
      {trend === "up" ? (
        <ArrowUp className="mr-1 h-3 w-3" />
      ) : trend === "down" ? (
        <ArrowDown className="mr-1 h-3 w-3" />
      ) : null}
      {value}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  isLoading = false,
  className = "",
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[80px]" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trendValue) && (
              <div className="flex justify-between items-center mt-1">
                {description && (
                  <CardDescription className="text-xs">{description}</CardDescription>
                )}
                {trendValue && trend && (
                  <TrendIndicator trend={trend} value={trendValue} />
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickStatsProps {
  stats: StatCardProps[];
  className?: string;
  isLoading?: boolean;
  cols?: 2 | 3 | 4;
}

export default function QuickStats({
  stats,
  className = "",
  isLoading = false,
  cols = 4,
}: QuickStatsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return (
    <div className={`grid gap-4 ${gridCols} ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}
