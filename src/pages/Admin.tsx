
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, ShoppingBag, Users, Settings, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Административная панель</h1>
          <Button variant="ghost" className="text-white hover:bg-pink-600" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Выход
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Добро пожаловать в панель управления</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-pink-700">
                <Cake className="mr-2 h-5 w-5" /> Товары
              </CardTitle>
              <CardDescription>Управление каталогом тортов</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/products">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">Управление товарами</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-pink-700">
                <ShoppingBag className="mr-2 h-5 w-5" /> Заказы
              </CardTitle>
              <CardDescription>Просмотр и обработка заказов</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/orders">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">Управление заказами</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-pink-700">
                <Settings className="mr-2 h-5 w-5" /> Настройки
              </CardTitle>
              <CardDescription>Конфигурация магазина</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Настройки магазина</Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Краткая статистика</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pink-50 p-4 rounded-md">
              <div className="font-bold text-2xl text-pink-700">6</div>
              <div className="text-sm text-gray-600">Товаров в каталоге</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-md">
              <div className="font-bold text-2xl text-pink-700">12</div>
              <div className="text-sm text-gray-600">Заказов за месяц</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-md">
              <div className="font-bold text-2xl text-pink-700">34</div>
              <div className="text-sm text-gray-600">Клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
