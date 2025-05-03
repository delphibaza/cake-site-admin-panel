
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, Cake, Tag, ShoppingBag, 
  MessageSquare, Users, PieChart, Settings, 
  HelpCircle, Activity, LineChart, List, BookOpen
} from "lucide-react";

import AdminHeader from "./layout/AdminHeader";
import AdminSidebar from "./layout/AdminSidebar";
import SystemStatusIndicator from "./layout/SystemStatusIndicator";
import { AdminLayoutProvider, useAdminLayout } from "./context/AdminLayoutContext";
import { AdminThemeProvider } from "./AdminThemeProvider";
import type { AdminNavItem } from "./types/admin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Компонент внутренней реализации администраторской панели
const AdminLayoutContent = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { 
    notifications, 
    markAllNotificationsAsRead,
    currentPath,
    searchQuery,
    setSearchQuery,
    systemInfo,
    updateSystem
  } = useAdminLayout();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'active' | 'warning' | 'error' | 'loading'>('active');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  // Сохранение состояния свернутости сайдбара
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Навигационные пункты
  const navItems: AdminNavItem[] = [
    { 
      name: "Дашборд", 
      path: "", 
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: "Обзор и статистика"
    },
    { 
      name: "Товары", 
      path: "products", 
      icon: <Cake className="h-4 w-4" />, 
      badge: 2,
      description: "Управление товарами"
    },
    { 
      name: "Категории", 
      path: "categories", 
      icon: <Tag className="h-4 w-4" />,
      description: "Управление категориями"
    },
    { 
      name: "Заказы", 
      path: "orders", 
      icon: <ShoppingBag className="h-4 w-4" />, 
      badge: notifications.filter(n => n.type === 'order' && !n.read).length || undefined,
      description: "Заказы клиентов"
    },
    { 
      name: "Отзывы", 
      path: "reviews", 
      icon: <MessageSquare className="h-4 w-4" />, 
      badge: notifications.filter(n => n.type === 'review' && !n.read).length || undefined,
      description: "Отзывы клиентов"
    },
    { 
      name: "Пользователи", 
      path: "users", 
      icon: <Users className="h-4 w-4" />,
      description: "Учетные записи"
    },
  ];

  // Пункты аналитики и отчетов
  const analyticsItems: AdminNavItem[] = [
    { 
      name: "Аналитика", 
      path: "analytics", 
      icon: <PieChart className="h-4 w-4" />,
      description: "Статистика и графики"
    },
    { 
      name: "Отчеты", 
      path: "reports", 
      icon: <LineChart className="h-4 w-4" />,
      description: "Финансовые отчеты"
    },
    { 
      name: "Активность", 
      path: "activity", 
      icon: <Activity className="h-4 w-4" />,
      description: "Журнал действий"
    },
  ];

  // Пункты настроек
  const settingsItems: AdminNavItem[] = [
    { 
      name: "Настройки", 
      path: "settings", 
      icon: <Settings className="h-4 w-4" />,
      description: "Параметры системы"
    },
    { 
      name: "Справка", 
      path: "help", 
      icon: <HelpCircle className="h-4 w-4" />,
      description: "Документация"
    },
    { 
      name: "Каталог", 
      path: "catalog-settings", 
      icon: <List className="h-4 w-4" />,
      description: "Настройки каталога"
    },
    { 
      name: "Руководство", 
      path: "manual", 
      icon: <BookOpen className="h-4 w-4" />,
      description: "Инструкции"
    },
  ];

  // Проверка авторизации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Имитация периодической проверки статуса сервера
  useEffect(() => {
    const checkServerStatus = () => {
      // В реальном приложении здесь был бы API-запрос
      const statuses: Array<'active' | 'warning' | 'error' | 'loading'> = ['active', 'active', 'active', 'warning', 'active'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setServerStatus(randomStatus);
    };

    // Первичная проверка
    checkServerStatus();

    // Периодическая проверка каждые 30 секунд
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  // Определение активного пункта навигации
  const isActive = (path: string) => {
    return path === currentPath || (path === "" && currentPath === "dashboard");
  };

  const handleUpdateSystem = async () => {
    setServerStatus('loading');
    try {
      await updateSystem();
      setServerStatus('active');
    } catch (error) {
      setServerStatus('error');
      console.error('Failed to update system:', error);
    }
  };

  // Обработчик для сворачивания/разворачивания сайдбара
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Комбинируем все навигационные элементы для передачи в мобильное меню
  const allNavItems = [...navItems, ...analyticsItems, ...settingsItems];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/80">
      {/* Верхняя панель */}
      <AdminHeader 
        currentUser={currentUser}
        navItems={allNavItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isActive={isActive}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />

      {/* Основной контент с боковой навигацией */}
      <div className={`grid flex-1 transition-all duration-300 ${
        isCollapsed 
          ? "md:grid-cols-[64px_1fr]" 
          : "md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]"
      }`}>
        {/* Боковая навигация (видимая только на десктопах) */}
        <AdminSidebar 
          mainNavItems={navItems}
          analyticsItems={analyticsItems}
          settingsItems={settingsItems}
          isActive={isActive}
          systemInfo={systemInfo}
          onUpdateSystem={handleUpdateSystem}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleSidebar}
        />

        {/* Основной контент */}
        <main className="flex-1 p-4 md:p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Индикатор активности сервера */}
      <SystemStatusIndicator status={serverStatus} />
    </div>
  );
};

// Публичный компонент с контекстом
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AdminThemeProvider>
      <AdminLayoutProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminLayoutProvider>
    </AdminThemeProvider>
  );
};

export default AdminLayout;
