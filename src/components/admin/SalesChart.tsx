
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface SalesChartProps {
  data: Array<{
    name: string;
    sales: number;
    visitors?: number;
  }>;
  title?: string;
  total?: number;
  trend?: number;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const SalesChart = ({ 
  data, 
  title = "Продажи за неделю",
  total = 156500,
  trend = 12.5,
  period = "Сегодня",
  onPeriodChange
}: SalesChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPeriodChange && onPeriodChange(period)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {period}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [`${value} ₽`, 'Продажи']}
                labelFormatter={(value) => `${value}`}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                activeDot={{ r: 6 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between border-t pt-3 mt-3">
          <div>
            <p className="text-sm font-medium">Общие продажи</p>
            <p className="text-2xl font-bold">{total.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div>
            <Badge variant="secondary" className="ml-auto">
              <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
              +{trend}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
