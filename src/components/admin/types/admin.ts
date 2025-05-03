
import { ReactNode } from "react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type?: 'order' | 'review' | 'system' | 'stock';
  link?: string;
  severity?: 'low' | 'medium' | 'high';
  icon?: ReactNode;
}

export interface AdminNavItem {
  name: string;
  path: string;
  icon: ReactNode;
  badge?: string | number;
  description?: string;
  children?: AdminNavItem[];
}

export interface SystemInfo {
  version: string;
  lastUpdate: string;
  hasUpdate: boolean;
  updateVersion?: string;
  serverDetails?: {
    os: string;
    uptime: string;
    memory: string;
    cpu: string;
  };
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
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export type StatsCardType = {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
};

export interface TableFilter {
  id: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
}

export type Period = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
