
import { useState, useMemo, useEffect } from "react";
import { Product } from "@/components/ProductCard";
import { Category } from "@/components/catalog/CategoryFilter";

// Типы данных для фильтрации
export interface FilterState {
  category: Category;
  priceRange: [number, number];
  search: string;
  sort: string;
  specialFilters: string[];
}

export interface CatalogProduct extends Product {
  category: Category;
}

export const useCatalogProducts = (products: CatalogProduct[]) => {
  // Находим мин/макс цену для слайдера
  const minMaxPrice = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  // Состояние фильтров
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [minMaxPrice.min, minMaxPrice.max],
    search: '',
    sort: 'relevance',
    specialFilters: []
  });
  
  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Инициализация фильтра цены при первой загрузке
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minMaxPrice.min, minMaxPrice.max]
    }));
  }, [minMaxPrice.min, minMaxPrice.max]);

  // Применяем все фильтры
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
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
  }, [filters, products]);

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

  // Обновление фильтров
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [minMaxPrice.min, minMaxPrice.max],
      search: '',
      sort: 'relevance',
      specialFilters: []
    });
  };

  // Переключение специальных фильтров
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

  return {
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
  };
};
