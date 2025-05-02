
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, ShoppingBag, Settings, LogOut, 
  Cake, Tag, MessageSquare, Users, Home,
  Bell, Search, LayoutDashboard, PieChart,
  Calendar, HelpCircle, FileText, Package,
  ChevronDown, TrendingUp, CreditCard, Plus,
  Eye, ArrowRight, HardDrive, Coffee, ShoppingCart,
  CheckCircle, Clock, XCircle, CircleAlert
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<{ id: number; title: string; message: string; read: boolean; date: string }[]>([
    { id: 1, title: "Новый заказ #1008", message: "Оформлен новый заказ на сумму 3450 ₽", read: false, date: "1 мая 2025" },
    { id: 2, title: "Отзыв на товар", message: "Клиент оставил отзыв на Шоколадный торт", read: false, date: "30 апреля 2025" },
    { id: 3, title: "Остаток товара", message: "Медовик (ID: 5) заканчивается на складе", read: true, date: "29 апреля 2025" },
  ]);

  // Статистика для дашборда
  const salesData = [
    { name: 'Пн', sales: 5400, visitors: 120 },
    { name: 'Вт', sales: 6200, visitors: 132 },
    { name: 'Ср', sales: 7800, visitors: 164 },
    { name: 'Чт', sales: 8200, visitors: 152 },
    { name: 'Пт', sales: 9100, visitors: 175 },
    { name: 'Сб', sales: 10500, visitors: 210 },
    { name: 'Вс', sales: 8900, visitors: 180 }
  ];

  const categoryData = [
    { name: 'Шоколадные', value: 35, fill: '#8884d8' },
    { name: 'Фруктовые', value: 28, fill: '#82ca9d' },
    { name: 'Классические', value: 20, fill: '#ffc658' },
    { name: 'Свадебные', value: 12, fill: '#ff8042' },
    { name: 'Детские', value: 5, fill: '#0088fe' },
  ];

  const popularProducts = [
    { id: 1, name: "Шоколадный торт", sales: 42, stock: 15, trend: 12 },
    { id: 2, name: "Медовик", sales: 38, stock: 8, trend: -5 },
    { id: 3, name: "Чизкейк", sales: 35, stock: 12, trend: 8 },
    { id: 4, name: "Красный бархат", sales: 28, stock: 10, trend: 15 },
  ];

  const recentOrders = [
    { id: 1008, customer: "Иван Петров", date: "01.05.2025", status: "new", total: 2850 },
    { id: 1007, customer: "Елена Иванова", date: "30.04.2025", status: "processing", total: 3420 },
    { id: 1006, customer: "Алексей Смирнов", date: "30.04.2025", status: "completed", total: 1950 },
    { id: 1005, customer: "Мария Кузнецова", date: "29.04.2025", status: "completed", total: 4200 },
  ];

  // Массив категорий товаров
  const categories = [
    { id: 1, name: "Шоколадные", count: 5 },
    { id: 2, name: "Фруктовые", count: 3 },
    { id: 3, name: "Классические", count: 4 },
    { id: 4, name: "Свадебные", count: 2 },
    { id: 5, name: "Детские", count: 1 },
  ];

  // Путь текущей страницы (без префикса /admin/)
  const currentPath = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
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

  // Статус заказа
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">Новый</Badge>;
      case "processing":
        return <Badge className="bg-amber-500">В обработке</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Завершен</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Отменен</Badge>;
      default:
        return null;
    }
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
                            <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
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
            <h1 className="text-2xl font-bold tracking-tight">
              {currentPath === 'dashboard' && 'Дашборд'}
              {currentPath === 'products' && 'Управление товарами'}
              {currentPath === 'categories' && 'Категории товаров'}
              {currentPath === 'orders' && 'Заказы'}
              {currentPath === 'reviews' && 'Отзывы клиентов'}
              {currentPath === 'users' && 'Пользователи'}
              {currentPath === 'analytics' && 'Аналитика'}
              {currentPath === 'settings' && 'Настройки'}
              {currentPath === 'help' && 'Справка'}
            </h1>
            
            <div className="flex items-center space-x-2">
              {currentPath === 'products' && (
                <Link to="/admin/products/new">
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Добавить товар</span>
                  </Button>
                </Link>
              )}
              {currentPath === 'categories' && (
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Новая категория</span>
                </Button>
              )}
            </div>
          </div>

          {/* Содержимое дашборда */}
          {currentPath === 'dashboard' && (
            <DashboardContent 
              salesData={salesData} 
              categoryData={categoryData} 
              popularProducts={popularProducts} 
              recentOrders={recentOrders}
              getOrderStatusBadge={getOrderStatusBadge}
            />
          )}

          {/* Содержимое категорий */}
          {currentPath === 'categories' && (
            <CategoriesContent categories={categories} />
          )}
          
          {/* Для других страниц отображаем соответствующий компонент */}
          {/* Вы можете добавить другие компоненты для остальных разделов */}
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

