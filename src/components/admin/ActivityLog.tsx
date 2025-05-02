
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus, Edit, ShoppingBag, User, Trash, FileText,
  MessageSquare, Eye, CheckCircle, XCircle, 
  ShoppingCart, DollarSign, Tag, Clock
} from 'lucide-react';

// Типы для активности
type ActivityType = 
  'create' | 'update' | 'delete' | 'order' | 
  'review' | 'login' | 'view' | 'payment' |
  'status' | 'cart' | 'refund' | 'tag';

interface ActivityItem {
  id: number;
  type: ActivityType;
  description: string;
  user: string;
  timestamp: string;
  entity?: string;
  entityId?: number | string;
}

// Демо-данные для логов активности
const activityLogs: ActivityItem[] = [
  {
    id: 1,
    type: 'order',
    description: 'Новый заказ №1008 оформлен',
    user: 'Иван Петров',
    timestamp: '01.05.2025 14:32',
    entity: 'Заказ',
    entityId: 1008
  },
  {
    id: 2,
    type: 'update',
    description: 'Обновлен товар "Шоколадный торт"',
    user: 'Администратор',
    timestamp: '01.05.2025 12:15',
    entity: 'Товар',
    entityId: 1
  },
  {
    id: 3,
    type: 'review',
    description: 'Новый отзыв на товар "Медовик"',
    user: 'Елена Смирнова',
    timestamp: '01.05.2025 10:48',
    entity: 'Отзыв',
    entityId: 23
  },
  {
    id: 4,
    type: 'login',
    description: 'Вход в административную панель',
    user: 'Администратор',
    timestamp: '01.05.2025 09:15'
  },
  {
    id: 5,
    type: 'status',
    description: 'Статус заказа №1006 изменен на "Завершен"',
    user: 'Администратор',
    timestamp: '01.05.2025 08:42',
    entity: 'Заказ',
    entityId: 1006
  },
  {
    id: 6,
    type: 'create',
    description: 'Создан новый товар "Красный бархат"',
    user: 'Администратор',
    timestamp: '30.04.2025 17:20',
    entity: 'Товар',
    entityId: 12
  },
  {
    id: 7,
    type: 'payment',
    description: 'Оплата заказа №1007 получена',
    user: 'Система',
    timestamp: '30.04.2025 16:15',
    entity: 'Оплата',
    entityId: 1007
  },
  {
    id: 8,
    type: 'cart',
    description: 'Добавлен товар в корзину',
    user: 'Мария Кузнецова',
    timestamp: '30.04.2025 15:30',
    entity: 'Корзина',
    entityId: 'mk32'
  },
  {
    id: 9,
    type: 'delete',
    description: 'Удален товар "Капкейк ванильный"',
    user: 'Администратор',
    timestamp: '30.04.2025 14:18',
    entity: 'Товар',
    entityId: 8
  },
  {
    id: 10,
    type: 'tag',
    description: 'Добавлена категория "Без глютена"',
    user: 'Администратор',
    timestamp: '30.04.2025 12:05',
    entity: 'Категория',
    entityId: 6
  }
];

interface ActivityLogProps {
  limit?: number;
}

const ActivityLog = ({ limit = 10 }: ActivityLogProps) => {
  // Иконка в зависимости от типа активности
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'create': return <Plus className="h-4 w-4 text-green-500" />;
      case 'update': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete': return <Trash className="h-4 w-4 text-red-500" />;
      case 'order': return <ShoppingBag className="h-4 w-4 text-amber-500" />;
      case 'review': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'login': return <User className="h-4 w-4 text-indigo-500" />;
      case 'view': return <Eye className="h-4 w-4 text-gray-500" />;
      case 'status': return <FileText className="h-4 w-4 text-cyan-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'cart': return <ShoppingCart className="h-4 w-4 text-pink-500" />;
      case 'refund': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'tag': return <Tag className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Бейдж для типа активности
  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'create':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Создание</Badge>;
      case 'update':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Обновление</Badge>;
      case 'delete':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Удаление</Badge>;
      case 'order':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Заказ</Badge>;
      case 'review':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Отзыв</Badge>;
      case 'login':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Вход</Badge>;
      case 'view':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Просмотр</Badge>;
      case 'status':
        return <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">Статус</Badge>;
      case 'payment':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Оплата</Badge>;
      case 'cart':
        return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Корзина</Badge>;
      case 'refund':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Возврат</Badge>;
      case 'tag':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Категория</Badge>;
      default:
        return <Badge>Прочее</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Журнал активности</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activityLogs.slice(0, limit).map((activity) => (
              <div key={activity.id} className="flex space-x-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                    <div>
                      {getActivityBadge(activity.type)}
                    </div>
                  </div>
                  {activity.entity && (
                    <div className="mt-2">
                      <p className="text-xs">
                        <span className="text-muted-foreground">Объект:</span>{' '}
                        <span className="font-medium">{activity.entity} {activity.entityId && `#${activity.entityId}`}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
