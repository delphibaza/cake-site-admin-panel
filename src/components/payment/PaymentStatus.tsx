
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatus as PaymentStatusType } from "@/types/payment";
import { CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentStatusProps {
  status: PaymentStatusType;
  paymentId: string;
  amount: number;
  redirectTo?: string;
  orderNumber?: number;
}

const PaymentStatus = ({ 
  status, 
  paymentId, 
  amount, 
  redirectTo = "/profile", 
  orderNumber
}: PaymentStatusProps) => {
  const getStatusContent = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500 mb-4" />,
          title: "Платеж успешно выполнен",
          description: `Ваш платеж на сумму ${amount.toLocaleString('ru-RU')} ₽ был успешно обработан.`,
          actionText: "Перейти в личный кабинет",
          color: "bg-green-50 text-green-700"
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500 mb-4" />,
          title: "Платеж не выполнен",
          description: "К сожалению, произошла ошибка при обработке платежа. Пожалуйста, попробуйте снова или выберите другой способ оплаты.",
          actionText: "Попробовать снова",
          color: "bg-red-50 text-red-700"
        };
      case 'processing':
        return {
          icon: <Clock className="h-16 w-16 text-blue-500 mb-4" />,
          title: "Платеж обрабатывается",
          description: "Ваш платеж в настоящее время обрабатывается. Пожалуйста, подождите, это может занять несколько минут.",
          actionText: "Обновить статус",
          color: "bg-blue-50 text-blue-700"
        };
      case 'pending':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />,
          title: "Платеж ожидает подтверждения",
          description: "Ваш платеж ожидает подтверждения. Мы уведомим вас, когда он будет обработан.",
          actionText: "Проверить статус позже",
          color: "bg-amber-50 text-amber-700"
        };
      case 'refunded':
        return {
          icon: <ArrowRight className="h-16 w-16 text-purple-500 mb-4" />,
          title: "Средства возвращены",
          description: `Возврат средств на сумму ${amount.toLocaleString('ru-RU')} ₽ был выполнен успешно.`,
          actionText: "Вернуться в личный кабинет",
          color: "bg-purple-50 text-purple-700"
        };
      default:
        return {
          icon: <AlertTriangle className="h-16 w-16 text-gray-500 mb-4" />,
          title: "Статус платежа неизвестен",
          description: "Не удалось определить текущий статус платежа. Пожалуйста, свяжитесь с нашей службой поддержки.",
          actionText: "На главную",
          color: "bg-gray-50 text-gray-700"
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Card className={`w-full max-w-md mx-auto ${statusContent.color}`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{statusContent.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {statusContent.icon}
        
        <p>{statusContent.description}</p>
        
        {orderNumber && (
          <p className="font-medium">
            Номер заказа: #{orderNumber}
          </p>
        )}
        
        <div className="bg-white bg-opacity-60 rounded-md p-3 text-sm">
          <p className="text-gray-600">
            Номер платежа: {paymentId}
          </p>
          <p className="text-gray-600">
            Дата: {new Date().toLocaleDateString('ru-RU', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <Button 
          asChild 
          className="mt-6"
          variant={status === 'completed' || status === 'refunded' ? "default" : "outline"}
        >
          <Link to={redirectTo}>
            {statusContent.actionText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
