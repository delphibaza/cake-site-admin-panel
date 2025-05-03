
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Notification, AdminLayoutContextType, SystemInfo } from "../types/admin";

// Создаем контекст с начальными значениями
const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

// Начальные тестовые уведомления
const initialNotifications: Notification[] = [
  { id: 1, title: "Новый заказ #1008", message: "Оформлен новый заказ на сумму 3450 ₽", read: false, date: "1 мая 2025", type: "order", link: "/admin/orders/1008" },
  { id: 2, title: "Отзыв на товар", message: "Клиент оставил отзыв на Шоколадный торт", read: false, date: "30 апреля 2025", type: "review", link: "/admin/reviews?product=1" },
  { id: 3, title: "Остаток товара", message: "Медовик (ID: 5) заканчивается на складе", read: true, date: "29 апреля 2025", type: "stock", link: "/admin/products/5" },
];

// Начальная информация о системе
const initialSystemInfo: SystemInfo = {
  version: "1.2.0",
  lastUpdate: "01.05.2025",
  hasUpdate: true,
  updateVersion: "1.3.0"
};

interface AdminLayoutProviderProps {
  children: ReactNode;
}

export const AdminLayoutProvider = ({ children }: AdminLayoutProviderProps) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(initialSystemInfo);

  // Путь текущей страницы (без префикса /admin/)
  const currentPath = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';

  // Отметка уведомления как прочитанного
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Отметка всех уведомлений как прочитанных
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Добавление нового уведомления
  const addNotification = (notification: Omit<Notification, "id">) => {
    const newId = Math.max(0, ...notifications.map(n => n.id)) + 1;
    setNotifications(prev => [{ id: newId, ...notification }, ...prev]);
  };

  // Удаление уведомления
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Обновление системы
  const updateSystem = async (): Promise<boolean> => {
    // Имитация обновления
    return new Promise((resolve) => {
      setTimeout(() => {
        setSystemInfo({
          ...systemInfo,
          version: systemInfo.updateVersion || systemInfo.version,
          lastUpdate: new Date().toLocaleDateString('ru-RU'),
          hasUpdate: false,
          updateVersion: undefined
        });
        resolve(true);
      }, 2000);
    });
  };

  // Сохраняем уведомления в локальное хранилище при изменении
  useEffect(() => {
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Загружаем уведомления из локального хранилища при инициализации
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Ошибка при загрузке уведомлений:', e);
      }
    }
  }, []);

  const contextValue: AdminLayoutContextType = {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    removeNotification,
    currentPath,
    searchQuery,
    setSearchQuery,
    systemInfo,
    updateSystem
  };

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      {children}
    </AdminLayoutContext.Provider>
  );
};

// Хук для использования контекста
export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within a AdminLayoutProvider');
  }
  return context;
};
