
import { useState, useEffect, createContext, useContext } from 'react';
import { Payment, PaymentMethod, PaymentStatus, samplePayments } from '@/types/payment';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

interface PaymentContextType {
  payments: Payment[];
  processing: boolean;
  processPayment: (
    amount: number, 
    orderId: number, 
    method: PaymentMethod, 
    details: any
  ) => Promise<{ success: boolean; paymentId?: string; message?: string }>;
  getOrderPayments: (orderId: number) => Payment[];
  getUserPayments: () => Payment[];
  refundPayment: (paymentId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [processing, setProcessing] = useState(false);

  // Загружаем платежи из localStorage при инициализации
  useEffect(() => {
    const storedPayments = localStorage.getItem('payments');
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    } else {
      // Инициализируем демонстрационными данными
      setPayments(samplePayments);
      localStorage.setItem('payments', JSON.stringify(samplePayments));
    }
  }, []);

  // Обработка платежа
  const processPayment = async (
    amount: number,
    orderId: number,
    method: PaymentMethod,
    details: any
  ): Promise<{ success: boolean; paymentId?: string; message?: string }> => {
    try {
      setProcessing(true);
      
      // Имитация задержки обработки платежа
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Имитация случайной ошибки для демонстрации обработки ошибок (10% шанс)
      const shouldFail = Math.random() < 0.1;
      
      if (shouldFail) {
        toast({
          title: "Ошибка оплаты",
          description: "Не удалось обработать платеж. Пожалуйста, проверьте данные и попробуйте снова.",
          variant: "destructive",
        });
        
        return { 
          success: false, 
          message: "Ошибка обработки платежа. Пожалуйста, проверьте данные карты и попробуйте снова." 
        };
      }
      
      // Создаем новый платеж
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        orderId,
        amount,
        method,
        status: 'completed',
        details: {
          ...details,
          // Маскируем номер карты для безопасности
          cardNumber: details.cardNumber ? 
            `•••• •••• •••• ${details.cardNumber.slice(-4)}` : 
            undefined
        },
        date: new Date().toISOString().split('T')[0],
        customerId: currentUser?.id,
        transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`
      };
      
      // Добавляем платеж в состояние и localStorage
      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
      
      toast({
        title: "Оплата успешна",
        description: `Платеж на сумму ${amount} ₽ успешно обработан.`,
      });
      
      return { 
        success: true, 
        paymentId: newPayment.id,
        message: "Платеж успешно обработан."
      };
    } catch (error) {
      console.error("Ошибка обработки платежа:", error);
      
      toast({
        title: "Ошибка оплаты",
        description: "Произошла неизвестная ошибка при обработке платежа.",
        variant: "destructive",
      });
      
      return { 
        success: false, 
        message: "Произошла ошибка. Пожалуйста, попробуйте позже." 
      };
    } finally {
      setProcessing(false);
    }
  };

  // Получение платежей для конкретного заказа
  const getOrderPayments = (orderId: number): Payment[] => {
    return payments.filter(payment => payment.orderId === orderId);
  };

  // Получение платежей текущего пользователя
  const getUserPayments = (): Payment[] => {
    if (!currentUser) return [];
    return payments.filter(payment => payment.customerId === currentUser.id);
  };

  // Возврат платежа
  const refundPayment = async (paymentId: string): Promise<boolean> => {
    try {
      setProcessing(true);
      
      // Имитация задержки обработки возврата
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Находим платеж и обновляем его статус
      const updatedPayments = payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'refunded' as PaymentStatus } 
          : payment
      );
      
      setPayments(updatedPayments);
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
      
      toast({
        title: "Возврат выполнен",
        description: "Возврат средств успешно выполнен.",
      });
      
      return true;
    } catch (error) {
      console.error("Ошибка возврата:", error);
      
      toast({
        title: "Ошибка возврата",
        description: "Не удалось выполнить возврат средств.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        processing,
        processPayment,
        getOrderPayments,
        getUserPayments,
        refundPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
