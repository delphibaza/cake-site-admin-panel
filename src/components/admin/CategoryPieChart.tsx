
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

interface CategoryItem {
  name: string;
  value: number;
  fill: string;
}

interface CategoryPieChartProps {
  data: CategoryItem[];
  title?: string;
  onDetailsClick?: () => void;
}

const CategoryPieChart = ({ 
  data, 
  title = "Продажи по категориям",
  onDetailsClick
}: CategoryPieChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Доля продаж']} />
              <Legend 
                verticalAlign="bottom" 
                layout="horizontal" 
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onDetailsClick}
        >
          <Eye className="mr-2 h-3.5 w-3.5" />
          Подробная статистика
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryPieChart;
