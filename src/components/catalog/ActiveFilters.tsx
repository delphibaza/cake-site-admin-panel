
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Category, categories } from "./CategoryFilter";

interface ActiveFiltersProps {
  filters: {
    category: Category;
    priceRange: [number, number];
    search: string;
    specialFilters: string[];
  };
  priceMinMax: {
    min: number;
    max: number;
  };
  onResetCategory: () => void;
  onResetSearch: () => void;
  onResetPrice: () => void;
  onToggleSpecialFilter: (filter: string) => void;
  onResetAll: () => void;
}

const ActiveFilters = ({
  filters,
  priceMinMax,
  onResetCategory,
  onResetSearch,
  onResetPrice,
  onToggleSpecialFilter,
  onResetAll
}: ActiveFiltersProps) => {
  
  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.search || 
    filters.priceRange[0] > priceMinMax.min || 
    filters.priceRange[1] < priceMinMax.max ||
    filters.specialFilters.length > 0;
    
  if (!hasActiveFilters) return null;
  
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Активные фильтры:</span>
      
      {filters.category !== 'all' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {categories.find(c => c.id === filters.category)?.name}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={onResetCategory}
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
            onClick={onResetSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {(filters.priceRange[0] > priceMinMax.min || 
        filters.priceRange[1] < priceMinMax.max) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Цена: {filters.priceRange[0]} - {filters.priceRange[1]} ₽
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={onResetPrice}
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
            onClick={() => onToggleSpecialFilter('inStock')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto h-8 text-muted-foreground hover:text-foreground"
        onClick={onResetAll}
      >
        Сбросить все фильтры
      </Button>
    </div>
  );
};

export default ActiveFilters;
