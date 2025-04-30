
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";

type Category = 'all' | 'chocolate' | 'fruit' | 'classic';

const categories: { id: Category; name: string }[] = [
  { id: 'all', name: 'Все торты' },
  { id: 'chocolate', name: 'Шоколадные' },
  { id: 'fruit', name: 'Фруктовые' },
  { id: 'classic', name: 'Классические' }
];

// Добавляем категорию к каждому продукту
const categorizedProducts: (Product & { category: Category })[] = [
  { ...products[0], category: 'chocolate' },
  { ...products[1], category: 'fruit' },
  { ...products[2], category: 'classic' },
  { ...products[3], category: 'classic' },
  { ...products[4], category: 'classic' },
  { ...products[5], category: 'classic' },
];

const Catalog = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredProducts = activeCategory === 'all' 
    ? categorizedProducts 
    : categorizedProducts.filter(product => product.category === activeCategory);

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
        {/* Hero Banner */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="relative flex h-[40vh] items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}
          >
            <div className="container text-center">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Каталог тортов
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-white/90">
                Выберите торт на любой вкус для вашего особого события
              </p>
            </div>
          </div>
        </section>
        
        {/* Category Filter */}
        <section className="py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="min-w-24"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Products Grid */}
        <section className="py-8">
          <div className="container">
            {filteredProducts.length === 0 ? (
              <div className="mx-auto my-16 max-w-md text-center">
                <h3 className="text-xl font-semibold">Торты не найдены</h3>
                <p className="mt-2 text-muted-foreground">
                  К сожалению, в этой категории пока нет тортов
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveCategory('all')}
                >
                  Показать все торты
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
