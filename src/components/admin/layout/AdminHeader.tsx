
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuGroup, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Settings, LogOut, Home, PanelLeft,
  Bell, Search, User as UserIcon, Moon, Sun, ChevronDown,
  Cog, HelpCircle
} from "lucide-react";
import type { AdminNavItem, Notification } from "../types/admin";
import ThemeSettings from "../ThemeSettings";
import { useAdminTheme } from "../AdminThemeProvider";

interface AdminHeaderProps {
  currentUser: { fullName?: string; email?: string } | null;
  navItems: AdminNavItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  markAllNotificationsAsRead: () => void;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

const AdminHeader = ({
  currentUser,
  navItems,
  searchQuery,
  setSearchQuery,
  notifications,
  markAllNotificationsAsRead,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isActive,
  toggleSidebar,
  isCollapsed
}: AdminHeaderProps) => {
  // Получаем тему из контекста
  const { mode, toggleMode } = useAdminTheme();
  
  // Количество непрочитанных уведомлений
  const unreadCount = notifications.filter(n => !n.read).length;

  // Группировка навигационных элементов по категориям для мобильного меню
  const navGroups = navItems.reduce((acc, item) => {
    const groupKey = item.path.includes('analytics') || item.path.includes('activity') || item.path.includes('reports') 
      ? 'analytics' 
      : item.path.includes('settings') || item.path.includes('help') || item.path.includes('manual') 
        ? 'settings' 
        : 'main';
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, AdminNavItem[]>);

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
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
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="mr-2 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center dark:bg-pink-900">
                      <span className="text-pink-600 font-bold dark:text-pink-300">SC</span>
                    </div>
                    <h3 className="text-lg font-semibold">Админ-панель</h3>
                  </div>
                </div>
                <ScrollArea className="flex-1 overflow-auto py-2">
                  <nav className="grid gap-1 px-2">
                    {/* Основная навигация */}
                    {navGroups.main && (
                      <div className="py-2">
                        <h4 className="px-3 mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          УПРАВЛЕНИЕ
                        </h4>
                        {navGroups.main.map((item) => (
                          <Link 
                            key={item.path} 
                            to={`/admin${item.path ? `/${item.path}` : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button 
                              variant={isActive(item.path) ? "secondary" : "ghost"} 
                              className="w-full justify-start"
                            >
                              <span className="flex items-center">
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                              </span>
                              {item.badge && (
                                <Badge className="ml-auto" variant="outline">
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Аналитика */}
                    {navGroups.analytics && (
                      <div className="py-2">
                        <h4 className="px-3 mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          АНАЛИТИКА
                        </h4>
                        {navGroups.analytics.map((item) => (
                          <Link 
                            key={item.path} 
                            to={`/admin/${item.path}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button 
                              variant={isActive(item.path) ? "secondary" : "ghost"} 
                              className="w-full justify-start"
                            >
                              <span className="flex items-center">
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                              </span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Настройки */}
                    {navGroups.settings && (
                      <div className="py-2">
                        <h4 className="px-3 mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          НАСТРОЙКИ
                        </h4>
                        {navGroups.settings.map((item) => (
                          <Link 
                            key={item.path} 
                            to={`/admin/${item.path}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button 
                              variant={isActive(item.path) ? "secondary" : "ghost"} 
                              className="w-full justify-start"
                            >
                              <span className="flex items-center">
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                              </span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </nav>
                </ScrollArea>
                <div className="p-4 border-t dark:border-gray-700">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 dark:text-red-400" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Выход
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Кнопка сворачивания/разворачивания сайдбара - только для десктопа */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 hidden md:flex"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            <PanelLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
          
          <Link to="/admin" className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center dark:bg-pink-900">
              <span className="text-pink-600 font-bold dark:text-pink-300">SC</span>
            </div>
            <span className="hidden md:inline-block text-xl font-bold">
              Sweet Cake
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <form className="hidden md:block" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Поиск..."
                className="w-64 rounded-lg border pl-8 shadow-none dark:bg-gray-800 dark:border-gray-700"
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

          {/* Переключатель темы */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMode}
            className="hidden md:flex"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Настройки темы */}
          <div className="hidden md:block">
            <ThemeSettings />
          </div>

          {/* Уведомления */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  >
                    {unreadCount}
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
                  disabled={unreadCount === 0}
                  className="h-auto px-2 py-1 text-xs"
                  onClick={markAllNotificationsAsRead}
                >
                  Пометить все как прочитанные
                </Button>
              </div>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Нет новых уведомлений
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0 ${notification.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/20'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
              <DropdownMenuSeparator />
              <Link to="/admin/notifications">
                <Button variant="ghost" size="sm" className="w-full justify-center p-2">
                  Все уведомления
                </Button>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Профиль пользователя */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative gap-1.5 pl-0.5 pr-1.5 py-1.5">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Администратор" />
                  <AvatarFallback>{currentUser?.fullName?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline max-w-[100px] truncate text-sm font-medium">
                  {currentUser?.fullName || "Администратор"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.fullName || "Администратор"}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email || "admin@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" /> Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/help" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" /> Справка
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              {/* Настройки темы (на мобильных устройствах) */}
              <DropdownMenuGroup className="md:hidden">
                <DropdownMenuItem onClick={toggleMode}>
                  {mode === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {mode === "dark" ? "Светлая тема" : "Темная тема"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/appearance" className="cursor-pointer">
                    <Cog className="mr-2 h-4 w-4" /> Внешний вид
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="md:hidden" />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Выход
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
