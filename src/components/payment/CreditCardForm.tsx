
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Lock } from "lucide-react";

// Схема валидации для данных кредитной карты
const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "Номер карты должен содержать не менее 16 цифр" })
    .max(19, { message: "Номер карты должен содержать не более 19 цифр" })
    .regex(/^[0-9\s]+$/, { message: "Номер карты может содержать только цифры и пробелы" }),
  cardHolder: z
    .string()
    .min(3, { message: "Имя владельца должно содержать не менее 3 символов" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Формат даты должен быть ММ/ГГ" }),
  cvv: z
    .string()
    .length(3, { message: "CVV должен содержать 3 цифры" })
    .regex(/^[0-9]+$/, { message: "CVV может содержать только цифры" }),
  saveCard: z.boolean().default(false),
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

interface CreditCardFormProps {
  onSubmit: (values: CreditCardFormValues) => void;
  isProcessing?: boolean;
}

const CreditCardForm = ({ onSubmit, isProcessing = false }: CreditCardFormProps) => {
  const [cardType, setCardType] = useState<string>("unknown");

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
  });

  // Определение типа карты по первым цифрам
  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s+/g, "");
    
    if (/^4/.test(cleanNumber)) {
      return "visa";
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return "mastercard";
    } else if (/^3[47]/.test(cleanNumber)) {
      return "amex";
    } else if (/^(220[0-4]|22[1-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleanNumber)) {
      return "mir";
    } else {
      return "unknown";
    }
  };

  // Форматирование номера карты во время ввода
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const cardType = detectCardType(cleanValue);
    setCardType(cardType);
    
    if (cleanValue) {
      // Группируем цифры по 4
      const formattedValue = cleanValue.match(/.{1,4}/g)?.join(" ") || cleanValue;
      return formattedValue;
    }
    
    return cleanValue;
  };

  // Обработчик ввода номера карты
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formattedValue, { shouldValidate: true });
  };

  // Обработчик ввода даты истечения
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    form.setValue("expiryDate", value, { shouldValidate: true });
  };

  // Иконка для типа карты
  const renderCardTypeIcon = () => {
    switch (cardType) {
      case "visa":
        return <div className="text-xs font-medium text-blue-600">VISA</div>;
      case "mastercard":
        return <div className="text-xs font-medium text-red-600">MasterCard</div>;
      case "amex":
        return <div className="text-xs font-medium text-blue-800">AMEX</div>;
      case "mir":
        return <div className="text-xs font-medium text-green-600">МИР</div>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Оплата картой</CardTitle>
            <CardDescription>Введите данные вашей банковской карты</CardDescription>
          </div>
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер карты</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleCardNumberChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        className="pr-12"
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {renderCardTypeIcon()}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя владельца</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Как указано на карте" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Срок действия</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleExpiryDateChange}
                        placeholder="ММ/ГГ"
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="XXX"
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="saveCard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Сохранить карту для будущих платежей</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isProcessing}>
              <Lock className="mr-2 h-4 w-4" />
              {isProcessing ? "Обработка платежа..." : "Оплатить"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreditCardForm;
