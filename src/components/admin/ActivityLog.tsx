
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertCircle, CheckCircle, RotateCw, ShoppingCart, MessageSquare, 
  User, Settings, Package, Trash2, Clock, CloudOff, RefreshCw
} from "lucide-react";

interface ActivityItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  action: string;
  target: string;
  targetId?: number;
  timestamp: Date;
  type: ActivityType;
  status?: 'success' | 'error' | 'pending' | 'warning';
  additionalInfo?: string;
}

type ActivityType = 'order' | 'product' | 'user' | 'system' | 'review' | 'category';

interface ActivityLogProps {
  limit?: number;
  filter?: 'all' | ActivityType;
  className?: string;
  onRefresh?: () => void;
  showHeader?: boolean;
  title?: string;
}

const ActivityLog = ({ 
  limit = 10, 
  filter = 'all', 
  className = '',
  onRefresh,
  showHeader = true,
  title = "Журнал активности"
}: ActivityLogProps) => {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | ActivityType>(filter);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь был бы API запрос
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockActivities: ActivityItem[] = [
          {
            id: 1,
            userId: 1,
            userName: "Администратор",
            userAvatar: "https://i.pravatar.cc/150?img=68",
            action: "создал",
            target: "новый товар",
            targetId: 12,
            timestamp: new Date(2025, 4, 1, 14, 30),
            type: "product",
            status: "success"
          },
          {
            id: 2,
            userId: 2,
            userName: "Менеджер",
            userAvatar: "https://i.pravatar.cc/150?img=32",
            action: "обновил",
            target: "заказ #1008",
            targetId: 1008,
            timestamp: new Date(2025, 4, 1, 13, 15),
            type: "order",
            status: "success"
          },
          {
            id: 3,
            userId: 1,
            userName: "Администратор",
            userAvatar: "https://i.pravatar.cc/150?img=68",
            action: "удалил",
            target: "отзыв пользователя",
            targetId: 45,
            timestamp: new Date(2025, 4, 1, 11, 27),
            type: "review",
            status: "warning"
          },
          {
            id: 4,
            userId: 3,
            userName: "Оператор",
            userAvatar: "https://i.pravatar.cc/150?img=45",
            action: "изменил статус",
            target: "заказа #1006",
            targetId: 1006,
            timestamp: new Date(2025, 4, 1, 10, 5),
            type: "order",
            status: "success"
          },
          {
            id: 5,
            userId: 0,
            userName: "Система",
            action: "обнаружила",
            target: "низкий запас товара",
            targetId: 5,
            timestamp: new Date(2025, 4, 1, 9, 30),
            type: "system",
            status: "warning",
            additionalInfo: "Медовик - остаток: 3 шт."
          },
          {
            id: 6,
            userId: 2,
            userName: "Менеджер",
            userAvatar: "https://i.pravatar.cc/150?img=32",
            action: "добавил",
            target: "новую категорию",
            targetId: 8,
            timestamp: new Date(2025, 4, 1, 9, 12),
            type: "category",
            status: "success"
          },
          {
            id: 7,
            userId: 1,
            userName: "Администратор",
            userAvatar: "https://i.pravatar.cc/150?img=68",
            action: "заблокировал",
            target: "пользователя",
            targetId: 102,
            timestamp: new Date(2025, 4, 1, 8, 45),
            type: "user",
            status: "error"
          },
          {
            id: 8,
            userId: 3,
            userName: "Оператор",
            userAvatar: "https://i.pravatar.cc/150?img=45",
            action: "отметил как проверенный",
            target: "отзыв пользователя",
            targetId: 44,
            timestamp: new Date(2025, 3, 30, 18, 22),
            type: "review",
            status: "success"
          },
          {
            id: 9,
            userId: 0,
            userName: "Система",
            action: "обновила",
            target: "базу данных",
            timestamp: new Date(2025, 3, 30, 3, 0),
            type: "system",
            status: "success"
          },
          {
            id: 10,
            userId: 0,
            userName: "Система",
            action: "обнаружила ошибку",
            target: "при обработке платежа",
            targetId: 1005,
            timestamp: new Date(2025, 3, 29, 15, 47),
            type: "order",
            status: "error",
            additionalInfo: "Ошибка подключения к платежному шлюзу"
          },
          {
            id: 11,
            userId: 1,
            userName: "Администратор",
            userAvatar: "https://i.pravatar.cc/150?img=68",
            action: "изменил цену",
            target: "товара",
            targetId: 3,
            timestamp: new Date(2025, 3, 29, 14, 30),
            type: "product",
            status: "success",
            additionalInfo: "Новая цена: 1200 ₽"
          },
          {
            id: 12,
            userId: 2,
            userName: "Менеджер",
            userAvatar: "https://i.pravatar.cc/150?img=32",
            action: "отменил",
            target: "заказ #1003",
            targetId: 1003,
            timestamp: new Date(2025, 3, 29, 11, 15),
            type: "order",
            status: "warning"
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error("Ошибка загрузки активности:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  // Обработчик обновления журнала
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }
  };

  // Получение иконки для типа активности
  const getActivityIcon = (type: ActivityType, status?: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'review':
        return <MessageSquare className="h-4 w-4" />;
      case 'category':
        return <Settings className="h-4 w-4" />;
      case 'system':
        if (status === 'error') return <CloudOff className="h-4 w-4" />;
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Получение цвета для статуса
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return "bg-green-100 text-green-800";
      case 'error':
        return "bg-red-100 text-red-800";
      case 'warning':
        return "bg-yellow-100 text-yellow-800";
      case 'pending':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Получение иконки для статуса
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3" />;
      case 'pending':
        return <RotateCw className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return "Только что";
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ч. назад`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 2) return "Вчера";
    
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Получение заголовка для группировки по дате
  const getDayHeader = (date: Date) => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  // Фильтрация активностей
  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(a => a.type === activeFilter);

  // Группировка по дате
  const groupedActivities: Record<string, ActivityItem[]> = {};
  
  filteredActivities.forEach(activity => {
    const dateKey = activity.timestamp.toDateString();
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    groupedActivities[dateKey].push(activity);
  });

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="order">Заказы</SelectItem>
                <SelectItem value="product">Товары</SelectItem>
                <SelectItem value="user">Пользователи</SelectItem>
                <SelectItem value="review">Отзывы</SelectItem>
                <SelectItem value="category">Категории</SelectItem>
                <SelectItem value="system">Система</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={loading}
              className="h-8 w-8"
            >
              {loading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            {Object.keys(groupedActivities).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                <CloudOff className="h-12 w-12 mb-2 opacity-20" />
                <p>Нет записей активности</p>
                {activeFilter !== 'all' && (
                  <Button 
                    variant="link" 
                    onClick={() => setActiveFilter('all')}
                    className="mt-2"
                  >
                    Сбросить фильтр
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedActivities).map(([dateKey, items]) => (
                  <div key={dateKey} className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground sticky top-0 bg-white py-1 z-10">
                      {getDayHeader(new Date(dateKey))}
                    </h3>
                    
                    <div className="space-y-4">
                      {items.slice(0, limit).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            {activity.userAvatar ? (
                              <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                            ) : (
                              <AvatarFallback className={activity.userId === 0 ? "bg-blue-100 text-blue-600" : undefined}>
                                {activity.userId === 0 ? 'S' : activity.userName[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium leading-none">
                                {activity.userName}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(activity.status)} flex items-center gap-1 px-1.5 py-0.5 text-xs font-normal`}
                              >
                                {getStatusIcon(activity.status)}
                                <span>{activity.status}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {formatTime(activity.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-sm">
                              <span>{activity.action} </span>
                              <span className="font-medium">{activity.target}</span>
                              {activity.targetId && (
                                <Button variant="link" className="p-0 h-auto text-sm font-medium" asChild>
                                  <a 
                                    href={`/admin/${activity.type}s/${activity.targetId}`}
                                    className="inline-flex items-center ml-1"
                                  >
                                    {getActivityIcon(activity.type, activity.status)}
                                    <span className="ml-1">#{activity.targetId}</span>
                                  </a>
                                </Button>
                              )}
                            </p>
                            
                            {activity.additionalInfo && (
                              <p className="text-xs text-muted-foreground">
                                {activity.additionalInfo}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
