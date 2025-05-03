
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";

interface Order {
  id: number;
  customer: string;
  date: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  total: number;
}

interface RecentOrdersCardProps {
  orders: Order[];
  onViewAllClick?: () => void;
}

const RecentOrdersCard = ({ orders, onViewAllClick }: RecentOrdersCardProps) => {
  const getStatusIconClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "processing":
        return "bg-amber-100 text-amber-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Последние заказы</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewAllClick}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4">
              <div className={`rounded-full p-2 ${getStatusIconClass(order.status)}`}>
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Заказ #{order.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.customer} • {order.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium">{order.total.toLocaleString('ru-RU')} ₽</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link to="/admin/orders" className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <ShoppingCart className="mr-2 h-3.5 w-3.5" />
            Все заказы
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentOrdersCard;
