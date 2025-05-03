
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, Cake, Tag, ShoppingBag, 
  MessageSquare, Users, PieChart, Settings, 
  HelpCircle, Activity
} from "lucide-react";

import AdminHeader from "./layout/AdminHeader";
import AdminSidebar from "./layout/AdminSidebar";
import SystemStatusIndicator from "./layout/SystemStatusIndicator";
import { AdminLayoutProvider, useAdminLayout } from "./context/AdminLayoutContext";
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

  // Навигационные пункты
  const navItems: AdminNavItem[] = [
    { name: "Дашборд", path: "", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { name: "Товары", path: "products", icon: <Cake className="mr-2 h-4 w-4" />, badge: 2 },
    { name: "Категории", path: "categories", icon: <Tag className="mr-2 h-4 w-4" /> },
    { name: "Заказы", path: "orders", icon: <ShoppingBag className="mr-2 h-4 w-4" />, badge: notifications.filter(n => n.type === 'order' && !n.read).length || undefined },
    { name: "Отзывы", path: "reviews", icon: <MessageSquare className="mr-2 h-4 w-4" />, badge: notifications.filter(n => n.type === 'review' && !n.read).length || undefined },
    { name: "Пользователи", path: "users", icon: <Users className="mr-2 h-4 w-4" /> },
    { name: "Аналитика", path: "analytics", icon: <PieChart className="mr-2 h-4 w-4" /> },
    { name: "Активность", path: "activity", icon: <Activity className="mr-2 h-4 w-4" /> },
  ];

  // Пункты настроек
  const settingsItems: AdminNavItem[] = [
    { name: "Настройки", path: "settings", icon: <Settings className="mr-2 h-4 w-4" /> },
    { name: "Справка", path: "help", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Верхняя панель */}
      <AdminHeader 
        currentUser={currentUser}
        navItems={navItems}
        settingsItems={settingsItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isActive={isActive}
      />

      {/* Основной контент с боковой навигацией */}
      <div className="container grid flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        {/* Боковая навигация (видимая только на десктопах) */}
        <AdminSidebar 
          navItems={navItems}
          settingsItems={settingsItems}
          isActive={isActive}
          systemInfo={systemInfo}
          onUpdateSystem={handleUpdateSystem}
        />

        {/* Основной контент */}
        <main className="flex-1 p-6">
          {children}
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
    <AdminLayoutProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminLayoutProvider>
  );
};

export default AdminLayout;
