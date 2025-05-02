
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Схема валидации
const bankTransferSchema = z.object({
  bankName: z.string().min(1, { message: "Выберите банк" }),
  accountName: z.string().min(3, { message: "Введите имя владельца счета" }),
  accountNumber: z.string().min(8, { message: "Введите номер счета" }),
});

type BankTransferFormValues = z.infer<typeof bankTransferSchema>;

interface BankTransferFormProps {
  onSubmit: (values: BankTransferFormValues) => void;
  isProcessing?: boolean;
  amount: number;
}

const BankTransferForm = ({ onSubmit, isProcessing = false, amount }: BankTransferFormProps) => {
  const form = useForm<BankTransferFormValues>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
  });

  // Информация о банковском счете магазина
  const shopBankDetails = {
    name: "ООО 'Сладкий Торт'",
    bank: "Сбербанк",
    account: "40702810123456789012",
    bik: "044525225",
    inn: "7712345678",
    kpp: "770101001",
    correspondentAccount: "30101810400000000225",
  };

  // Обработчик копирования в буфер обмена
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Банковский перевод</CardTitle>
            <CardDescription>Перевод со счета на счет</CardDescription>
          </div>
          <Building className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md space-y-2">
          <p className="text-sm font-medium">Сумма к оплате: {amount} ₽</p>
          <p className="text-sm font-medium">Реквизиты для перевода:</p>
          
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Получатель:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.name)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Банк:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.bank}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.bank)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Расчетный счет:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.account}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.account)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">БИК:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.bik}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.bik)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">ИНН:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.inn}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.inn)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">КПП:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.kpp}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.kpp)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Корр. счет:</span>
              <div className="flex items-center">
                <span>{shopBankDetails.correspondentAccount}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy(shopBankDetails.correspondentAccount)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Назначение платежа:</span>
              <div className="flex items-center">
                <span>Оплата заказа</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => handleCopy("Оплата заказа")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm font-medium mb-2">Введите информацию о вашем банке и счете:</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название банка</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите банк" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sberbank">Сбербанк</SelectItem>
                        <SelectItem value="tinkoff">Тинькофф</SelectItem>
                        <SelectItem value="alfabank">Альфа-Банк</SelectItem>
                        <SelectItem value="vtb">ВТБ</SelectItem>
                        <SelectItem value="gazprombank">Газпромбанк</SelectItem>
                        <SelectItem value="other">Другой</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя владельца счета</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ФИО владельца" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер счета</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Номер вашего счета" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? "Обработка..." : "Подтвердить перевод"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferForm;
