
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";

// Расширяем категории для демо
type Category = 'all' | 'chocolate' | 'fruit' | 'classic' | 'wedding' | 'kids';

// Добавляем больше типов для категорий
const categories: { id: Category; name: string }[] = [
  { id: 'all', name: 'Все торты' },
  { id: 'chocolate', name: 'Шоколадные' },
  { id: 'fruit', name: 'Фруктовые' },
  { id: 'classic', name: 'Классические' },
  { id: 'wedding', name: 'Свадебные' },
  { id: 'kids', name: 'Детские' }
];

// Добавляем типы сортировки
const sortOptions = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name-asc', label: 'Название: А-Я' },
  { value: 'name-desc', label: 'Название: Я-А' },
];

// Расширяем список демо-продуктов для пагинации
const expandedProducts = [
  ...products,
  {
    id: 7,
    name: "Свадебный торт",
    description: "Элегантный многоярусный торт, идеально подходящий для свадебного торжества. Украшен кремовыми цветами и перламутровыми элементами.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1535254973040-607b474d7f5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    category: 'wedding' as Category
  },
  {
    id: 8,
    name: "Детский торт",
    description: "Яркий и веселый торт для детского праздника. Украшен сказочными персонажами и конфетами.",
    price: 1600,
    image: "https://images.unsplash.com/photo-1557979619-445218f326b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'kids' as Category
  },
  {
    id: 9,
    name: "Торт Красный бархат",
    description: "Насыщенный красный бисквит с нежным сливочным кремом. Яркий вкус и необычный вид.",
    price: 1700,
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'classic' as Category
  },
  {
    id: 10,
    name: "Фисташковый торт",
    description: "Нежный фисташковый бисквит с кремом на основе натуральной фисташковой пасты.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1567954357754-b144384c0dcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'classic' as Category
  },
  {
    id: 11,
    name: "Лимонный торт",
    description: "Освежающий лимонный бисквит с кремом и цедрой. Идеален для летнего чаепития.",
    price: 1400,
    image: "https://images.unsplash.com/photo-1592189252784-8e88f42dc9b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'fruit' as Category
  },
  {
    id: 12,
    name: "Шоколадный муссовый торт",
    description: "Легкий шоколадный мусс на тонком бисквите. Тает во рту и оставляет незабываемые впечатления.",
    price: 1600,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'chocolate' as Category
  },
];

// Добавляем категорию к каждому продукту
const categorizedProducts: (Product & { category: Category })[] = [
  { ...products[0], category: 'chocolate' },
  { ...products[1], category: 'fruit' },
  { ...products[2], category: 'classic' },
  { ...products[3], category: 'classic' },
  { ...products[4], category: 'classic' },
  { ...products[5], category: 'classic' },
  ...expandedProducts.slice(6) as (Product & { category: Category })[]
];

interface FilterState {
  category: Category;
  priceRange: [number, number];
  search: string;
  sort: string;
  specialFilters: string[];
}

