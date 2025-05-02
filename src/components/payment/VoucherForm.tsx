
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

// Схема валидации
const voucherSchema = z.object({
  voucherCode: z.string().min(4, { message: "Код должен содержать не менее 4 символов" }),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

interface VoucherFormProps {
  onSubmit: (values: VoucherFormValues) => void;
  isProcessing?: boolean;
  amount: number;
}

const VoucherForm = ({ onSubmit, isProcessing = false, amount }: VoucherFormProps) => {
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherCode: "",
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Подарочный сертификат</CardTitle>
            <CardDescription>Оплата подарочным сертификатом или промокодом</CardDescription>
          </div>
          <Gift className="h-6 w-6 text-pink-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm mb-1">Сумма к оплате: <span className="font-bold">{amount} ₽</span></p>
          <p className="text-xs text-muted-foreground">Код сертификата или промокод можно найти на подарочной карте или в письме с промокодом.</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Доступные тестовые коды:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><span className="font-mono bg-gray-100 px-1 rounded">GIFT500</span> — сертификат на 500 ₽</li>
            <li><span className="font-mono bg-gray-100 px-1 rounded">GIFT1000</span> — сертификат на 1000 ₽</li>
            <li><span className="font-mono bg-gray-100 px-1 rounded">GIFT2000</span> — сертификат на 2000 ₽</li>
            <li><span className="font-mono bg-gray-100 px-1 rounded">PROMO10</span> — скидка 10%</li>
            <li><span className="font-mono bg-gray-100 px-1 rounded">PROMO20</span> — скидка 20%</li>
          </ul>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voucherCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код сертификата или промокод</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Введите код" 
                      className="uppercase"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Проверка..." : "Применить"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-start">
        <p className="text-xs text-muted-foreground">Сертификаты могут быть комбинированы с другими способами оплаты при недостаточной сумме.</p>
        <p className="text-xs text-muted-foreground">Промокоды могут иметь ограничения по времени действия и условиям применения.</p>
      </CardFooter>
    </Card>
  );
};

export default VoucherForm;
