
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  ArrowUpDown,
  CheckCircle,
  Eye,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
  Trash2,
  XCircle,
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Типы для отзывов
interface Review {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  text: string;
  status: 'published' | 'pending' | 'rejected';
  createdAt: string;
}

// Демо-данные для отзывов
const demoReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    productName: "Шоколадный торт",
    customerName: "Анна Иванова",
    customerAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Восхитительный торт! Очень нежный и в меру сладкий. Оформление точно как на фото. Доставили вовремя, всё было идеально. Обязательно закажу снова!",
    status: "published",
    createdAt: "2025-04-15"
  },
  {
    id: 2,
    productId: 2,
    productName: "Медовик",
    customerName: "Сергей Петров",
    customerAvatar: "https://i.pravatar.cc/150?img=8",
    rating: 4,
    text: "Торт очень вкусный, но немного сухой. Медовые коржи пропитаны хорошо, но хотелось бы чуть больше крема. В целом доволен заказом.",
    status: "published",
    createdAt: "2025-04-12"
  },
  {
    id: 3,
    productId: 3,
    productName: "Наполеон",
    customerName: "Мария Сидорова",
    customerAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 2,
    text: "Заказывала торт на день рождения. К сожалению, он оказался совсем не таким, как я ожидала. Коржи были влажными, крем растекался. Очень расстроена.",
    status: "published",
    createdAt: "2025-04-10"
  },
  {
    id: 4,
    productId: 1,
    productName: "Шоколадный торт",
    customerName: "Дмитрий Николаев",
    rating: 5,
    text: "Отличный торт! Заказывал на юбилей, все гости были в восторге. Шоколад настоящий, не приторно сладкий. Оформление на высшем уровне!",
    status: "pending",
    createdAt: "2025-04-18"
  },
  {
    id: 5,
    productId: 4,
    productName: "Красный бархат",
    customerName: "Елена Козлова",
    customerAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 3,
    text: "Торт выглядит красиво, но вкус немного разочаровал. Ожидала более насыщенный вкус. Доставка была вовремя, упаковка хорошая.",
    status: "pending",
    createdAt: "2025-04-17"
  },
  {
    id: 6,
    productId: 5,
    productName: "Фруктовый торт",
    customerName: "Алексей Смирнов",
    customerAvatar: "https://i.pravatar.cc/150?img=12",
    rating: 1,
    text: "Ужасный сервис! Торт доставили на час позже, чем обещали. Фрукты были не первой свежести. Больше не буду заказывать в этой кондитерской.",
    status: "rejected",
    createdAt: "2025-04-14"
  },
  {
    id: 7,
    productId: 2,
    productName: "Медовик",
    customerName: "Ольга Кузнецова",
    customerAvatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "Заказывала медовик на свой день рождения. Это был самый вкусный торт, который я когда-либо пробовала! Спасибо за прекрасный десерт!",
    status: "pending",
    createdAt: "2025-04-19"
  }
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Review>("createdAt");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  // Функции для сортировки и фильтрации
  const getSortedAndFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        review => 
          review.customerName.toLowerCase().includes(query) || 
          review.productName.toLowerCase().includes(query) ||
          review.text.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter);
    }
    
    // Фильтрация по рейтингу
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        // Для числовых полей
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
    });
    
    return filtered;
  };

  // Обработчики действий с отзывами
  const handleApproveReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'published' } : review
    ));
  };

  const handleRejectReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'rejected' } : review
    ));
  };

  const handleDeleteReview = () => {
    if (deleteId === null) return;
    
    setReviews(reviews.filter(review => review.id !== deleteId));
    setDeleteId(null);
  };

  // Переключение направления сортировки
  const toggleSort = (field: keyof Review) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Получение статуса отзыва в виде бейджа
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Опубликован</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">На проверке</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонен</Badge>;
      default:
        return null;
    }
  };

  // Получение звездного рейтинга в виде компонента
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Получение инициалов для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Получение отфильтрованных и отсортированных отзывов
  const filteredReviews = getSortedAndFilteredReviews();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Link to="/admin">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Отзывы клиентов</h1>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500">
            {reviews.filter(r => r.status === 'published').length} опубликовано
          </Badge>
          <Badge className="bg-amber-500">
            {reviews.filter(r => r.status === 'pending').length} на проверке
          </Badge>
          <Badge className="bg-red-500">
            {reviews.filter(r => r.status === 'rejected').length} отклонено
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск отзывов..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Фильтры
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Статус</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Все отзывы
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                Опубликованные
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                На проверке
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Отклоненные
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Рейтинг</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setRatingFilter(null)}>
                Любой рейтинг
              </DropdownMenuItem>
              {[5, 4, 3, 2, 1].map(rating => (
                <DropdownMenuItem key={rating} onClick={() => setRatingFilter(rating)}>
                  <div className="flex items-center">
                    {rating} {rating === 1 ? 'звезда' : rating < 5 ? 'звезды' : 'звезд'}
                    <div className="ml-2">{renderStarRating(rating)}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="h-9" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setRatingFilter(null);
            setSortField("createdAt");
            setSortDirection("desc");
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Сбросить
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все отзывы</TabsTrigger>
          <TabsTrigger value="pending">На проверке</TabsTrigger>
          <TabsTrigger value="published">Опубликованные</TabsTrigger>
          <TabsTrigger value="rejected">Отклоненные</TabsTrigger>
        </TabsList>
        
        {['all', 'pending', 'published', 'rejected'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">
                  {tabValue === 'all' && 'Все отзывы'}
                  {tabValue === 'pending' && 'Отзывы на проверке'}
                  {tabValue === 'published' && 'Опубликованные отзывы'}
                  {tabValue === 'rejected' && 'Отклоненные отзывы'}
                  {' '}
                  ({filteredReviews.filter(r => tabValue === 'all' || r.status === tabValue).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Клиент</th>
                        <th 
                          className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort('productName')}
                        >
                          <div className="flex items-center">
                            Товар
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort('rating')}
                        >
                          <div className="flex items-center">
                            Рейтинг
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Отзыв</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Статус</th>
                        <th 
                          className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort('createdAt')}
                        >
                          <div className="flex items-center">
                            Дата
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 text-right text-sm font-semibold">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredReviews
                        .filter(review => tabValue === 'all' || review.status === tabValue)
                        .map((review) => (
                        <tr key={review.id} className="hover:bg-muted/50">
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                                <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{review.customerName}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            {review.productName}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            {renderStarRating(review.rating)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <p className="line-clamp-2">{review.text}</p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            {getStatusBadge(review.status)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                            <div className="flex justify-end items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setViewingReview(review)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {review.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-green-500"
                                    onClick={() => handleApproveReview(review.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500"
                                    onClick={() => handleRejectReview(review.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setViewingReview(review)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Просмотреть
                                  </DropdownMenuItem>
                                  
                                  {review.status === 'pending' && (
                                    <>
                                      <DropdownMenuItem 
                                        onClick={() => handleApproveReview(review.id)}
                                        className="text-green-600"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Одобрить
                                      </DropdownMenuItem>
                                      
                                      <DropdownMenuItem 
                                        onClick={() => handleRejectReview(review.id)}
                                        className="text-amber-600"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Отклонить
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem 
                                    onClick={() => setDeleteId(review.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Удалить
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredReviews.filter(r => tabValue === 'all' || r.status === tabValue).length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-semibold">Отзывы не найдены</h3>
                      <p className="text-muted-foreground">Попробуйте изменить критерии поиска или фильтрации.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Модальное окно просмотра отзыва */}
      <AlertDialog 
        open={viewingReview !== null} 
        onOpenChange={() => setViewingReview(null)}
      >
        <AlertDialogContent className="max-w-md">
          {viewingReview && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Отзыв к товару "{viewingReview.productName}"</AlertDialogTitle>
              </AlertDialogHeader>
              
              <div className="space-y-4 my-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={viewingReview.customerAvatar} alt={viewingReview.customerName} />
                      <AvatarFallback>{getInitials(viewingReview.customerName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{viewingReview.customerName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(viewingReview.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div>
                    {getStatusBadge(viewingReview.status)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Рейтинг:</span>
                    {renderStarRating(viewingReview.rating)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Текст отзыва:</h4>
                    <p className="mt-1 text-sm">{viewingReview.text}</p>
                  </div>
                </div>
              </div>
              
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel>Закрыть</AlertDialogCancel>
                
                {viewingReview.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        handleRejectReview(viewingReview.id);
                        setViewingReview(null);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Отклонить
                    </Button>
                    
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveReview(viewingReview.id);
                        setViewingReview(null);
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Опубликовать
                    </Button>
                  </>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviews;
