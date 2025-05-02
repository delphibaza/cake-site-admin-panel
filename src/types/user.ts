
export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Демо админский аккаунт для входа в админ-панель
export const defaultAdmin: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  password: 'password123', // В реальном приложении храним хеш, не открытый пароль
  fullName: 'Администратор',
  role: 'admin',
  createdAt: '2025-01-01'
};
