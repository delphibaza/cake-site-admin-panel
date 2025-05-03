
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Period } from "./types/admin";

interface DashboardFiltersProps {
  onPeriodChange?: (period: Period) => void;
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onFilterChange?: (filter: string, value: string) => void;
  filters?: Array<{
    name: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
  activeFilters?: Record<string, string>;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  period?: Period;
  children?: ReactNode;
}

export default function DashboardFilters({
  onPeriodChange,
  onDateRangeChange,
  onFilterChange,
  filters = [],
  activeFilters = {},
  dateRange = { from: undefined, to: undefined },
  period = "week",
  children
}: DashboardFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Список периодов
  const periods = [
    { value: "today", label: "Сегодня" },
    { value: "yesterday", label: "Вчера" },
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
    { value: "quarter", label: "Квартал" },
    { value: "year", label: "Год" },
    { value: "custom", label: "Произвольный" }
  ] as const;

  // Функция для форматирования диапазона дат
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      if (period !== "custom") {
        // Показываем название периода
        const periodLabel = periods.find(p => p.value === period)?.label || "";
        return periodLabel;
      }
      
      // Для произвольного периода показываем даты
      return `${format(dateRange.from, "d MMM", { locale: ru })} - ${format(dateRange.to, "d MMM yyyy", { locale: ru })}`;
    }
    
    return "Выберите период";
  };

  // Обработчик изменения периода
  const handlePeriodChange = (value: string) => {
    if (onPeriodChange) {
      onPeriodChange(value as Period);
    }
    
    // Если выбран произвольный период, открываем календарь
    if (value === "custom") {
      setIsCalendarOpen(true);
    } else {
      setIsCalendarOpen(false);
    }
  };

  // Обработчик сброса всех фильтров
  const handleResetFilters = () => {
    if (onPeriodChange) {
      onPeriodChange("week");
    }
    
    if (onDateRangeChange) {
      onDateRangeChange({ from: undefined, to: undefined });
    }
    
    if (onFilterChange && filters.length > 0) {
      filters.forEach(filter => {
        onFilterChange(filter.name, "");
      });
    }
  };

  // Проверка, есть ли активные фильтры
  const hasActiveFilters = 
    period !== "week" || 
    (dateRange.from && dateRange.to) ||
    Object.values(activeFilters).some(value => value !== "");

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Селектор периода */}
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Календарь для выбора произвольного периода */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant={period === "custom" ? "default" : "outline"} 
                className="h-9"
                onClick={() => period !== "custom" && handlePeriodChange("custom")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (onDateRangeChange) {
                    onDateRangeChange(range as any);
                  }
                }}
                initialFocus
                locale={ru}
              />
            </PopoverContent>
          </Popover>

          {/* Дополнительные фильтры */}
          {filters.map((filter) => (
            <Select 
              key={filter.name}
              value={activeFilters[filter.name] || ""}
              onValueChange={(value) => onFilterChange && onFilterChange(filter.name, value)}
            >
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder={filter.name} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Кнопка очистки фильтров */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9"
              onClick={handleResetFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          )}

          {/* Дополнительные элементы */}
          {children}
        </div>

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {period !== "week" && (
              <Badge variant="secondary" className="rounded-full">
                Период: {formatDateRange()}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => onPeriodChange && onPeriodChange("week")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Сбросить период</span>
                </Button>
              </Badge>
            )}

            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              
              const filter = filters.find(f => f.name === key);
              if (!filter) return null;
              
              const option = filter.options.find(o => o.value === value);
              if (!option) return null;
              
              return (
                <Badge key={key} variant="secondary" className="rounded-full">
                  {filter.name}: {option.label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => onFilterChange && onFilterChange(key, "")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Сбросить фильтр</span>
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
