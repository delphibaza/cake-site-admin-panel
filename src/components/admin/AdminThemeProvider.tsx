
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Типы для темы
type ThemeMode = "light" | "dark" | "system";
type ThemeColor = "blue" | "purple" | "green" | "pink" | "orange";

interface AdminThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

// Определение контекста темы для админ-панели
const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

// Провайдер темы для административной панели
export function AdminThemeProvider({ children }: { children: ReactNode }) {
  // Получение сохраненных настроек или установка значений по умолчанию
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("adminThemeMode") as ThemeMode;
    return savedMode || "light";
  });
  
  const [color, setColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem("adminThemeColor") as ThemeColor;
    return savedColor || "purple";
  });

  // Переключение между светлой и темной темами
  const toggleMode = () => {
    setMode(prev => prev === "dark" ? "light" : "dark");
  };

  // Применение темы к HTML элементу
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Удаление предыдущих классов темы
    root.classList.remove("light", "dark");
    
    // Применение текущей темы
    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
    
    // Сохранение темы в localStorage
    localStorage.setItem("adminThemeMode", mode);
  }, [mode]);

  // Применение цветовой схемы
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Удаление предыдущих классов цветовой схемы
    root.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-pink", "theme-orange");
    
    // Применение текущей цветовой схемы
    root.classList.add(`theme-${color}`);
    
    // Сохранение цветовой схемы в localStorage
    localStorage.setItem("adminThemeColor", color);
  }, [color]);

  // Отслеживание системных настроек, если выбран режим "system"
  useEffect(() => {
    if (mode !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  return (
    <AdminThemeContext.Provider value={{ mode, color, setMode, setColor, toggleMode }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// Хук для доступа к контексту темы
export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  
  return context;
}
