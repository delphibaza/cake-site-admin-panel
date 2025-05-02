
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/payment";
import { DownloadCloud, Filter, Info, RefreshCw } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface PaymentHistoryProps {
  payments: Payment[];
  onRefundRequest?: (paymentId: string) => void;
}

const PaymentHistory = ({ payments, onRefundRequest }: PaymentHistoryProps) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments = 
    filter === "all" ? payments : 
    payments.filter(payment => payment.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Выполнен</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">В обработке</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Ожидает</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Отклонен</Badge>;
      case 'refunded':
        return <Badge className="bg-purple-500">Возвращен</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Банковская карта';
      case 'paypal':
        return 'PayPal';
      case 'bank':
        return 'Банковский перевод';
      case 'cash':
        return 'Наличные';
      case 'voucher':
        return 'Сертификат';
      default:
        return 'Другой метод';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">История платежей</CardTitle>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Фильтр
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                Все платежи
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Только выполненные
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("processing")}>
                В обработке
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("failed")}>
                Отклоненные
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("refunded")}>
                Возвраты
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="outline" className="h-8">
            <DownloadCloud className="h-3.5 w-3.5 mr-1" />
            Экспорт
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="details">Детали</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет платежей с выбранным фильтром</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-md p-4 hover:bg-gray-50"
                  >
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <p className="font-medium">Заказ #{payment.orderId}</p>
                        <span className="mx-2 text-gray-400">•</span>
                        <p className="text-sm text-muted-foreground">{formatDate(payment.date)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getMethodLabel(payment.method)}
                        {payment.details.cardNumber && ` (${payment.details.cardNumber})`}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <span className="font-medium">{payment.amount.toLocaleString('ru-RU')} ₽</span>
                      {getStatusBadge(payment.status)}
                      
                      <div className="flex space-x-2">
                        {payment.status === 'completed' && onRefundRequest && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onRefundRequest(payment.id)}
                          >
                            Возврат
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID платежа</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заказ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Метод</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{payment.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getMethodLabel(payment.method)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{payment.amount.toLocaleString('ru-RU')} ₽</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
