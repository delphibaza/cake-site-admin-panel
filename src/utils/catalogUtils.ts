
import { Category, categories } from "@/components/catalog/CategoryFilter";

// Создаем строку для мета-описания активных фильтров
export const getActiveFiltersDescription = (
  category: Category, 
  search: string, 
  priceRange: [number, number],
  minPrice: number,
  maxPrice: number
): string => {
  const parts = [];
  
  if (category !== 'all') {
    const categoryName = categories.find(c => c.id === category)?.name;
    parts.push(categoryName);
  }
  
  if (search) {
    parts.push(`поиск "${search}"`);
  }
  
  if (priceRange[0] > minPrice || priceRange[1] < maxPrice) {
    parts.push(`цена ${priceRange[0]} - ${priceRange[1]} ₽`);
  }
  
  if (parts.length === 0) return "Все торты";
  return parts.join(", ");
};
