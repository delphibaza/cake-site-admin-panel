
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import CategoryFilter, { Category } from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import SpecialFilters from "./SpecialFilters";

interface FiltersSidebarProps {
  filters: {
    category: Category;
    priceRange: [number, number];
    specialFilters: string[];
  };
  priceMinMax: {
    min: number;
    max: number;
  };
  onCategoryChange: (category: Category) => void;
  onPriceChange: (range: [number, number]) => void;
  onSpecialFilterToggle: (filter: string) => void;
  onReset: () => void;
}

const FiltersSidebar = ({
  filters,
  priceMinMax,
  onCategoryChange,
  onPriceChange,
  onSpecialFilterToggle,
  onReset
}: FiltersSidebarProps) => {
  return (
    <Card className="h-fit p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Фильтры</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onReset}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          Сбросить все
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <Accordion type="multiple" className="w-full" defaultValue={["category", "price", "special"]}>
        <CategoryFilter 
          selectedCategory={filters.category} 
          onChange={onCategoryChange} 
        />
        
        <PriceFilter
          minPrice={priceMinMax.min}
          maxPrice={priceMinMax.max}
          currentRange={filters.priceRange}
          onChange={onPriceChange}
        />
        
        <SpecialFilters
          selectedFilters={filters.specialFilters}
          onToggle={onSpecialFilterToggle}
        />
      </Accordion>
    </Card>
  );
};

export default FiltersSidebar;