const Catalog = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 6000],
    search: '',
    sort: 'relevance',
    specialFilters: []
  });
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Находим мин/макс цену для слайдера
  const minMaxPrice = useMemo(() => {
    const prices = categorizedProducts.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, []);

  // Инициализация фильтра цены при первой загрузке
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minMaxPrice.min, minMaxPrice.max]
    }));
  }, [minMaxPrice.min, minMaxPrice.max]);

  // Применяем все фильтры
  const filteredProducts = useMemo(() => {
    let result = [...categorizedProducts];
    
    // Фильтрация по категории
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Фильтрация по цене
    result = result.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Поиск по названию или описанию
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Дополнительные фильтры
    if (filters.specialFilters.includes('inStock')) {
      // Имитация фильтра "в наличии" - просто для демо берем случайные элементы
      result = result.filter(product => product.id % 2 === 0);
    }
    
    // Сортировка
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // По умолчанию (relevance) - оставляем как есть
    }
    
    return result;
  }, [filters]);
  
  // Рассчитываем пагинацию
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в вашу корзину`,
      duration: 3000,
    });
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [minMaxPrice.min, minMaxPrice.max],
      search: '',
      sort: 'relevance',
      specialFilters: []
    });
  };

  const updatePriceRange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const toggleSpecialFilter = (filter: string) => {
    setFilters(prev => {
      const currentFilters = [...prev.specialFilters];
      const filterIndex = currentFilters.indexOf(filter);
      
      if (filterIndex === -1) {
        currentFilters.push(filter);
      } else {
        currentFilters.splice(filterIndex, 1);
      }
      
      return {
        ...prev,
        specialFilters: currentFilters
      };
    });
  };

  // Создаем массив страниц для пагинации
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  // Создаем строку для мета-описания активных фильтров
  const getActiveFiltersDescription = () => {
    const parts = [];
    
    if (filters.category !== 'all') {
      const categoryName = categories.find(c => c.id === filters.category)?.name;
      parts.push(categoryName);
    }
    
    if (filters.search) {
      parts.push(`поиск "${filters.search}"`);
    }
    
    if (filters.priceRange[0] > minMaxPrice.min || filters.priceRange[1] < minMaxPrice.max) {
      parts.push(`цена ${filters.priceRange[0]} - ${filters.priceRange[1]} ₽`);
    }
    
    if (parts.length === 0) return "Все торты";
    return parts.join(", ");
  };

  const FiltersSidebar = () => (
    <Card className="h-fit p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Фильтры</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          Сбросить все
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <Accordion type="multiple" className="w-full" defaultValue={["category", "price", "special"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Категории</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={filters.category === category.id}
                    onCheckedChange={() => 
                      setFilters({ ...filters, category: category.id })
                    }
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Цена</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="pt-4">
                <Slider
                  min={minMaxPrice.min}
                  max={minMaxPrice.max}
                  step={100}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={updatePriceRange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">{filters.priceRange[0]} ₽</div>
                <div className="text-sm">{filters.priceRange[1]} ₽</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="special">
          <AccordionTrigger>Дополнительно</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-inStock"
                  checked={filters.specialFilters.includes('inStock')}
                  onCheckedChange={() => toggleSpecialFilter('inStock')}
                />
                <Label htmlFor="filter-inStock" className="cursor-pointer">
                  В наличии
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );

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
        
        {/* Search and Filters */}
        <section className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск тортов..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                  onClick={() => setFilters({ ...filters, search: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="whitespace-nowrap text-sm font-medium">
                  Сортировать:
                </Label>
                <Select
                  value={filters.sort}
                  onValueChange={(value) => setFilters({ ...filters, sort: value })}
                >
                  <SelectTrigger id="sort" className="w-[180px]">
                    <SelectValue placeholder="Сортировать по" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Mobile Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto md:hidden"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Фильтры
              </Button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(filters.category !== 'all' || 
           filters.search || 
           filters.priceRange[0] > minMaxPrice.min || 
           filters.priceRange[1] < minMaxPrice.max ||
           filters.specialFilters.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Активные фильтры:</span>
              
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === filters.category)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => setFilters({ ...filters, category: 'all' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Поиск: {filters.search}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => setFilters({ ...filters, search: '' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(filters.priceRange[0] > minMaxPrice.min || 
                filters.priceRange[1] < minMaxPrice.max) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Цена: {filters.priceRange[0]} - {filters.priceRange[1]} ₽
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => setFilters({ 
                      ...filters, 
                      priceRange: [minMaxPrice.min, minMaxPrice.max] 
                    })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.specialFilters.includes('inStock') && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  В наличии
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => toggleSpecialFilter('inStock')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-8 text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                Сбросить все фильтры
              </Button>
            </div>
          )}
        </section>
        
        {/* Mobile Filters (Показываем только на мобильных) */}
        {mobileFiltersOpen && (
          <div className="container mb-6 md:hidden">
            <FiltersSidebar />
          </div>
        )}
        
        {/* Main Content */}
        <section className="container pb-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Filters Sidebar (Desktop) */}
            <div className="hidden md:block">
              <FiltersSidebar />
            </div>
            
            {/* Products Grid */}
            <div className="md:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Показано {currentProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} из {filteredProducts.length} тортов
                </p>
                <p className="text-sm font-medium">{getActiveFiltersDescription()}</p>
              </div>
              
              {currentProducts.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed py-12">
                  <div className="text-4xl">🍰</div>
                  <h3 className="mt-4 text-xl font-semibold">Торты не найдены</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    К сожалению, торты по заданным критериям не найдены
                  </p>
                  <Button
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Сбросить все фильтры
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {currentProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {getPageNumbers().map((page, i) => 
                          page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page as number);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
