
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, BadgePercent, AlertCircle } from "lucide-react";

interface PaymentOrderSummaryProps {
  orderId: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}

const PaymentOrderSummary = ({
  orderId,
  items,
  subtotal,
  delivery,
  discount,
  total
}: PaymentOrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Информация о заказе</CardTitle>
          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Номер заказа:</span>
            <span className="text-sm">#{orderId}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Товары:</h4>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Стоимость товаров:</span>
              <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Truck className="mr-1 h-3.5 w-3.5 text-blue-500" />
                <span>Доставка:</span>
              </div>
              <span>
                {delivery > 0 
                  ? `${delivery.toLocaleString('ru-RU')} ₽` 
                  : 'Бесплатно'}
              </span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <div className="flex items-center">
                  <BadgePercent className="mr-1 h-3.5 w-3.5" />
                  <span>Скидка:</span>
                </div>
                <span>−{discount.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Итого к оплате:</span>
            <span className="text-lg">{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md flex text-sm">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-blue-700">
              Это демонстрационная версия платежной системы. Никакие реальные платежи не принимаются.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentOrderSummary;