// Компонент дашборда
interface DashboardContentProps {
  salesData: any[];
  categoryData: any[];
  popularProducts: any[];
  recentOrders: any[];
  getOrderStatusBadge: (status: string) => JSX.Element | null;
}

const DashboardContent = ({ 
  salesData, 
  categoryData, 
  popularProducts, 
  recentOrders,
  getOrderStatusBadge
}: DashboardContentProps) => {
  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Выручка за сегодня"
          value="24,500 ₽"
          description="+5.2% с вчерашнего дня"
          icon={<CreditCard className="h-4 w-4" />}
          trend={5.2}
        />
        <StatsCard
          title="Заказов за сегодня"
          value="8"
          description="+2 с вчерашнего дня"
          icon={<ShoppingBag className="h-4 w-4" />}
          trend={33.3}
        />
        <StatsCard
          title="Товаров на складе"
          value="54"
          description="-3 с прошлой недели"
          icon={<Package className="h-4 w-4" />}
          trend={-5.5}
        />
        <StatsCard
          title="Активных клиентов"
          value="32"
          description="+4 с прошлой недели"
          icon={<Users className="h-4 w-4" />}
          trend={14.3}
        />
      </div>

      {/* Графики и таблицы */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* График продаж */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Продажи за неделю</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Сегодня
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value) => [`${value} ₽`, 'Продажи']}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    activeDot={{ r: 6 }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between border-t pt-3 mt-3">
              <div>
                <p className="text-sm font-medium">Общие продажи</p>
                <p className="text-2xl font-bold">156,500 ₽</p>
              </div>
              <div>
                <Badge variant="secondary" className="ml-auto">
                  <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
                  +12.5%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Распределение по категориям */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-medium">Продажи по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Доля продаж']} />
                  <Legend 
                    verticalAlign="bottom" 
                    layout="horizontal" 
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 border-t pt-3">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="mr-2 h-3.5 w-3.5" />
                Подробная статистика
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Популярные товары и последние заказы */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Популярные товары</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Все товары</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                    <Cake className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{product.name}</p>
                      <Badge variant={product.trend > 0 ? "outline" : "destructive"} className="ml-auto">
                        {product.trend > 0 ? "+" : ""}{product.trend}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{product.sales} продано</span>
                      <span>Остаток: {product.stock}</span>
                    </div>
                    <Progress value={product.stock > 10 ? 75 : 35} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Добавить новый товар
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Последние заказы</CardTitle>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${
                    order.status === "new" 
                      ? "bg-blue-100" 
                      : order.status === "processing"
                        ? "bg-amber-100"
                        : "bg-green-100"
                  }`}>
                    <ShoppingCart className={`h-4 w-4 ${
                      order.status === "new" 
                        ? "text-blue-600" 
                        : order.status === "processing"
                          ? "text-amber-600"
                          : "text-green-600"
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Заказ #{order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer} • {order.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium">{order.total} ₽</span>
                    {getOrderStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              <ShoppingBag className="mr-2 h-3.5 w-3.5" />
              Все заказы
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Информационные карточки */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard 
          icon={<HardDrive className="h-8 w-8 text-blue-500" />} 
          title="Резервное копирование" 
          description="Последнее резервное копирование: 01.05.2025"
          actionLabel="Создать резервную копию"
        />
        <InfoCard 
          icon={<Coffee className="h-8 w-8 text-amber-500" />} 
          title="Техническое обслуживание" 
          description="Запланировано: 15.05.2025, 03:00"
          actionLabel="Изменить расписание"
        />
        <InfoCard 
          icon={<CircleAlert className="h-8 w-8 text-red-500" />} 
          title="Низкий запас товаров" 
          description="3 товара заканчиваются на складе"
          actionLabel="Просмотреть товары"
        />
      </div>
    </div>
  );
};

// Компонент для списка категорий
interface CategoriesContentProps {
  categories: {
    id: number;
    name: string;
    count: number;
  }[];
}

const CategoriesContent = ({ categories }: CategoriesContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <Tag className="h-12 w-12 text-white" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="outline">{category.count} товаров</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотр
                </Button>
                <Button variant="ghost" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Карточка для создания новой категории */}
        <Card className="border-2 border-dashed flex flex-col items-center justify-center h-[208px]">
          <Plus className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">Добавить категорию</p>
          <Button variant="ghost" size="sm" className="mt-2">
            Создать новую
          </Button>
        </Card>
      </div>
    </div>
  );
};

// Компонент карточки статистики
interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: number;
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-gray-100 p-2 text-pink-600">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
        <span>{Math.abs(trend)}%</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

// Компонент информационной карточки
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}

const InfoCard = ({ icon, title, description, actionLabel }: InfoCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm" className="w-full">
          {actionLabel}
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Дополнительные иконки
const User = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Pencil = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrendingDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

export default Admin;
