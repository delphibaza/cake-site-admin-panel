
import { Badge } from "@/components/ui/badge";

type StatusType = 'new' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'pending' | 'shipped';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getBadgeClass = () => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "processing":
        return "bg-amber-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "refunded":
        return "bg-purple-500";
      case "pending":
        return "bg-gray-500";
      case "shipped":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "new":
        return "Новый";
      case "processing":
        return "В обработке";
      case "completed":
        return "Завершен";
      case "cancelled":
        return "Отменен";
      case "refunded":
        return "Возвращен";
      case "pending":
        return "Ожидает";
      case "shipped":
        return "Отправлен";
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getBadgeClass()} ${className}`}>
      {getStatusLabel()}
    </Badge>
  );
};

export default StatusBadge;
