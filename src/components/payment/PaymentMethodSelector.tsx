
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from '@/types/payment';
import { CreditCard, PaypalIcon, Building, Banknote, Gift } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

const PaymentMethodSelector = ({ value, onChange, className = '' }: PaymentMethodSelectorProps) => {
  const handleChange = (value: string) => {
    onChange(value as PaymentMethod);
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <RadioGroup
          value={value}
          onValueChange={handleChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="card" id="method-card" />
            <Label htmlFor="method-card" className="flex flex-1 items-center cursor-pointer">
              <CreditCard className="mr-3 h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Банковская карта</p>
                <p className="text-sm text-muted-foreground">Visa, MasterCard, МИР</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="paypal" id="method-paypal" />
            <Label htmlFor="method-paypal" className="flex flex-1 items-center cursor-pointer">
              <PaypalIcon className="mr-3 h-5 w-5 text-blue-700" />
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-muted-foreground">Оплата через PayPal аккаунт</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="bank" id="method-bank" />
            <Label htmlFor="method-bank" className="flex flex-1 items-center cursor-pointer">
              <Building className="mr-3 h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Банковский перевод</p>
                <p className="text-sm text-muted-foreground">Перевод со счета на счет</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="cash" id="method-cash" />
            <Label htmlFor="method-cash" className="flex flex-1 items-center cursor-pointer">
              <Banknote className="mr-3 h-5 w-5 text-green-800" />
              <div>
                <p className="font-medium">Наличными при получении</p>
                <p className="text-sm text-muted-foreground">Оплата курьеру при доставке</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="voucher" id="method-voucher" />
            <Label htmlFor="method-voucher" className="flex flex-1 items-center cursor-pointer">
              <Gift className="mr-3 h-5 w-5 text-pink-600" />
              <div>
                <p className="font-medium">Подарочный сертификат</p>
                <p className="text-sm text-muted-foreground">Применить подарочную карту или промокод</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

// PayPal icon (custom)
const PaypalIcon = ({ className }: { className?: string }) => (
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

export default PaymentMethodSelector;
