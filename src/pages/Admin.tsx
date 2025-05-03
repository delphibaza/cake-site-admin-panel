
import { useEffect, useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import PageHeader from "@/components/admin/PageHeader";
import CategoryCard from "@/components/admin/CategoryCard";
import NewCategoryCard from "@/components/admin/NewCategoryCard";
import AdminTasks from "./AdminTasks";
import AdminReports from "./AdminReports";

// Демо-данные
const salesData = [
  { name: 'Пн', sales: 5400, visitors: 120 },
  { name: 'Вт', sales: 6200, visitors: 132 },
  { name: 'Ср', sales: 7800, visitors: 164 },
  { name: 'Чт', sales: 8200, visitors: 152 },
  { name: 'Пт', sales: 9100, visitors: 175 },
  { name: 'Сб', sales: 10500, visitors: 210 },
  { name: 'Вс', sales: 8900, visitors: 180 }
];

const categoryData = [
  { name: 'Шоколадные', value: 35, fill: '#8884d8' },
  { name: 'Фруктовые', value: 28, fill: '#82ca9d' },
  { name: 'Классические', value: 20, fill: '#ffc658' },
  { name: 'Свадебные', value: 12, fill: '#ff8042' },
  { name: 'Детские', value: 5, fill: '#0088fe' },
];

const popularProducts = [
  { id: 1, name: "Шоколадный торт", sales: 42, stock: 15, trend: 12 },
  { id: 2, name: "Медовик", sales: 38, stock: 8, trend: -5 },
  { id: 3, name: "Чизкейк", sales: 35, stock: 12, trend: 8 },
  { id: 4, name: "Красный бархат", sales: 28, stock: 10, trend: 15 },
];

const recentOrders = [
  { id: 1008, customer: "Иван Петров", date: "01.05.2025", status: 'new' as const, total: 2850 },
  { id: 1007, customer: "Елена Иванова", date: "30.04.2025", status: 'processing' as const, total: 3420 },
  { id: 1006, customer: "Алексей Смирнов", date: "30.04.2025", status: 'completed' as const, total: 1950 },
  { id: 1005, customer: "Мария Кузнецова", date: "29.04.2025", status: 'completed' as const, total: 4200 },
];

// Массив категорий товаров
const categories = [
  { id: 1, name: "Шоколадные", count: 5 },
  { id: 2, name: "Фруктовые", count: 3 },
  { id: 3, name: "Классические", count: 4 },
  { id: 4, name: "Свадебные", count: 2 },
  { id: 5, name: "Детские", count: 1 },
];

const Admin = () => {
  const location = useLocation();
  
  // Путь текущей страницы (без префикса /admin/)
  const currentPath = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';

  const getPageTitle = () => {
    switch (currentPath) {
      case 'dashboard':
        return 'Дашборд';
      case 'products':
        return 'Управление товарами';
      case 'categories':
        return 'Категории товаров';
      case 'orders':
        return 'Заказы';
      case 'reviews':
        return 'Отзывы клиентов';
      case 'users':
        return 'Пользователи';
      case 'analytics':
        return 'Аналитика';
      case 'tasks':
        return 'Задачи';
      case 'reports':
        return 'Отчеты';
      case 'settings':
        return 'Настройки';
      case 'help':
        return 'Справка';
      default:
        return 'Административная панель';
    }
  };

  const handleCategoryView = (id: number) => {
    console.log(`Просмотр категории: ${id}`);
  };

  const handleCategoryEdit = (id: number) => {
    console.log(`Редактирование категории: ${id}`);
  };

  const handleNewCategory = () => {
    console.log('Создание новой категории');
  };

  // Главный компонент админ-панели для конкретного маршрута
  const AdminContent = () => {
    // Содержимое панели управления
    switch (currentPath) {
      case 'dashboard':
        return (
          <>
            <PageHeader title={getPageTitle()} />
            <Dashboard 
              salesData={salesData} 
              categoryData={categoryData} 
              popularProducts={popularProducts} 
              recentOrders={recentOrders} 
            />
          </>
        );
      
      case 'categories':
        return (
          <>
            <PageHeader 
              title={getPageTitle()}
              actionLabel="Добавить категорию"
              onAction={handleNewCategory}
            />
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    id={category.id}
                    name={category.name} 
                    count={category.count} 
                    onView={handleCategoryView}
                    onEdit={handleCategoryEdit}
                  />
                ))}
                
                {/* Карточка для создания новой категории */}
                <NewCategoryCard onClick={handleNewCategory} />
              </div>
            </div>
          </>
        );
      
      case 'tasks':
      case 'reports':
        // Эти разделы обрабатываются через маршрутизацию
        return null;
      
      default:
        return (
          <>
            <PageHeader 
              title={getPageTitle()}
              actionUrl={currentPath === 'products' ? "/admin/products/new" : undefined}
              actionLabel={currentPath === 'products' ? "Добавить товар" : undefined}
            />
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                Страница находится в разработке
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <Routes>
      <Route path="tasks" element={<AdminTasks />} />
      <Route path="reports" element={<AdminReports />} />
      <Route 
        path="*" 
        element={
          <AdminLayout>
            <AdminContent />
          </AdminLayout>
        } 
      />
    </Routes>
  );
};

export default Admin;
