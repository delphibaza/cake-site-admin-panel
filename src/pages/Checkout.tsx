
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck, ChevronRight, ChevronsRight, CheckCircle } from "lucide-react";
import { PaymentMethod } from '@/types/payment';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import CreditCardForm from '@/components/payment/CreditCardForm';
import BankTransferForm from '@/components/payment/BankTransferForm';
import VoucherForm from '@/components/payment/VoucherForm';
import PaymentOrderSummary from '@/components/payment/PaymentOrderSummary';
import PaymentStatus from '@/components/payment/PaymentStatus';

// Временные демо-данные заказа
const demoOrder = {
  id: 1008,
  items: [
    { id: 1, name: "Шоколадный торт", price: 1200, quantity: 1 },
    { id: 3, name: "Морковный торт", price: 1300, quantity: 1 }
  ],
  subtotal: 2500,
  delivery: 300,
  discount: 0,
  total: 2800
};

// Схема валидации для формы доставки
const deliveryFormSchema = z.object({
  fullName: z.string().min(3, { message: "Укажите имя и фамилию получателя" }),
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z
    .string()
    .min(10, { message: "Введите корректный номер телефона" })
    .regex(/^[0-9+\s()-]+$/, { message: "Номер телефона может содержать только цифры и символы +()-" }),
  address: z.string().min(5, { message: "Введите адрес доставки" }),
  city: z.string().min(2, { message: "Укажите город" }),
  postalCode: z.string().min(5, { message: "Введите почтовый индекс" }),
  deliveryMethod: z.enum(["standard", "express", "pickup"], { 
    required_error: "Выберите способ доставки" 
  }),
  comment: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { processPayment, processing } = usePayment();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryData, setDeliveryData] = useState<DeliveryFormValues | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | null;
    paymentId: string | null;
  }>({ status: null, paymentId: null });

  // Предзаполнение формы доставки, если пользователь авторизован
  const defaultDeliveryValues: Partial<DeliveryFormValues> = {
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: "",
    postalCode: "",
    deliveryMethod: "standard",
    comment: "",
  };

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: defaultDeliveryValues,
  });

  // Обработчик для формы доставки
  const onDeliverySubmit = (values: DeliveryFormValues) => {
    setDeliveryData(values);
    setStep(2);
  };

  // Обработчик для формы оплаты картой
  const handleCardPayment = async (cardData: any) => {
    if (!deliveryData) return;

    const result = await processPayment(
      demoOrder.total,
      demoOrder.id,
      'card',
      {
        cardNumber: cardData.cardNumber,
        cardHolder: cardData.cardHolder,
        expiryDate: cardData.expiryDate,
        cvv: cardData.cvv
      }
    );

    setPaymentStatus({
      status: result.success ? 'completed' : 'failed',
      paymentId: result.paymentId || null
    });
    
    setStep(3);
  };

  // Обработчик для формы банковского перевода
  const handleBankTransfer = async (bankData: any) => {
    if (!deliveryData) return;

    const result = await processPayment(
      demoOrder.total,
      demoOrder.id,
      'bank',
      {
        bankName: bankData.bankName,
        accountName: bankData.accountName,
        bankAccount: bankData.accountNumber
      }
    );

    setPaymentStatus({
      status: result.success ? 'completed' : 'failed',
      paymentId: result.paymentId || null
    });
    
    setStep(3);
  };

  // Обработчик для формы подарочного сертификата
  const handleVoucherPayment = async (voucherData: any) => {
    if (!deliveryData) return;

    // Проверка демо-кодов сертификатов
    let isSuccess = false;
    let voucherAmount = 0;

    if (voucherData.voucherCode === 'GIFT500') {
      voucherAmount = 500;
      isSuccess = true;
    } else if (voucherData.voucherCode === 'GIFT1000') {
      voucherAmount = 1000;
      isSuccess = true;
    } else if (voucherData.voucherCode === 'GIFT2000') {
      voucherAmount = 2000;
      isSuccess = true;
    } else if (voucherData.voucherCode === 'PROMO10') {
      voucherAmount = Math.round(demoOrder.total * 0.1);
      isSuccess = true;
    } else if (voucherData.voucherCode === 'PROMO20') {
      voucherAmount = Math.round(demoOrder.total * 0.2);
      isSuccess = true;
    }

    // Если код действителен, применяем его
    if (isSuccess) {
      // Если сумма сертификата больше или равна сумме заказа, оплачиваем полностью
      const paymentAmount = Math.min(demoOrder.total, voucherAmount);

      const result = await processPayment(
        paymentAmount,
        demoOrder.id,
        'voucher',
        {
          voucherCode: voucherData.voucherCode
        }
      );

      setPaymentStatus({
        status: result.success ? 'completed' : 'failed',
        paymentId: result.paymentId || null
      });
    } else {
      setPaymentStatus({
        status: 'failed',
        paymentId: null
      });
    }
    
    setStep(3);
  };

  // Наличные при получении
  const handleCashPayment = async () => {
    if (!deliveryData) return;

    const result = await processPayment(
      demoOrder.total,
      demoOrder.id,
      'cash',
      {}
    );

    setPaymentStatus({
      status: result.success ? 'completed' : 'failed',
      paymentId: result.paymentId || null
    });
    
    setStep(3);
  };

  // PayPal оплата
  const handlePayPalPayment = async () => {
    if (!deliveryData) return;

    const result = await processPayment(
      demoOrder.total,
      demoOrder.id,
      'paypal',
      {}
    );

    setPaymentStatus({
      status: result.success ? 'completed' : 'failed',
      paymentId: result.paymentId || null
    });
    
    setStep(3);
  };

  // Применение кода
  const applyDiscountCode = (code: string) => {
    // Реализация скидочной логики
  };

  // Если пользователь не авторизован и открыта страница, предложить войти
  useEffect(() => {
    if (!currentUser) {
      // В реальном приложении можно показать модальное окно или перенаправить на страницу входа
      // Здесь просто заполняем пустые поля для демонстрации
    }
  }, [currentUser]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          {/* Шаги оформления заказа */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-pink-600' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="text-sm mt-1">Доставка</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="text-sm mt-1">Оплата</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}>
                  {step >= 3 && paymentStatus.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    "3"
                  )}
                </div>
                <span className="text-sm mt-1">Подтверждение</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-6">Информация о доставке</h1>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onDeliverySubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя и фамилия</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Иванов" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                              <Input placeholder="+7 (999) 123-45-67" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Город</FormLabel>
                            <FormControl>
                              <Input placeholder="Москва" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Адрес доставки</FormLabel>
                            <FormControl>
                              <Input placeholder="Улица, дом, квартира" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Почтовый индекс</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Способ доставки</FormLabel>
                          <div className="space-y-2">
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="grid gap-4 md:grid-cols-3"
                            >
                              <div className="flex items-start space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="standard" id="delivery-standard" />
                                <div>
                                  <label htmlFor="delivery-standard" className="font-medium cursor-pointer block">Стандартная доставка</label>
                                  <p className="text-sm text-muted-foreground">Доставка в течение 2-3 дней</p>
                                  <p className="text-sm font-medium mt-1">300 ₽</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="express" id="delivery-express" />
                                <div>
                                  <label htmlFor="delivery-express" className="font-medium cursor-pointer block">Экспресс-доставка</label>
                                  <p className="text-sm text-muted-foreground">Доставка в течение 24 часов</p>
                                  <p className="text-sm font-medium mt-1">500 ₽</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="pickup" id="delivery-pickup" />
                                <div>
                                  <label htmlFor="delivery-pickup" className="font-medium cursor-pointer block">Самовывоз</label>
                                  <p className="text-sm text-muted-foreground">Забрать из магазина</p>
                                  <p className="text-sm font-medium mt-1">Бесплатно</p>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Комментарий к заказу (необязательно)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Указания курьеру, особые предпочтения по доставке и т.д."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/cart')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Вернуться в корзину
                      </Button>
                      
                      <Button type="submit">
                        Продолжить
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div>
                <PaymentOrderSummary 
                  orderId={demoOrder.id}
                  items={demoOrder.items}
                  subtotal={demoOrder.subtotal}
                  delivery={demoOrder.delivery}
                  discount={demoOrder.discount}
                  total={demoOrder.total}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-6">Оплата</h1>
                
                <PaymentMethodSelector 
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  className="mb-6"
                />
                
                {paymentMethod === 'card' && (
                  <CreditCardForm 
                    onSubmit={handleCardPayment}
                    isProcessing={processing}
                  />
                )}
                
                {paymentMethod === 'bank' && (
                  <BankTransferForm 
                    onSubmit={handleBankTransfer}
                    isProcessing={processing}
                    amount={demoOrder.total}
                  />
                )}
                
                {paymentMethod === 'voucher' && (
                  <VoucherForm 
                    onSubmit={handleVoucherPayment}
                    isProcessing={processing}
                    amount={demoOrder.total}
                  />
                )}
                
                {paymentMethod === 'cash' && (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Truck className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Оплата при получении</h3>
                    <p className="text-gray-600 mb-6">
                      Вы выбрали оплату наличными при получении заказа. 
                      Сумма к оплате: {demoOrder.total.toLocaleString('ru-RU')} ₽
                    </p>
                    <Button onClick={handleCashPayment} disabled={processing}>
                      {processing ? "Обработка..." : "Подтвердить заказ"}
                      <ChevronsRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <PayPalLogo className="mx-auto h-12 w-12 text-blue-700 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Оплата через PayPal</h3>
                    <p className="text-gray-600 mb-6">
                      Вы будете перенаправлены на сайт PayPal для завершения платежа.
                      Сумма к оплате: {demoOrder.total.toLocaleString('ru-RU')} ₽
                    </p>
                    <Button onClick={handlePayPalPayment} disabled={processing}>
                      {processing ? "Перенаправление..." : "Перейти к оплате PayPal"}
                      <ChevronsRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к доставке
                  </Button>
                </div>
              </div>
              
              <div>
                <PaymentOrderSummary 
                  orderId={demoOrder.id}
                  items={demoOrder.items}
                  subtotal={demoOrder.subtotal}
                  delivery={demoOrder.delivery}
                  discount={demoOrder.discount}
                  total={demoOrder.total}
                />
              </div>
            </div>
          )}

          {step === 3 && paymentStatus.status && (
            <div className="max-w-2xl mx-auto my-12">
              <PaymentStatus 
                status={paymentStatus.status}
                paymentId={paymentStatus.paymentId || 'unknown'}
                amount={demoOrder.total}
                redirectTo="/profile"
                orderNumber={demoOrder.id}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// PayPal лого
const PayPalLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 11c2.5-3 7.8-3 8.5 0 .3 1.3-.5 2-1.5 2H11c-1.5 0-2.5 1.7-2 3 .5 1.3 2 2 3 2h3.5c2.5 0 3.5-1 4-2" />
    <path d="M11 17.5c-1.5 0-3 .5-3-2" />
    <path d="M14 11.5c1 0 3-1 3-3.5C17 6 16 5 14.5 5H6s0 2 2 5" />
  </svg>
);

export default Checkout;
