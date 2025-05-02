
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "@/components/ProductCard";
import CatalogPagination from "./CatalogPagination";

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onAddToCart: (product: Product) => void;
  onResetFilters: () => void;
  activeFiltersDescription: string;
}

const ProductGrid = ({
  products,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onAddToCart,
  onResetFilters,
  activeFiltersDescription
}: ProductGridProps) => {
  return (
    <div className="md:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Показано {products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, totalCount)} из {totalCount} тортов
        </p>
        <p className="text-sm font-medium">{activeFiltersDescription}</p>
      </div>
      
      {products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <div className="text-4xl">🍰</div>
          <h3 className="mt-4 text-xl font-semibold">Торты не найдены</h3>
          <p className="mt-2 text-center text-muted-foreground">
            К сожалению, торты по заданным критериям не найдены
          </p>
          <Button
            className="mt-4"
            onClick={onResetFilters}
          >
            Сбросить все фильтры
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
          
          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductGrid;
