
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  BadgeDollarSign, ShoppingBag, Users, Calendar,
  TrendingUp, ArrowUpRight, CreditCard, Package,
  Clock, Cake, ShoppingCart, Eye, Tag, Percent,
  ArrowRight, Search, FileText, BarChart as BarChartIcon,
  RefreshCw
} from "lucide-react";

// Демо-данные для графиков
const salesData = [
  { date: '01.05', revenue: 12500, orders: 21 },
  { date: '02.05', revenue: 15200, orders: 25 },
  { date: '03.05', revenue: 18900, orders: 31 },
  { date: '04.05', revenue: 17300, orders: 28 },
  { date: '05.05', revenue: 21500, orders: 35 },
  { date: '06.05', revenue: 24700, orders: 42 },
  { date: '07.05', revenue: 19800, orders: 32 },
];

const monthlyData = [
  { name: 'Янв', sales: 54000, visitors: 1200 },
  { name: 'Фев', sales: 62000, visitors: 1320 },
  { name: 'Мар', sales: 78000, visitors: 1640 },
  { name: 'Апр', sales: 82000, visitors: 1520 },
  { name: 'Май', sales: 91000, visitors: 1750 },
  { name: 'Июн', sales: 105000, visitors: 2100 },
];

const categoryData = [
  { name: 'Шоколадные', value: 35, fill: '#8884d8' },
  { name: 'Фруктовые', value: 28, fill: '#82ca9d' },
  { name: 'Классические', value: 20, fill: '#ffc658' },
  { name: 'Свадебные', value: 12, fill: '#ff8042' },
  { name: 'Детские', value: 5, fill: '#0088fe' },
];

const productPerformance = [
  { name: 'Шоколадный торт', sales: 120, views: 1500, conversion: 8 },
  { name: 'Медовик', sales: 95, views: 1200, conversion: 7.9 },
  { name: 'Чизкейк', sales: 85, views: 1100, conversion: 7.7 },
  { name: 'Наполеон', sales: 75, views: 980, conversion: 7.6 },
  { name: 'Красный бархат', sales: 70, views: 920, conversion: 7.6 },
];

const customerSegments = [
  { name: 'Новые', value: 35 },
  { name: 'Разовые', value: 25 },
  { name: 'Постоянные', value: 30 },
  { name: 'VIP', value: 10 },
];

const popularProducts = [
  { id: 1, name: "Шоколадный торт", sales: 42, stock: 15, price: 1200 },
  { id: 2, name: "Медовик", sales: 38, stock: 8, price: 1100 },
  { id: 3, name: "Чизкейк", sales: 35, stock: 12, price: 1300 },
  { id: 4, name: "Наполеон", sales: 32, stock: 10, price: 1150 },
];

const recentOrders = [
  { id: 1008, customer: "Иван Петров", date: "01.05.2025", status: "new", total: 2850 },
  { id: 1007, customer: "Елена Иванова", date: "30.04.2025", status: "processing", total: 3420 },
  { id: 1006, customer: "Алексей Смирнов", date: "30.04.2025", status: "completed", total: 1950 },
  { id: 1005, customer: "Мария Кузнецова", date: "29.04.2025", status: "completed", total: 4200 },
];

