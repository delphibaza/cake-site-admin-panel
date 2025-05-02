
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, Users, ShoppingCart } from 'lucide-react';

interface LiveStatisticsProps {
  updateInterval?: number; // в миллисекундах
}

const LiveStatistics = ({ updateInterval = 5000 }: LiveStatisticsProps) => {
  const [activeUsers, setActiveUsers] = useState(42);
  const [cartsInProgress, setCartsInProgress] = useState(7);
  const [serverLoad, setServerLoad] = useState(38);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Эффект для имитации обновления данных в реальном времени
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Имитация изменения количества активных пользователей
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(20, prev + change);
      });
      
      // Имитация изменения количества активных корзин
      setCartsInProgress(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(0, prev + change);
      });

      // Имитация изменения нагрузки на сервер
      setServerLoad(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.min(95, Math.max(15, prev + change));
      });

      // Обновление времени последнего обновления
      setLastUpdate(new Date());
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [updateInterval]);

  // Форматирование времени для отображения
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Определение статуса нагрузки сервера
  const getServerLoadStatus = () => {
    if (serverLoad < 30) return { text: "Низкая", color: "bg-green-500" };
    if (serverLoad < 70) return { text: "Средняя", color: "bg-amber-500" };
    return { text: "Высокая", color: "bg-red-500" };
  };

  const serverStatus = getServerLoadStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Статистика в реальном времени</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Активные пользователи</span>
            </div>
            <Badge variant="outline">{activeUsers}</Badge>
          </div>
          <Progress value={activeUsers} max={100} className="h-1 bg-blue-100" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium">Незавершенные корзины</span>
            </div>
            <Badge variant="outline">{cartsInProgress}</Badge>
          </div>
          <Progress value={cartsInProgress * 10} max={100} className="h-1 bg-pink-100" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Нагрузка сервера</span>
            </div>
            <Badge 
              className={serverStatus.color}
            >
              {serverStatus.text} ({serverLoad}%)
            </Badge>
          </div>
          <Progress 
            value={serverLoad} 
            max={100} 
            className="h-1"
            indicatorColor={
              serverLoad < 30 ? "bg-green-500" : 
              serverLoad < 70 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Последнее обновление: {formatTime(lastUpdate)}
          </div>
          <div>Интервал обновления: {updateInterval / 1000} сек</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStatistics;
