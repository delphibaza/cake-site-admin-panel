
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart, ShoppingBag, Settings, LogOut, 
  Cake, Tag, MessageSquare, Users, Home,
  Bell, Search, LayoutDashboard, PieChart,
  Calendar, HelpCircle, FileText
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

const AdminLayout = ({ children, title, actions }: AdminLayoutProps) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<{ id: number; title: string; message: string; read: boolean }[]>([
    { id: 1, title: "Новый заказ #1008", message: "Оформлен новый заказ на сумму 3450 ₽", read: false },
    { id: 2, title: "Отзыв на товар", message: "Клиент оставил отзыв на Шоколадный торт", read: false },
    { id: 3, title: "Остаток товара", message: "Медовик (ID: 5) заканчивается на складе", read: true },
  ]);

  // Путь текущей страницы (без префикса /admin/)
  const currentPath = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminAuth");
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Навигационные пункты
  const navItems = [
    { name: "Дашборд", path: "", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { name: "Товары", path: "products", icon: <Cake className="mr-2 h-4 w-4" /> },
    { name: "Категории", path: "categories", icon: <Tag className="mr-2 h-4 w-4" /> },
    { name: "Заказы", path: "orders", icon: <ShoppingBag className="mr-2 h-4 w-4" /> },
    { name: "Отзывы", path: "reviews", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
    { name: "Пользователи", path: "users", icon: <Users className="mr-2 h-4 w-4" /> },
    { name: "Аналитика", path: "analytics", icon: <PieChart className="mr-2 h-4 w-4" /> },
  ];

  // Пункты настроек
  const settingsItems = [
    { name: "Настройки", path: "settings", icon: <Settings className="mr-2 h-4 w-4" /> },
    { name: "Справка", path: "help", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  ];

  // Определение активного пункта навигации
  const isActive = (path: string) => {
    return path === currentPath || (path === "" && currentPath === "dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            {/* Для мобильных устройств */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="mr-2">
                  <BarChart className="h-5 w-5" />
                  <span className="sr-only">Меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Админ-панель</h3>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                      {navItems.map((item) => (
                        <Link 
                          key={item.path} 
                          to={`/admin${item.path ? `/${item.path}` : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button 
                            variant={isActive(item.path) ? "secondary" : "ghost"} 
                            className="w-full justify-start"
                          >
                            {item.icon} {item.name}
                          </Button>
                        </Link>
                      ))}
                      <Separator className="my-2" />
                      {settingsItems.map((item) => (
                        <Link 
                          key={item.path} 
                          to={`/admin/${item.path}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button 
                            variant={isActive(item.path) ? "secondary" : "ghost"} 
                            className="w-full justify-start"
                          >
                            {item.icon} {item.name}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Выход
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/admin" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6 text-pink-600"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
              <span className="hidden md:inline-block text-xl font-bold">
                Sweet Cake
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Поиск..."
                  className="w-64 rounded-lg border pl-8 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Кнопка перехода на сайт */}
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Home className="mr-2 h-4 w-4" />
                На сайт
              </Button>
            </Link>

            {/* Уведомления */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.read) && (
                    <Badge 
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    >
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <h3 className="font-medium">Уведомления</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs"
                    onClick={markAllNotificationsAsRead}
                  >
                    Пометить все как прочитанные
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Нет новых уведомлений
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <Button variant="ghost" size="sm" className="w-full justify-center p-2">
                  Все уведомления
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Профиль пользователя */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Администратор" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium leading-none">{currentUser?.fullName || "Администратор"}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email || "admin@example.com"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Основной контент с боковой навигацией */}
      <div className="container grid flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        {/* Боковая навигация (видимая только на десктопах) */}
        <aside className="hidden md:flex border-r flex-col space-y-6 py-6">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link key={item.path} to={`/admin${item.path ? `/${item.path}` : ''}`}>
                <Button 
                  variant={isActive(item.path) ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  {item.icon} {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight">Настройки</h3>
            <nav className="grid gap-1 px-2">
              {settingsItems.map((item) => (
                <Link key={item.path} to={`/admin/${item.path}`}>
                  <Button 
                    variant={isActive(item.path) ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    {item.icon} {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto px-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Система v1.2.0</CardTitle>
                <CardDescription className="text-xs">
                  Последнее обновление: 01.05.2025
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-xs text-muted-foreground">
                  <p>Новая версия панели управления доступна!</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full text-xs"
                >
                  Обновить сейчас
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Основной контент */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>

          {children}
        </main>
      </div>

      {/* Индикатор активности сервера */}
      <div className="fixed bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs shadow-md backdrop-blur-sm">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <span>Сервер активен</span>
      </div>
    </div>
  );
};

// Дополнительная иконка для пользователя
const User = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default AdminLayout;
