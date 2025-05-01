
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow } from "@/components/ui/table";
import { CheckCheck, Truck, XCircle } from "lucide-react";
import { Order } from "@/types/order";
import { formatDate } from "@/utils/formatDate";
import StatusBadge from "@/components/admin/StatusBadge";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onStatusChange: (orderId: number, newStatus: Order["status"]) => void;
}

const OrderDetailsDialog = ({ 
  open, 
  onOpenChange, 
  order, 
  onStatusChange 
}: OrderDetailsDialogProps) => {
  if (!order) return null;

  const handleStatusChange = (value: string) => {
    onStatusChange(order.id, value as Order["status"]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Детали заказа #{order.id}</DialogTitle>
          <DialogDescription>
            Дата заказа: {formatDate(order.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <CustomerInfo order={order} />
          <OrderStatusSection 
            status={order.status} 
            onStatusChange={handleStatusChange} 
          />
        </div>

        <Separator />

        <OrderItemsList items={order.items} total={order.total} />

        <ActionButtons 
          status={order.status} 
          orderId={order.id} 
          onStatusChange={onStatusChange} 
        />
      </DialogContent>
    </Dialog>
  );
};

interface CustomerInfoProps {
  order: Order;
}

const CustomerInfo = ({ order }: CustomerInfoProps) => (
  <div>
    <h4 className="font-medium text-sm mb-2">Информация о клиенте</h4>
    <p className="text-sm mb-1">{order.customerName}</p>
    <p className="text-sm mb-1">{order.customerPhone}</p>
    <p className="text-sm">{order.customerAddress}</p>
  </div>
);

interface OrderStatusSectionProps {
  status: Order["status"];
  onStatusChange: (value: string) => void;
}

const OrderStatusSection = ({ status, onStatusChange }: OrderStatusSectionProps) => (
  <div>
    <h4 className="font-medium text-sm mb-2">Статус заказа</h4>
    <div className="flex items-center mb-2">
      <StatusBadge status={status} />
    </div>
    <Select 
      value={status}
      onValueChange={onStatusChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Изменить статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">Новый</SelectItem>
        <SelectItem value="processing">В обработке</SelectItem>
        <SelectItem value="completed">Завершен</SelectItem>
        <SelectItem value="cancelled">Отменен</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

interface OrderItemsListProps {
  items: Order["items"];
  total: number;
}

const OrderItemsList = ({ items, total }: OrderItemsListProps) => (
  <div className="py-4">
    <h4 className="font-medium mb-3">Товары</h4>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Товар</TableHead>
          <TableHead className="text-right">Цена</TableHead>
          <TableHead className="text-center">Кол-во</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-right">{item.price} ₽</TableCell>
            <TableCell className="text-center">{item.quantity}</TableCell>
            <TableCell className="text-right">{item.price * item.quantity} ₽</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={3} className="text-right font-medium">
            Итого:
          </TableCell>
          <TableCell className="text-right font-bold">
            {total} ₽
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

interface ActionButtonsProps {
  status: Order["status"];
  orderId: number;
  onStatusChange: (orderId: number, newStatus: Order["status"]) => void;
}

const ActionButtons = ({ status, orderId, onStatusChange }: ActionButtonsProps) => (
  <DialogFooter className="gap-2">
    {status === "new" && (
      <Button 
        variant="outline"
        className="flex-1"
        onClick={() => onStatusChange(orderId, "processing")}
      >
        <Truck className="mr-2 h-4 w-4" />
        Принять в обработку
      </Button>
    )}
    {status === "processing" && (
      <Button 
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={() => onStatusChange(orderId, "completed")}
      >
        <CheckCheck className="mr-2 h-4 w-4" />
        Пометить как выполненный
      </Button>
    )}
    {(status === "new" || status === "processing") && (
      <Button 
        variant="destructive"
        className="flex-1"
        onClick={() => onStatusChange(orderId, "cancelled")}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Отменить заказ
      </Button>
    )}
  </DialogFooter>
);

export default OrderDetailsDialog;
