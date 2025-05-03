
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

interface DashboardLayoutSectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
};

// Компонент для основной части дашборда (занимает 2/3 или всю ширину)
const DashboardLayoutMain = ({ children, className }: DashboardLayoutSectionProps) => {
  return (
    <div className={cn("col-span-3", className)}>
      {children}
    </div>
  );
};

// Компонент для боковой части дашборда (занимает 1/3 ширины)
const DashboardLayoutSide = ({ children, className }: DashboardLayoutSectionProps) => {
  return (
    <div className={cn("col-span-1", className)}>
      {children}
    </div>
  );
};

// Компонент для содержимого дашборда, разделенного на основную и боковую часть
const DashboardLayoutContent = ({ children, className }: DashboardLayoutSectionProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {children}
    </div>
  );
};

// Компонент для карточки дашборда с кастомными стилями
const DashboardCard = ({ 
  children, 
  className,
  containerClassName
}: DashboardLayoutSectionProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn("p-6", containerClassName)}>
        {children}
      </div>
    </Card>
  );
};

// Компонент для секции дашборда, которая занимает всю ширину
const DashboardLayoutFullWidth = ({ children, className }: DashboardLayoutSectionProps) => {
  return (
    <div className={cn("col-span-1 md:col-span-4", className)}>
      {children}
    </div>
  );
};

// Компонент для организации элементов в сетку
const DashboardLayoutGrid = ({ 
  children, 
  className, 
  containerClassName 
}: DashboardLayoutSectionProps) => {
  return (
    <div className={cn("grid gap-6", className)}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", containerClassName)}>
        {children}
      </div>
    </div>
  );
};

// Экспорт всех компонентов как части одного объекта
DashboardLayout.Main = DashboardLayoutMain;
DashboardLayout.Side = DashboardLayoutSide;
DashboardLayout.Content = DashboardLayoutContent;
DashboardLayout.Card = DashboardCard;
DashboardLayout.FullWidth = DashboardLayoutFullWidth;
DashboardLayout.Grid = DashboardLayoutGrid;

export default DashboardLayout;
