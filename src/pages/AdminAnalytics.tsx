
import LiveStatistics from "@/components/admin/LiveStatistics";
import ActivityLog from "@/components/admin/ActivityLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, DownloadCloud, Filter, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Данные для аналитики продаж
const salesData = [
  { month: 'Янв', sales: 54000 },
  { month: 'Фев', sales: 62000 },
  { month: 'Мар', sales: 78000 },
  { month: 'Апр', sales: 82000 },
  { month: 'Май', sales: 91000 },
  { month: 'Июн', sales: 105000 }
];

// Данные по категориям
const categoryData = [
  { name: 'Шоколадные', value: 35, fill: '#8884d8' },
  { name: 'Фруктовые', value: 28, fill: '#82ca9d' },
  { name: 'Классические', value: 20, fill: '#ffc658' },
  { name: 'Свадебные', value: 12, fill: '#ff8042' },
  { name: 'Детские', value: 5, fill: '#0088fe' }
];

// Данные по возрастным группам
const ageData = [
  { age: '18-24', value: 15 },
  { age: '25-34', value: 35 },
  { age: '35-44', value: 30 },
  { age: '45-54', value: 12 },
  { age: '55+', value: 8 }
];

// Данные по источникам
const sourceData = [
  { source: 'Поисковые системы', value: 45 },
  { source: 'Социальные сети', value: 25 },
  { source: 'Прямые заходы', value: 15 },
  { source: 'Реферальные ссылки', value: 10 },
  { source: 'Прочее', value: 5 }
];

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link to="/admin" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Аналитика</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Аналитика продаж и клиентов</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Фильтры</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <DownloadCloud className="h-4 w-4" />
              <span>Экспорт</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700">
              <RefreshCw className="h-4 w-4" />
              <span>Обновить</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Общая выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">472,500 ₽</div>
              <p className="text-sm text-green-600">+12.5% с предыдущего периода</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">243</div>
              <p className="text-sm text-green-600">+8.2% с предыдущего периода</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Средний чек</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,945 ₽</div>
              <p className="text-sm text-green-600">+5.1% с предыдущего периода</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger value="sales">Продажи</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="customers">Клиенты</TabsTrigger>
            <TabsTrigger value="sources">Источники</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Динамика продаж по месяцам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} ₽`, 'Продажи']}
                        />
                        <Legend />
                        <Bar dataKey="sales" name="Продажи (₽)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LiveStatistics />
                <ActivityLog limit={5} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Распределение продаж по категориям</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Доля продаж']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Рост популярности категорий</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Янв', шоколадные: 25, фруктовые: 20, классические: 18, свадебные: 10, детские: 5 },
                          { month: 'Фев', шоколадные: 28, фруктовые: 22, классические: 19, свадебные: 11, детские: 6 },
                          { month: 'Мар', шоколадные: 30, фруктовые: 24, классические: 20, свадебные: 12, детские: 5 },
                          { month: 'Апр', шоколадные: 32, фруктовые: 26, классические: 19, свадебные: 12, детские: 4 },
                          { month: 'Май', шоколадные: 34, фруктовые: 28, классические: 18, свадебные: 11, детские: 5 },
                          { month: 'Июн', шоколадные: 35, фруктовые: 28, классические: 20, свадебные: 12, детские: 5 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="шоколадные" name="Шоколадные" stroke="#8884d8" />
                        <Line type="monotone" dataKey="фруктовые" name="Фруктовые" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="классические" name="Классические" stroke="#ffc658" />
                        <Line type="monotone" dataKey="свадебные" name="Свадебные" stroke="#ff8042" />
                        <Line type="monotone" dataKey="детские" name="Детские" stroke="#0088fe" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Распределение клиентов по возрасту</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Процент клиентов']} />
                        <Legend />
                        <Bar dataKey="value" name="Процент клиентов" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Показатели удержания клиентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Янв', новые: 100, повторные: 0, активные: 0 },
                          { month: 'Фев', новые: 85, повторные: 30, активные: 15 },
                          { month: 'Мар', новые: 70, повторные: 45, активные: 28 },
                          { month: 'Апр', новые: 65, повторные: 52, активные: 40 },
                          { month: 'Май', новые: 60, повторные: 58, активные: 50 },
                          { month: 'Июн', новые: 55, повторные: 60, активные: 58 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="новые" name="Новые клиенты" stroke="#8884d8" />
                        <Line type="monotone" dataKey="повторные" name="Повторные покупки" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="активные" name="Активные клиенты" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Источники трафика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Процент трафика']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Конверсия по источникам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Поисковые системы', value: 8.2 },
                          { name: 'Социальные сети', value: 6.5 },
                          { name: 'Прямые заходы', value: 12.3 },
                          { name: 'Реферальные ссылки', value: 9.8 },
                          { name: 'Прочее', value: 4.2 }
                        ]}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Конверсия']} />
                        <Legend />
                        <Bar dataKey="value" name="Конверсия в процентах" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Цвета для графиков
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export default AdminAnalytics;
