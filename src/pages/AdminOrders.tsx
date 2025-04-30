
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, CheckCheck, Truck, XCircle } from "lucide-react";

// Типы данных для заказов
interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  status: "new" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  total: number;
}

// Демо данные для заказов
const sampleOrders: Order[] = [
  {
    id: 1001,
    customerName: "Елена Иванова",
    customerPhone: "+7 (905) 123-45-67",
    customerAddress: "ул. Пушкина, д. 10, кв. 42",
    date: "2025-04-28",
    status: "new",
    items: [
      { id: 1, productId: 1, name: "Шоколадный торт", price: 1200, quantity: 1 },
      { id: 2, productId: 3, name: "Морковный торт", price: 1300, quantity: 1 }
    ],
    total: 2500
  },
  {
    id: 1002,
    customerName: "Александр Петров",
    customerPhone: "+7 (912) 987-65-43",
    customerAddress: "просп. Ленина, д. 23, кв. 15",
    date: "2025-04-27",
    status: "processing",
    items: [
      { id: 3, productId: 4, name: "Чизкейк Нью-Йорк", price: 1500, quantity: 2 }
    ],
    total: 3000
  },
  {
    id: 1003,
    customerName: "Мария Сидорова",
    customerPhone: "+7 (925) 456-78-90",
    customerAddress: "ул. Гоголя, д. 5, кв. 78",
    date: "2025-04-25",
    status: "completed",
    items: [
      { id: 4, productId: 2, name: "Клубничный торт", price: 1400, quantity: 1 },
      { id: 5, productId: 6, name: "Наполеон", price: 1200, quantity: 1 },
      { id: 6, productId: 5, name: "Медовик", price: 1100, quantity: 1 }
    ],
    total: 3700
  },
  {
    id: 1004,
    customerName: "Василий Кузнецов",
    customerPhone: "+7 (916) 111-22-33",
    customerAddress: "ул. Чехова, д. 17, кв. 33",
    date: "2025-04-22",
    status: "cancelled",
    items: [
      { id: 7, productId: 1, name: "Шоколадный торт", price: 1200, quantity: 2 }
    ],
    total: 2400
  }
];

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const updateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link to="/admin" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Управление заказами</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Список заказов</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Фильтр по статусу:</span>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
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
        </div>

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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.customerPhone}</TableCell>
                    <TableCell>{order.total} ₽</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
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
      </div>

      {/* Диалог деталей заказа */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детали заказа #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Дата заказа: {selectedOrder && formatDate(selectedOrder.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Информация о клиенте</h4>
                  <p className="text-sm mb-1">{selectedOrder.customerName}</p>
                  <p className="text-sm mb-1">{selectedOrder.customerPhone}</p>
                  <p className="text-sm">{selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Статус заказа</h4>
                  <div className="flex items-center mb-2">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <Select 
                    value={selectedOrder.status}
                    onValueChange={(value: Order["status"]) => 
                      updateOrderStatus(selectedOrder.id, value)
                    }
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
              </div>

              <Separator />

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
                    {selectedOrder.items.map((item) => (
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
                        {selectedOrder.total} ₽
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="gap-2">
                {selectedOrder.status === "new" && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Принять в обработку
                  </Button>
                )}
                {selectedOrder.status === "processing" && (
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => updateOrderStatus(selectedOrder.id, "completed")}
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Пометить как выполненный
                  </Button>
                )}
                {(selectedOrder.status === "new" || selectedOrder.status === "processing") && (
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Отменить заказ
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
