
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Notification, SystemInfo, AdminLayoutContextType } from "../types/admin";

// Начальное состояние контекста
const defaultAdminLayoutContext: AdminLayoutContextType = {
  notifications: [],
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  currentPath: "",
  searchQuery: "",
  setSearchQuery: () => {},
  systemInfo: {
    version: "1.0.0",
    lastUpdate: "01.05.2025",
    hasUpdate: false
  },
  updateSystem: async () => false,
  sidebarCollapsed: false,
  toggleSidebar: () => {}
};

// Создание контекста
const AdminLayoutContext = createContext<AdminLayoutContextType>(defaultAdminLayoutContext);

// Пример уведомлений
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Новый заказ",
    message: "Поступил новый заказ на сумму 3,450 ₽",
    read: false,
    date: "Только что",
    type: "order",
    link: "/admin/orders/1008"
  },
  {
    id: 2,
    title: "Товар заканчивается",
    message: "Торт 'Красный бархат' скоро закончится на складе",
    read: false,
    date: "30 минут назад",
    type: "stock",
    severity: "medium"
  },
  {
    id: 3,
    title: "Новый отзыв",
    message: "Елена оставила отзыв о торте 'Медовик'",
    read: false,
    date: "2 часа назад",
    type: "review",
    link: "/admin/reviews/25"
  },
  {
    id: 4,
    title: "Скидка активирована",
    message: "Акция 'Весенние скидки' запущена в работу",
    read: true,
    date: "5 часов назад",
    type: "system"
  },
  {
    id: 5,
    title: "Заказ доставлен",
    message: "Заказ #1005 успешно доставлен клиенту",
    read: true,
    date: "Вчера",
    type: "order"
  }
];

interface AdminLayoutProviderProps {
  children: ReactNode;
}

// Провайдер контекста
export const AdminLayoutProvider = ({ children }: AdminLayoutProviderProps) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: "1.0",
    lastUpdate: "01.05.2025",
    hasUpdate: true,
    updateVersion: "1.1"
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  // Получаем текущий путь без префикса /admin/
  const currentPath = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';
  
  // Пометить уведомление как прочитанное
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Пометить все уведомления как прочитанные
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };
  
  // Добавить новое уведомление
  const addNotification = (notification: Omit<Notification, "id">) => {
    const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
    const newNotification: Notification = {
      ...notification,
      id: newId,
      read: false,
      date: notification.date || "Только что"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Удалить уведомление
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Имитация обновления системы
  const updateSystem = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSystemInfo(prev => ({
          ...prev,
          version: prev.updateVersion || "1.1",
          lastUpdate: new Date().toLocaleDateString(),
          hasUpdate: false,
          updateVersion: undefined
        }));
        
        resolve(true);
      }, 2000);
    });
  };

  // Переключение состояния сайдбара
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", String(newState));
      return newState;
    });
  };

  // Эффект имитации получения новых уведомлений
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% вероятность получения нового уведомления
      if (Math.random() < 0.1) {
        const types = ["order", "review", "stock", "system"];
        const type = types[Math.floor(Math.random() * types.length)] as "order" | "review" | "stock" | "system";
        
        const titles = {
          order: "Новый заказ",
          review: "Новый отзыв",
          stock: "Товар заканчивается",
          system: "Системное уведомление"
        };
        
        const messages = {
          order: "Поступил новый заказ #" + Math.floor(1000 + Math.random() * 9000),
          review: "Клиент оставил новый отзыв о товаре",
          stock: "Товар скоро закончится на складе",
          system: "Обновление системы доступно для установки"
        };
        
        addNotification({
          title: titles[type],
          message: messages[type],
          read: false,
          date: "Только что",
          type: type
        });
      }
    }, 30000); // Проверка каждые 30 секунд
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayoutContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        removeNotification,
        currentPath,
        searchQuery,
        setSearchQuery,
        systemInfo,
        updateSystem,
        sidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
};

// Хук для использования контекста
export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  
  if (context === undefined) {
    throw new Error("useAdminLayout must be used within an AdminLayoutProvider");
  }
  
  return context;
};
