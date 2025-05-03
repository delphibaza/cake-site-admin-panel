
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, BarChart, LineChart, PieChart,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Area, Line, Bar, Pie, Cell, ResponsiveContainer
} from "recharts";
import {
  DownloadCloud, Calendar as CalendarIcon, Filter, ArrowRightLeft,
  TrendingUp, TrendingDown, Cake, Users, ShoppingBag, CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";

// Типы данных для аналитики
interface SalesByPeriod {
  name: string;
  sales: number;
  orders: number;
  clients: number;
}

interface SalesByCategory {
  name: string;
  value: number;
  fill: string;
}

interface ProductPopularity {
  name: string;
  sales: number;
  revenue: number;
}

interface ClientStatistics {
  name: string;
  new: number;
  returning: number;
}

// Дни недели на русском для использования в данных
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Генерация моковых данных для разных периодов
const generateDailyData = (): SalesByPeriod[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: weekDays[i],
    sales: 3000 + Math.floor(Math.random() * 5000),
    orders: 5 + Math.floor(Math.random() * 15),
    clients: 3 + Math.floor(Math.random() * 12)
  }));
};

const generateWeeklyData = (): SalesByPeriod[] => {
  return Array.from({ length: 4 }, (_, i) => ({
    name: `Неделя ${i + 1}`,
    sales: 15000 + Math.floor(Math.random() * 20000),
    orders: 30 + Math.floor(Math.random() * 50),
    clients: 20 + Math.floor(Math.random() * 40)
  }));
};

const generateMonthlyData = (): SalesByPeriod[] => {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  return months.map((month) => ({
    name: month,
    sales: 50000 + Math.floor(Math.random() * 100000),
    orders: 100 + Math.floor(Math.random() * 200),
    clients: 60 + Math.floor(Math.random() * 120)
  }));
};

// Данные по категориям
const categoryData: SalesByCategory[] = [
  { name: "Шоколадные", value: 35, fill: "#8884d8" },
  { name: "Фруктовые", value: 25, fill: "#82ca9d" },
  { name: "Медовые", value: 15, fill: "#ffc658" },
  { name: "Бисквитные", value: 10, fill: "#ff8042" },
  { name: "Другие", value: 15, fill: "#0088fe" }
];

// Популярные товары
const popularProducts: ProductPopularity[] = [
  { name: "Шоколадный торт", sales: 120, revenue: 36000 },
  { name: "Наполеон", sales: 90, revenue: 27000 },
  { name: "Медовик", sales: 85, revenue: 25500 },
  { name: "Красный бархат", sales: 78, revenue: 27300 },
  { name: "Тирамису", sales: 65, revenue: 22750 }
];

// Статистика по клиентам
const clientsData: ClientStatistics[] = [
  { name: "Янв", new: 15, returning: 25 },
  { name: "Фев", new: 18, returning: 28 },
  { name: "Мар", new: 22, returning: 30 },
  { name: "Апр", new: 25, returning: 35 },
  { name: "Май", new: 32, returning: 42 }
];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("weekly");
  const [salesData, setSalesData] = useState<SalesByPeriod[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [loading, setLoading] = useState(false);

  // Обновление данных при изменении периода
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      switch (period) {
        case "daily":
          setSalesData(generateDailyData());
          break;
        case "weekly":
          setSalesData(generateWeeklyData());
          break;
        case "monthly":
          setSalesData(generateMonthlyData());
          break;
        default:
          setSalesData(generateWeeklyData());
      }
      setLoading(false);
    }, 600);
  }, [period]);

  // Форматирование диапазона дат
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "d MMMM", { locale: ru })} - ${format(dateRange.to, "d MMMM yyyy", { locale: ru })}`;
    }
    return "Выберите период";
  };

  // Получение значения тренда продаж
  const getSalesTrend = () => {
    if (salesData.length < 2) return 0;
    const firstValue = salesData[0].sales;
    const lastValue = salesData[salesData.length - 1].sales;
    return Math.round(((lastValue - firstValue) / firstValue) * 100);
  };

  const salesTrend = getSalesTrend();

  return (
    <AdminLayout>
      <PageHeader 
        title="Аналитика продаж" 
        actionLabel="Экспорт данных"
        actionIcon={<DownloadCloud className="mr-2 h-4 w-4" />}
        actionUrl="#"
      >
        <div className="flex items-center mt-2 text-muted-foreground">
          <Badge variant="outline" className="mr-2 font-normal">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {formatDateRange()}
          </Badge>
          
          <Badge variant={salesTrend >= 0 ? "success" : "destructive"} variant-outline className="font-normal">
            {salesTrend >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
            {salesTrend >= 0 ? "+" : ""}{salesTrend}% к предыдущему периоду
          </Badge>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {/* Фильтры */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="sales">Продажи</TabsTrigger>
              <TabsTrigger value="products">Товары</TabsTrigger>
              <TabsTrigger value="clients">Клиенты</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as any)}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>

            <Select 
              value={period} 
              onValueChange={setPeriod}
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Дни</SelectItem>
                <SelectItem value="weekly">Недели</SelectItem>
                <SelectItem value="monthly">Месяцы</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
            </Button>

            <Button variant="outline" size="sm" className="h-9">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Сравнение
            </Button>
          </div>
        </div>

        {/* Основные показатели */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выручка</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156,500 ₽</div>
              <p className="text-xs text-muted-foreground">
                +12.5% с прошлого периода
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +8.2% с прошлого периода
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +15.3% с прошлого периода
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
              <Cake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,726 ₽</div>
              <p className="text-xs text-muted-foreground">
                +4.1% с прошлого периода
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Вкладки с графиками */}
        <TabsContent value="overview" className="space-y-6">
          {/* График продаж */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика продаж</CardTitle>
              <CardDescription>
                Общая выручка за выбранный период: 156,500 ₽
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Загрузка данных...</p>
                  </div>
                ) : (
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
                        formatter={(value) => [`${value.toLocaleString('ru-RU')} ₽`, 'Продажи']}
                        labelFormatter={(value) => `${value}`}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        name="Продажи (₽)"
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        activeDot={{ r: 6 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Графики по категориям и популярным товарам */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Продажи по категориям</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Доля продаж']}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Популярные товары</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={popularProducts}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickLine={false} axisLine={false} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false} 
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}`, 'Продано единиц']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="sales" 
                        name="Продано единиц"
                        fill="#8884d8" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Детальная статистика продаж */}
          <Car>
            <CardHeader>
              <CardTitle>Соотношение заказов и выручки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      yAxisId="left" 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      name="Выручка (₽)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      name="Заказы (шт)"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Car>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Статистика по товарам */}
          <Card>
            <CardHeader>
              <CardTitle>Выручка по популярным товарам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularProducts}
                    margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString('ru-RU')} ₽`, 'Выручка']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Выручка (₽)"
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {/* Статистика по клиентам */}
          <Card>
            <CardHeader>
              <CardTitle>Новые vs повторные клиенты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="new" 
                      name="Новые клиенты"
                      stackId="a" 
                      fill="#8884d8" 
                      radius={[4, 0, 0, 4]}
                    />
                    <Bar 
                      dataKey="returning" 
                      name="Повторные клиенты"
                      stackId="a" 
                      fill="#82ca9d" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