// Массив тегов для облака тегов
const tagCloud = [
  { text: "Шоколадный", value: 25 },
  { text: "Клубничный", value: 18 },
  { text: "Свадебный", value: 15 },
  { text: "День рождения", value: 22 },
  { text: "Медовый", value: 20 },
  { text: "Чизкейк", value: 16 },
  { text: "Наполеон", value: 14 },
  { text: "Веганский", value: 10 },
  { text: "Безглютеновый", value: 8 },
  { text: "Детский", value: 12 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Карточки с ключевыми показателями */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Общая выручка"
          value="126,500 ₽"
          icon={<BadgeDollarSign className="h-4 w-4" />}
          description="За последние 30 дней"
          trend={12.5}
          footer={<span className="text-xs text-muted-foreground">+2.5% с прошлого месяца</span>}
        />
        <StatsCard 
          title="Заказов"
          value="54"
          icon={<ShoppingBag className="h-4 w-4" />}
          description="За последние 30 дней"
          trend={8.2}
          footer={<Progress value={68} className="h-2" />}
        />
        <StatsCard 
          title="Новых клиентов"
          value="18"
          icon={<Users className="h-4 w-4" />}
          description="За последние 30 дней"
          trend={-2.3}
          footer={<span className="text-xs text-muted-foreground">-4.5% с прошлого месяца</span>}
        />
        <StatsCard 
          title="Средний чек"
          value="2,345 ₽"
          icon={<CreditCard className="h-4 w-4" />}
          description="За последние 30 дней"
          trend={5.1}
          footer={<span className="text-xs text-muted-foreground">+320 ₽ с прошлого месяца</span>}
        />
      </div>
      
      {/* Основные графики и таблицы */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
        </TabsList>
        
        {/* Вкладка с обзором */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* График продаж за 7 дней */}
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Динамика продаж за неделю</CardTitle>
                <div className="flex items-center">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">7 дней</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Выручка (₽)" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="orders" 
                        name="Заказы (шт.)" 
                        stroke="#82ca9d" 
                        fillOpacity={1} 
                        fill="url(#colorOrders)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <p className="text-sm font-medium">Общая выручка за неделю</p>
                    <p className="text-2xl font-bold">126,500 ₽</p>
                    <p className="flex items-center text-xs text-green-500">
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      +12.5% с прошлой недели
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Всего заказов за неделю</p>
                    <p className="text-2xl font-bold">54</p>
                    <p className="flex items-center text-xs text-green-500">
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      +8.2% с прошлой недели
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Карточка с категориями продаж */}
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
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Доля продаж']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Самая популярная категория:</span>
                    <span>Шоколадные (35%)</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Наименее популярная:</span>
                    <span>Детские (5%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Облако тегов и статистика посещаемости */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Популярные метки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tagCloud.map((tag) => (
                    <Badge 
                      key={tag.text}
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      style={{
                        fontSize: `${Math.max(0.8, Math.min(1.5, tag.value / 15))}rem`,
                        opacity: Math.max(0.6, Math.min(1, tag.value / 25))
                      }}
                    >
                      {tag.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Конверсия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Просмотры карточек</p>
                      <p className="text-2xl font-bold">4,568</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Добавления в корзину</p>
                      <p className="text-2xl font-bold">875</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Конверсия в заказы</p>
                      <p className="text-sm">7.5%</p>
                    </div>
                    <Progress value={7.5} className="h-2" />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span>Среднее время на сайте:</span>
                      <span className="font-medium">4 мин 32 сек</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Отказы:</span>
                      <span className="font-medium">23.4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Популярные товары и последние заказы */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Список популярных товаров */}
            <Card className="lg:col-span-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Популярные товары</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Все товары</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[260px] pr-4">
                  <div className="space-y-4">
                    {popularProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <Cake className="h-5 w-5 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-sm font-medium">{product.price} ₽</p>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                            <span>{product.sales} продаж</span>
                            <span>Остаток: {product.stock}</span>
                          </div>
                          <Progress 
                            value={product.stock > 10 ? 75 : 35} 
                            className="h-1 mt-1"
                            indicatorColor={product.stock < 10 ? "bg-red-500" : undefined}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Tag className="mr-2 h-3.5 w-3.5" />
                  Управление товарами
                </Button>
              </CardFooter>
            </Card>

            {/* Последние заказы */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Последние заказы</CardTitle>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[260px] pr-4">
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
                        <div className="text-sm font-medium">{order.total} ₽</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                  Все заказы
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Вкладка с продажами */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Ежемесячные продажи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} ₽`, 'Продажи']} />
                      <Legend />
                      <Bar dataKey="sales" name="Продажи (₽)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Средний чек по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData.map(item => ({
                        ...item,
                        avgOrder: Math.round(item.sales / (item.visitors * 0.075))
                      }))}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} ₽`, 'Средний чек']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgOrder" 
                        name="Средний чек (₽)" 
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Сегменты клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Доля клиентов']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Вкладка с товарами */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Эффективность товаров</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productPerformance}
                      margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" name="Продажи (шт.)" fill="#8884d8" />
                      <Bar dataKey="conversion" name="Конверсия (%)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Параметры эффективности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="80%" 
                      data={[
                        { subject: 'Продажи', A: 120, B: 110, fullMark: 150 },
                        { subject: 'Просмотры', A: 98, B: 130, fullMark: 150 },
                        { subject: 'Отзывы', A: 86, B: 130, fullMark: 150 },
                        { subject: 'Конверсия', A: 99, B: 100, fullMark: 150 },
                        { subject: 'Повторные покупки', A: 85, B: 90, fullMark: 150 },
                        { subject: 'Рентабельность', A: 65, B: 85, fullMark: 150 },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar 
                        name="Текущий месяц" 
                        dataKey="A" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Прошлый месяц" 
                        dataKey="B" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Вкладка с клиентами */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Система скоро здесь появится</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <RefreshCw className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Работаем над этим</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Расширенная аналитика по клиентам будет доступна в ближайшем обновлении панели управления.
              </p>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Посмотреть список клиентов
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Компонент карточки статистики
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: number;
  footer?: React.ReactNode;
}

const StatsCard = ({ title, value, icon, description, trend, footer }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className={`mt-1 flex items-center text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : <TrendingDown className="mr-1 h-3.5 w-3.5" />}
        {Math.abs(trend)}%
      </div>
    </CardContent>
    {footer && (
      <CardFooter className="pt-0 pb-3">
        {footer}
      </CardFooter>
    )}
  </Card>
);

// Иконки
const TrendingDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export default Dashboard;
