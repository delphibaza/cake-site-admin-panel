
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Order } from "@/types/order";
import { formatDate } from "@/utils/formatDate";
import StatusBadge from "@/components/admin/StatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

const OrdersTable = ({ orders, onViewDetails }: OrdersTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№ заказа</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead className="hidden md:table-cell">Телефон</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">{order.customerPhone}</TableCell>
                <TableCell>{order.total} ₽</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Детали
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                Заказы не найдены
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
