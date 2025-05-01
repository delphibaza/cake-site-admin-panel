
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";

interface StatusBadgeProps {
  status: Order["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Новый</Badge>;
    case "processing":
      return <Badge className="bg-amber-500 hover:bg-amber-600">В обработке</Badge>;
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Завершен</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Отменен</Badge>;
    default:
      return null;
  }
};

export default StatusBadge;
