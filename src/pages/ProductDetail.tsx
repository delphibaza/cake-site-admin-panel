
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Truck, Calendar, ArrowLeft, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { toast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Товар не найден</h1>
            <Button asChild>
              <Link to="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Демо-данные для страницы
  const ingredients = [
    "Мука высшего сорта", "Сахар", "Натуральные яйца", "Сливочное масло", 
    "Натуральное молоко", "Шоколад высшего качества", "Свежие фрукты"
  ];
  
  const reviews = [
    { id: 1, author: "Елена", rating: 5, text: "Потрясающий торт! Очень вкусный и красивый, всем рекомендую!", date: "15.03.2025" },
    { id: 2, author: "Александр", rating: 4, text: "Отличный вкус, но доставка немного задержалась.", date: "02.04.2025" },
    { id: 3, author: "Мария", rating: 5, text: "Заказываю не первый раз, всегда великолепное качество!", date: "25.04.2025" }
  ];
  
  // Дополнительные изображения (демо)
  const additionalImages = [
    product.image,
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&q=85",
    "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?ixlib=rb-4.0.3&q=85",
  ];
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} (${quantity} шт.)`,
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад в каталог
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Галерея изображений */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {additionalImages.map((img, idx) => (
                  <div key={idx} className="aspect-square cursor-pointer rounded-md overflow-hidden border hover:border-primary">
                    <img src={img} alt={`${product.name} вид ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Информация о продукте */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2 space-x-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                  <span className="text-sm ml-2 text-muted-foreground">(42 отзыва)</span>
                </div>
              </div>
              
              <div>
                <p className="text-3xl font-bold">{product.price.toLocaleString("ru-RU")} ₽</p>
                <Badge variant="outline" className="mt-2">В наличии</Badge>
              </div>
              
              <p className="text-muted-foreground">{product.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-28">
                    <Input 
                      type="number" 
                      min="1"
                      value={quantity} 
                      onChange={handleQuantityChange}
                    />
                  </div>
                  <Button onClick={handleAddToCart} className="flex-1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    В корзину
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Доставка по городу в течение 3 часов</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Можно заказать на определенную дату и время</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Подробная информация */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="ingredients">Состав</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <h2 className="text-2xl font-semibold">О торте {product.name}</h2>
                <p>
                  {product.description} Этот торт идеально подойдет для любого праздника или особого случая. 
                  Наши кондитеры готовят его вручную, используя только натуральные ингредиенты высшего качества.
                </p>
                <p>
                  Торт может быть украшен по вашему желанию. Вы можете заказать индивидуальное оформление, 
                  добавить надпись или выбрать особый дизайн.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Пищевая ценность (на 100г)</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Калории</span>
                        <span>350 ккал</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Белки</span>
                        <span>5.3 г</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Жиры</span>
                        <span>18.7 г</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Углеводы</span>
                        <span>42.1 г</span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Характеристики</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Вес</span>
                        <span>1.5 кг</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Диаметр</span>
                        <span>24 см</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Порций</span>
                        <span>10-12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок хранения</span>
                        <span>72 часа (при +4°C)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ingredients">
                <h2 className="text-2xl font-semibold mb-4">Состав торта</h2>
                <div className="space-y-4">
                  <p>Мы используем только натуральные ингредиенты высшего качества:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Все ингредиенты проходят строгий контроль качества. Возможно присутствие аллергенов: 
                    глютен, молочные продукты, яйца, орехи.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Отзывы покупателей</h2>
                    <Button>Оставить отзыв</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <Card key={review.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{review.author}</h3>
                            <div className="flex mt-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="mt-2">{review.text}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Сопутствующие товары */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Вам также может понравиться</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 font-medium">{p.name}</h3>
                  <p className="font-bold">{p.price.toLocaleString("ru-RU")} ₽</p>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
