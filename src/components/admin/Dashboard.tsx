
import { CreditCard, ShoppingBag, Package, Users, HardDrive, Coffee, CircleAlert } from "lucide-react";
import StatsCard from "./StatsCard";
import SalesChart from "./SalesChart";
import CategoryPieChart from "./CategoryPieChart";
import PopularProductsCard from "./PopularProductsCard";
import RecentOrdersCard from "./RecentOrdersCard";
import InfoCard from "./InfoCard";
import { useNavigate } from "react-router-dom";

// Типы данных для компонентов
interface DashboardProps {
  salesData: Array<{ name: string; sales: number; visitors: number }>;
  categoryData: Array<{ name: string; value: number; fill: string }>;
  popularProducts: Array<{ id: number; name: string; sales: number; stock: number; trend: number }>;
  recentOrders: Array<{ id: number; customer: string; date: string; status: 'new' | 'processing' | 'completed' | 'cancelled'; total: number }>;
}

const Dashboard = ({ salesData, categoryData, popularProducts, recentOrders }: DashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Выручка за сегодня"
          value="24,500 ₽"
          description="+5.2% с вчерашнего дня"
          icon={<CreditCard className="h-4 w-4" />}
          trend={5.2}
        />
        <StatsCard
          title="Заказов за сегодня"
          value="8"
          description="+2 с вчерашнего дня"
          icon={<ShoppingBag className="h-4 w-4" />}
          trend={33.3}
        />
        <StatsCard
          title="Товаров на складе"
          value="54"
          description="-3 с прошлой недели"
          icon={<Package className="h-4 w-4" />}
          trend={-5.5}
        />
        <StatsCard
          title="Активных клиентов"
          value="32"
          description="+4 с прошлой недели"
          icon={<Users className="h-4 w-4" />}
          trend={14.3}
        />
      </div>

      {/* Графики и таблицы */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* График продаж */}
        <div className="lg:col-span-4">
          <SalesChart 
            data={salesData} 
            onPeriodChange={(period) => console.log(`Changed period to: ${period}`)}
          />
        </div>

        {/* Распределение по категориям */}
        <div className="lg:col-span-3">
          <CategoryPieChart 
            data={categoryData} 
            onDetailsClick={() => navigate('/admin/analytics')}
          />
        </div>
      </div>

      {/* Популярные товары и последние заказы */}
      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <PopularProductsCard 
            products={popularProducts} 
            onAddClick={() => navigate('/admin/products/new')}
            onViewAllClick={() => navigate('/admin/products')}
          />
        </div>

        <div className="md:col-span-3">
          <RecentOrdersCard 
            orders={recentOrders} 
            onViewAllClick={() => navigate('/admin/orders')}
          />
        </div>
      </div>

      {/* Информационные карточки */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard 
          icon={<HardDrive className="h-8 w-8 text-blue-500" />} 
          title="Резервное копирование" 
          description="Последнее резервное копирование: 01.05.2025"
          actionLabel="Создать резервную копию"
          onClick={() => console.log("Backup initiated")}
        />
        <InfoCard 
          icon={<Coffee className="h-8 w-8 text-amber-500" />} 
          title="Техническое обслуживание" 
          description="Запланировано: 15.05.2025, 03:00"
          actionLabel="Изменить расписание"
          onClick={() => console.log("Maintenance schedule updated")}
        />
        <InfoCard 
          icon={<CircleAlert className="h-8 w-8 text-red-500" />} 
          title="Низкий запас товаров" 
          description="3 товара заканчиваются на складе"
          actionLabel="Просмотреть товары"
          onClick={() => navigate('/admin/products?filter=low-stock')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
