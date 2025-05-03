
import { useState, useEffect, useCallback } from 'react';
import { useAdminLayout } from '../context/AdminLayoutContext';

interface SearchOptions<T> {
  data: T[];
  searchFields: Array<keyof T>;
  initialFilters?: Record<string, any>;
}

const useAdminSearch = <T extends Record<string, any>>({ 
  data, 
  searchFields,
  initialFilters = {}
}: SearchOptions<T>) => {
  const { searchQuery } = useAdminLayout();
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Обновляем фильтр
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Сбрасываем все фильтры
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Настраиваем сортировку
  const requestSort = useCallback((key: keyof T) => {
    setSortConfig(prev => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  }, []);

  // Функция для проверки, соответствует ли элемент всем фильтрам
  const matchesFilters = useCallback((item: T) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === '' || value === null || value === undefined) return true;
      
      // Специальная обработка для диапазонов (для числовых значений)
      if (typeof value === 'object' && ('min' in value || 'max' in value)) {
        const numVal = Number(item[key]);
        if ('min' in value && value.min !== '' && value.min !== null && numVal < value.min) return false;
        if ('max' in value && value.max !== '' && value.max !== null && numVal > value.max) return false;
        return true;
      }
      
      // Для массивов проверяем вхождение элемента
      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        return value.includes(item[key]);
      }
      
      // Специальная обработка для дат
      if (value instanceof Date && item[key] instanceof Date) {
        return item[key].toDateString() === value.toDateString();
      }
      
      // Для обычных значений делаем прямое сравнение или поиск по строке
      if (typeof item[key] === 'string') {
        return item[key].toLowerCase().includes(value.toString().toLowerCase());
      }
      
      return item[key] === value;
    });
  }, [filters]);

  // Применяем поиск, фильтры и сортировку
  useEffect(() => {
    let result = [...data];
    
    // Применяем поиск по тексту
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowercasedQuery);
          }
          if (typeof value === 'number') {
            return value.toString().includes(lowercasedQuery);
          }
          return false;
        })
      );
    }
    
    // Применяем фильтры
    result = result.filter(matchesFilters);
    
    // Применяем сортировку
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
  }, [data, searchQuery, filters, sortConfig, searchFields, matchesFilters]);

  return {
    filteredData,
    updateFilter,
    resetFilters,
    requestSort,
    sortConfig,
    filters
  };
};

export default useAdminSearch;
