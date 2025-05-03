
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  Percent,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatProps {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
  changePrefix?: string;
}

interface StatisticsCardsProps {
  stats: StatProps[];
  loading?: boolean;
}

export default function StatisticsCards({ stats, loading = false }: StatisticsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-28 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {stat.icon || getDefaultIcon(index)}
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-2xl font-bold">{stat.value}</div>
            {(stat.change !== undefined || stat.description) && (
              <div className="flex items-center justify-between mt-1">
                {stat.change !== undefined && (
                  <div className={`flex items-center text-xs font-medium ${
                    stat.change > 0 
                      ? 'text-green-600 dark:text-green-500' 
                      : stat.change < 0 
                        ? 'text-red-600 dark:text-red-500' 
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stat.change > 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : stat.change < 0 ? (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    ) : null}
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                    {stat.changePrefix && <span className="ml-1 text-muted-foreground">{stat.changePrefix}</span>}
                  </div>
                )}
                {stat.description && (
                  <CardDescription className="text-xs">{stat.description}</CardDescription>
                )}
              </div>
            )}
          </CardContent>
          
          {/* Декоративный фон */}
          <div className="absolute bottom-0 right-0 h-24 w-24 bg-primary/5 rounded-tl-full transform translate-y-1/3 translate-x-1/3 transition-transform group-hover:translate-y-1/4 group-hover:translate-x-1/4 z-0" />
        </Card>
      ))}
    </div>
  );
}

function getDefaultIcon(index: number) {
  const icons = [
    <DollarSign className="h-5 w-5" />,
    <Users className="h-5 w-5" />,
    <ShoppingCart className="h-5 w-5" />,
    <Percent className="h-5 w-5" />,
    <Clock className="h-5 w-5" />
  ];
  
  return icons[index % icons.length];
}
