
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface OrdersFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const OrdersFilter = ({ value, onValueChange }: OrdersFilterProps) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-600">Фильтр по статусу:</span>
      <Select 
        value={value} 
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Все заказы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все заказы</SelectItem>
          <SelectItem value="new">Новые</SelectItem>
          <SelectItem value="processing">В обработке</SelectItem>
          <SelectItem value="completed">Завершенные</SelectItem>
          <SelectItem value="cancelled">Отмененные</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrdersFilter;
