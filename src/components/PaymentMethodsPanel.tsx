
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Check, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreditCardForm from "@/components/payment/CreditCardForm";

interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'mir' | 'unknown';
  isDefault: boolean;
}

const PaymentMethodsPanel = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: 'card_1',
      cardNumber: '•••• •••• •••• 4242',
      cardHolder: 'ИВАН ИВАНОВ',
      expiryDate: '05/26',
      cardType: 'visa',
      isDefault: true
    },
    {
      id: 'card_2',
      cardNumber: '•••• •••• •••• 5555',
      cardHolder: 'ИВАН ИВАНОВ',
      expiryDate: '10/25',
      cardType: 'mastercard',
      isDefault: false
    }
  ]);
  
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = (cardData: any) => {
    // Определение типа карты на основе номера
    let cardType: SavedCard['cardType'] = 'unknown';
    const cardNumber = cardData.cardNumber.replace(/\s+/g, "");
    
    if (/^4/.test(cardNumber)) cardType = 'visa';
    else if (/^5[1-5]/.test(cardNumber)) cardType = 'mastercard';
    else if (/^3[47]/.test(cardNumber)) cardType = 'amex';
    else if (/^(220[0-4]|22[1-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cardNumber)) cardType = 'mir';
    
    // Создание новой карты
    const newCard: SavedCard = {
      id: `card_${Date.now()}`,
      cardNumber: `•••• •••• •••• ${cardNumber.slice(-4)}`,
      cardHolder: cardData.cardHolder.toUpperCase(),
      expiryDate: cardData.expiryDate,
      cardType,
      isDefault: savedCards.length === 0 // Первая карта становится дефолтной
    };
    
    setSavedCards([...savedCards, newCard]);
    setIsAddingCard(false);
  };

  const makeDefaultCard = (cardId: string) => {
    setSavedCards(savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const removeCard = (cardId: string) => {
    // Если удаляемая карта была дефолтной, сделать дефолтной первую из оставшихся
    const isRemovingDefault = savedCards.find(c => c.id === cardId)?.isDefault;
    const filteredCards = savedCards.filter(card => card.id !== cardId);
    
    if (isRemovingDefault && filteredCards.length > 0) {
      filteredCards[0].isDefault = true;
    }
    
    setSavedCards(filteredCards);
  };

  // Получение иконки для типа карты
  const getCardTypeIcon = (type: SavedCard['cardType']) => {
    switch (type) {
      case 'visa':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">VISA</Badge>;
      case 'mastercard':
        return <Badge variant="outline" className="text-red-600 border-red-200">MasterCard</Badge>;
      case 'amex':
        return <Badge variant="outline" className="text-blue-800 border-blue-200">AMEX</Badge>;
      case 'mir':
        return <Badge variant="outline" className="text-green-600 border-green-200">МИР</Badge>;
      default:
        return <Badge variant="outline">Карта</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Способы оплаты</CardTitle>
        <CardDescription>Управление сохраненными картами и способами оплаты</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cards">
          <TabsList className="mb-4">
            <TabsTrigger value="cards">Банковские карты</TabsTrigger>
            <TabsTrigger value="other">Другие методы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards">
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div 
                  key={card.id}
                  className={`flex justify-between items-center p-4 rounded-lg border ${card.isDefault ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md border">
                      <CreditCard className={`h-6 w-6 ${
                        card.cardType === 'visa' ? 'text-blue-600' :
                        card.cardType === 'mastercard' ? 'text-red-600' :
                        card.cardType === 'amex' ? 'text-blue-800' :
                        card.cardType === 'mir' ? 'text-green-600' :
                        'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{card.cardNumber}</p>
                        {getCardTypeIcon(card.cardType)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {card.cardHolder} • Истекает {card.expiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!card.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => makeDefaultCard(card.id)}
                      >
                        Сделать основной
                      </Button>
                    )}
                    {card.isDefault && (
                      <Badge className="mr-2 bg-blue-500">
                        <Check className="mr-1 h-3 w-3" />
                        Основная
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeCard(card.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить новую карту
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Добавление новой карты</DialogTitle>
                    <DialogDescription>
                      Введите данные карты, которую хотите сохранить для будущих платежей
                    </DialogDescription>
                  </DialogHeader>
                  <CreditCardForm onSubmit={handleAddCard} />
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          
          <TabsContent value="other">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-md border">
                    <PayPalIcon className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Изменить
                </Button>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Добавить способ оплаты
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <p>
            Мы используем шифрование для защиты ваших платежных данных. 
            Данные карт сохраняются в соответствии со стандартами PCI DSS.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// PayPal icon
const PayPalIcon = ({ className }: { className?: string }) => (
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

export default PaymentMethodsPanel;
