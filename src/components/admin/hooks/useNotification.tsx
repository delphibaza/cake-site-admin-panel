
import { useCallback } from 'react';
import { useAdminLayout } from '../context/AdminLayoutContext';
import type { Notification } from '../types/admin';

type NotificationType = 'order' | 'review' | 'system' | 'stock';

interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export const useNotification = () => {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useAdminLayout();

  // Получение уведомлений по типу
  const getNotificationsByType = useCallback((type?: NotificationType) => {
    return type 
      ? notifications.filter(n => n.type === type)
      : notifications;
  }, [notifications]);

  // Получение количества непрочитанных уведомлений по типу
  const getUnreadCount = useCallback((type?: NotificationType) => {
    return getNotificationsByType(type).filter(n => !n.read).length;
  }, [getNotificationsByType]);

  // Создание нового уведомления
  const createNotification = useCallback((options: NotificationOptions) => {
    const { title, message, type = 'system', link } = options;
    
    addNotification({
      title,
      message,
      type,
      link,
      read: false,
      date: new Date().toLocaleDateString('ru-RU')
    });
  }, [addNotification]);

  // Создание уведомления о новом заказе
  const notifyNewOrder = useCallback((orderId: number, amount: number) => {
    createNotification({
      title: `Новый заказ #${orderId}`,
      message: `Оформлен новый заказ на сумму ${amount} ₽`,
      type: 'order',
      link: `/admin/orders/${orderId}`
    });
  }, [createNotification]);

  // Создание уведомления о новом отзыве
  const notifyNewReview = useCallback((productName: string, productId: number) => {
    createNotification({
      title: `Отзыв на товар`,
      message: `Клиент оставил отзыв на ${productName}`,
      type: 'review',
      link: `/admin/reviews?product=${productId}`
    });
  }, [createNotification]);

  // Создание уведомления о низком запасе товара
  const notifyLowStock = useCallback((productName: string, productId: number) => {
    createNotification({
      title: `Остаток товара`,
      message: `${productName} (ID: ${productId}) заканчивается на складе`,
      type: 'stock',
      link: `/admin/products/${productId}`
    });
  }, [createNotification]);

  // Создание системного уведомления
  const notifySystem = useCallback((title: string, message: string) => {
    createNotification({
      title,
      message,
      type: 'system'
    });
  }, [createNotification]);

  return {
    notifications,
    getNotificationsByType,
    getUnreadCount,
    createNotification,
    notifyNewOrder,
    notifyNewReview,
    notifyLowStock,
    notifySystem,
    removeNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };
};
