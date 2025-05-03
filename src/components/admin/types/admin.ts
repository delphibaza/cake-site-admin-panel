
import { ReactNode } from "react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type?: 'order' | 'review' | 'system' | 'stock';
  link?: string;
}

export interface AdminNavItem {
  name: string;
  path: string;
  icon: ReactNode;
  badge?: string | number;
}

export interface SystemInfo {
  version: string;
  lastUpdate: string;
  hasUpdate: boolean;
  updateVersion?: string;
}

export interface AdminLayoutContextType {
  notifications: Notification[];
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: number) => void;
  currentPath: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  systemInfo: SystemInfo;
  updateSystem: () => Promise<boolean>;
}
