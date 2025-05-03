
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Settings, LogOut, Home,
  Bell, Search, User as UserIcon
} from "lucide-react";
import type { AdminNavItem, Notification } from "../types/admin";

interface AdminHeaderProps {
  currentUser: { fullName?: string; email?: string } | null;
  navItems: AdminNavItem[];
  settingsItems: AdminNavItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  markAllNotificationsAsRead: () => void;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
}

const AdminHeader = ({
  currentUser,
  navItems,
  settingsItems,
  searchQuery,
  setSearchQuery,
  notifications,
  markAllNotificationsAsRead,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isActive
}: AdminHeaderProps) => {
  // Количество непрочитанных уведомлений
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
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
                    <div className="my-2 border-t border-gray-100 pt-2" />
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
            <div className="mr-2 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-bold">SC</span>
            </div>
            <span className="hidden md:inline-block text-xl font-bold">
              Sweet Cake
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <form className="hidden md:block" onSubmit={(e) => e.preventDefault()}>
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
              <Button variant="outline" size="icon" className="relative hover:bg-gray-100">
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
                  <div className="p-4 text-center text-sm text-gray-500">
                    Нет новых уведомлений
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${notification.read ? '' : 'bg-blue-50/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Администратор" />
                  <AvatarFallback>{currentUser?.fullName?.[0] || "A"}</AvatarFallback>
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
                  <UserIcon className="mr-2 h-4 w-4" /> Профиль
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
  );
};

export default AdminHeader;
