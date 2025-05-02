
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, defaultAdmin } from '@/types/user';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    
    // Инициализируем админа, если еще не создан
    const users = localStorage.getItem('users');
    if (!users) {
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    } else {
      const parsedUsers = JSON.parse(users) as User[];
      // Проверяем наличие админа
      const adminExists = parsedUsers.some(user => user.role === 'admin');
      if (!adminExists) {
        localStorage.setItem('users', JSON.stringify([...parsedUsers, defaultAdmin]));
      }
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Если пользователь админ, устанавливаем флаг авторизации для админ-панели
      if (user.role === 'admin') {
        localStorage.setItem('adminAuth', 'true');
      }
      
      return true;
    }
    
    return false;
  };
  
  const register = async (userData: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<boolean> => {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    // Проверяем, не занят ли email
    if (users.some(user => user.email === userData.email)) {
      return false;
    }
    
    // Создаем нового пользователя
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    // Добавляем пользователя в "базу"
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Автоматический вход после регистрации
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };
  
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminAuth');
  };
  
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;
    
    // Обновляем данные пользователя
    const updatedUser = { ...currentUser, ...userData };
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setCurrentUser(updatedUser);
    
    return true;
  };
  
  const value = {
    currentUser,
    isAuthenticated,
    isAdmin: currentUser?.role === 'admin' || false,
    login,
    register,
    logout,
    updateUserProfile
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
