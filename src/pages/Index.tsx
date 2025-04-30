
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [featuredProducts] = useState<Product[]>(products.slice(0, 3));

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в вашу корзину`,
      duration: 3000,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="relative flex h-[70vh] items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')" }}
          >
            <div className="container text-center">
              <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                Вкусные торты на заказ
              </h1>
              <p className="mb-8 text-xl text-white/90">
                Свежие и ароматные торты для любого праздника
              </p>
              <Button asChild size="lg" className="font-semibold">
                <Link to="/catalog">Смотреть каталог</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold">Популярные торты</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Наши самые популярные и вкусные торты, которые порадуют вас и ваших близких
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/catalog">Смотреть все торты</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="bg-muted py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold">Почему выбирают нас</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Мы гордимся качеством наших тортов и нашим обслуживанием
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg bg-background p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  🧁
                </div>
                <h3 className="mb-2 text-xl font-semibold">Свежие ингредиенты</h3>
                <p className="text-muted-foreground">
                  Мы используем только самые свежие и качественные ингредиенты
                </p>
              </div>
              
              <div className="rounded-lg bg-background p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  🚚
                </div>
                <h3 className="mb-2 text-xl font-semibold">Быстрая доставка</h3>
                <p className="text-muted-foreground">
                  Доставляем заказы в течение 24 часов по всему городу
                </p>
              </div>
              
              <div className="rounded-lg bg-background p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  🎂
                </div>
                <h3 className="mb-2 text-xl font-semibold">Индивидуальный подход</h3>
                <p className="text-muted-foreground">
                  Создаем торты по вашим пожеланиям и предпочтениям
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
