
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";
import { products } from "@/data/products";
import { Product } from "@/components/ProductCard";

// Расширенная версия продукта для корзины
interface CartItem extends Product {
  quantity: number;
}

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных корзины
  useEffect(() => {
    const timer = setTimeout(() => {
      // Демонстрационные данные
      setCartItems([
        { ...products[0], quantity: 1 },
        { ...products[2], quantity: 2 },
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Расчет общей суммы
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 300 : 0;
  const total = subtotal + deliveryFee - discount;

  // Обработчики действий с корзиной
  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Товар удален",
      description: "Товар был удален из корзины",
      duration: 3000,
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "cake10") {
      const discountAmount = Math.round(subtotal * 0.1);
      setDiscount(discountAmount);
      
      toast({
        title: "Промокод применен",
        description: `Скидка 10% (${discountAmount} ₽) применена к заказу`,
        duration: 3000,
      });
    } else {
      setDiscount(0);
      
      toast({
        title: "Недействительный промокод",
        description: "Указанный промокод не существует или истек",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Переход к оформлению",
      description: "Здесь будет форма оформления заказа",
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="space-y-6">
                <ShoppingBag className="mx-auto h-12 w-12 animate-pulse text-primary" />
                <h2 className="text-2xl font-bold">Загрузка корзины...</h2>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="space-y-6">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Ваша корзина пуста</h2>
                <p className="text-muted-foreground">
                  Похоже, вы еще не добавили товары в корзину
                </p>
                <Button asChild size="lg" className="mt-4">
                  <Link to="/catalog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Перейти в каталог
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">Корзина</h1>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Товары в корзине</h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col space-y-4 rounded-md border p-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="flex h-8 w-10 items-center justify-center border-y text-sm">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="font-medium">
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Continue Shopping Button */}
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/catalog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Продолжить покупки
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Сумма заказа</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Подытог</span>
                      <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Скидка</span>
                        <span>-{discount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Доставка</span>
                      <span>{deliveryFee > 0 ? `${deliveryFee.toLocaleString('ru-RU')} ₽` : "Бесплатно"}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого</span>
                      <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="space-y-2">
                      <label htmlFor="promo" className="text-sm font-medium">
                        Промокод
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Введите промокод"
                        />
                        <Button onClick={handleApplyPromo}>
                          Применить
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Попробуйте промокод "CAKE10" для скидки 10%
                      </p>
                    </div>
                    
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Перейти к оформлению
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
