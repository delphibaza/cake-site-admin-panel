
import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const sortOptions = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name-asc', label: 'Название: А-Я' },
  { value: 'name-desc', label: 'Название: Я-А' },
];

interface SearchAndSortProps {
  searchQuery: string;
  sortOption: string;
  onSearchChange: (query: string) => void;
  onSortChange: (option: string) => void;
  onToggleMobileFilters: () => void;
}

const SearchAndSort = ({
  searchQuery,
  sortOption,
  onSearchChange,
  onSortChange,
  onToggleMobileFilters
}: SearchAndSortProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск тортов..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => onSearchChange('')}
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
            value={sortOption}
            onValueChange={onSortChange}
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
          onClick={onToggleMobileFilters}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Фильтры
        </Button>
      </div>
    </div>
  );
};

export default SearchAndSort;
