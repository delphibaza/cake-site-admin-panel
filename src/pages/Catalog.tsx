
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { CatalogProduct, useCatalogProducts } from "@/hooks/useCatalogProducts";
import { Category } from "@/components/catalog/CategoryFilter";
import { getActiveFiltersDescription } from "@/utils/catalogUtils";

// Импорт компонентов каталога
import CatalogHero from "@/components/catalog/CatalogHero";
import SearchAndSort from "@/components/catalog/SearchAndSort";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import FiltersSidebar from "@/components/catalog/FiltersSidebar";
import ProductGrid from "@/components/catalog/ProductGrid";

// Расширенный список демо-продуктов для пагинации
import { products } from "@/data/products";

// Дополнительные продукты для демонстрации
const expandedProducts = [
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
const categorizedProducts: CatalogProduct[] = [
  { ...products[0], category: 'chocolate' },
  { ...products[1], category: 'fruit' },
  { ...products[2], category: 'classic' },
  { ...products[3], category: 'classic' },
  { ...products[4], category: 'classic' },
  { ...products[5], category: 'classic' },
  ...expandedProducts.slice(0) as CatalogProduct[]
];

const Catalog = () => {
  const { toast } = useToast();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Используем хук для работы с данными каталога
  const {
    filters,
    currentPage,
    filteredProducts,
    currentProducts,
    totalPages,
    minMaxPrice,
    itemsPerPage,
    updateFilters,
    setCurrentPage,
    resetFilters,
    toggleSpecialFilter
  } = useCatalogProducts(categorizedProducts);

  // Обработчики действий
  const handleAddToCart = (product: Product) => {
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в вашу корзину`,
      duration: 3000,
    });
  };

  const handleUpdatePrice = (value: [number, number]) => {
    updateFilters({ priceRange: value });
  };

  // Активные фильтры для отображения
  const activeFiltersDescription = getActiveFiltersDescription(
    filters.category,
    filters.search,
    filters.priceRange,
    minMaxPrice.min,
    minMaxPrice.max
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <CatalogHero 
          title="Каталог тортов" 
          description="Выберите торт на любой вкус для вашего особого события"
          backgroundImage="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        />
        
        {/* Search and Filters */}
        <section className="container py-8">
          <SearchAndSort 
            searchQuery={filters.search}
            sortOption={filters.sort}
            onSearchChange={(query) => updateFilters({ search: query })}
            onSortChange={(value) => updateFilters({ sort: value })}
            onToggleMobileFilters={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          />
          
          <ActiveFilters 
            filters={filters}
            priceMinMax={minMaxPrice}
            onResetCategory={() => updateFilters({ category: 'all' })}
            onResetSearch={() => updateFilters({ search: '' })}
            onResetPrice={() => updateFilters({ priceRange: [minMaxPrice.min, minMaxPrice.max] })}
            onToggleSpecialFilter={toggleSpecialFilter}
            onResetAll={resetFilters}
          />
        </section>
        
        {/* Mobile Filters (показываем только на мобильных) */}
        {mobileFiltersOpen && (
          <div className="container mb-6 md:hidden">
            <FiltersSidebar 
              filters={filters}
              priceMinMax={minMaxPrice}
              onCategoryChange={(category) => updateFilters({ category })}
              onPriceChange={handleUpdatePrice}
              onSpecialFilterToggle={toggleSpecialFilter}
              onReset={resetFilters}
            />
          </div>
        )}
        
        {/* Main Content */}
        <section className="container pb-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Filters Sidebar (Desktop) */}
            <div className="hidden md:block">
              <FiltersSidebar 
                filters={filters}
                priceMinMax={minMaxPrice}
                onCategoryChange={(category) => updateFilters({ category })}
                onPriceChange={handleUpdatePrice}
                onSpecialFilterToggle={toggleSpecialFilter}
                onReset={resetFilters}
              />
            </div>
            
            {/* Products Grid */}
            <ProductGrid 
              products={currentProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onAddToCart={handleAddToCart}
              onResetFilters={resetFilters}
              activeFiltersDescription={activeFiltersDescription}
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
