
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Tag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Типы данных для категорий
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Схема формы для создания/редактирования категории
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Название категории должно содержать не менее 2 символов",
  }),
  slug: z.string().min(2, {
    message: "URL-идентификатор должен содержать не менее 2 символов",
  }).regex(/^[a-z0-9-]+$/, {
    message: "URL-идентификатор может содержать только строчные буквы, цифры и дефисы",
  }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    message: "Выберите статус категории",
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Демонстрационные данные категорий
const demoCategories: Category[] = [
  {
    id: 1,
    name: "Шоколадные торты",
    slug: "chocolate-cakes",
    description: "Разнообразные торты с шоколадом",
    productsCount: 12,
    status: "active",
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    name: "Фруктовые торты",
    slug: "fruit-cakes",
    description: "Торты с различными фруктами",
    productsCount: 8,
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "Свадебные торты",
    slug: "wedding-cakes",
    description: "Торты для свадебных мероприятий",
    productsCount: 5,
    status: "active",
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    name: "Детские торты",
    slug: "kids-cakes",
    description: "Торты для детских праздников",
    productsCount: 7,
    status: "active",
    createdAt: "2024-01-25"
  },
  {
    id: 5,
    name: "Низкокалорийные торты",
    slug: "low-calorie-cakes",
    description: "Десерты с пониженным содержанием сахара и калорий",
    productsCount: 3,
    status: "inactive",
    createdAt: "2024-02-05"
  },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Category>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Инициализация форм
  const addForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "active",
    },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "active",
    },
  });

  // Функции для сортировки и фильтрации
  const getSortedAndFilteredCategories = () => {
    let filtered = [...categories];
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        cat => cat.name.toLowerCase().includes(query) || 
               cat.description.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(cat => cat.status === statusFilter);
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

  // Обработчики действий с категориями
  const handleAddCategory = (data: CategoryFormValues) => {
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      productsCount: 0,
      status: data.status as 'active' | 'inactive',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  const handleEditCategory = (data: CategoryFormValues) => {
    if (!editingCategory) return;
    
    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id 
        ? { 
            ...cat, 
            name: data.name, 
            slug: data.slug, 
            description: data.description || "", 
            status: data.status as 'active' | 'inactive' 
          } 
        : cat
    );
    
    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (deleteId === null) return;
    
    setCategories(categories.filter(cat => cat.id !== deleteId));
    setDeleteId(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status
    });
    setIsEditDialogOpen(true);
  };

  // Генерация URL из названия для поля slug
  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (name: string, formInstance: any) => {
    formInstance.setValue("name", name);
    
    // Только если slug пустой или не редактировался, обновляем его автоматически
    const currentSlug = formInstance.getValues("slug");
    if (!currentSlug) {
      formInstance.setValue("slug", generateSlugFromName(name));
    }
  };

  // Переключение направления сортировки
  const toggleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Получение отфильтрованных и отсортированных категорий
  const filteredCategories = getSortedAndFilteredCategories();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Link to="/admin">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Категории товаров</h1>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать категорию
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="grid">Сетка</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск категорий..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Фильтр
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Статус</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Все категории
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Активные
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Неактивные
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="h-9" onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setSortField("name");
              setSortDirection("asc");
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>
        </div>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Все категории ({filteredCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th 
                        className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted"
                        onClick={() => toggleSort('name')}
                      >
                        <div className="flex items-center">
                          Название
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Slug</th>
                      <th 
                        className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted"
                        onClick={() => toggleSort('productsCount')}
                      >
                        <div className="flex items-center">
                          Товары
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Статус</th>
                      <th 
                        className="px-4 py-3.5 text-left text-sm font-semibold cursor-pointer hover:bg-muted" 
                        onClick={() => toggleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Создана
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-muted/50">
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                          {category.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                          {category.slug}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          {category.productsCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          <Badge variant={category.status === 'active' ? "default" : "secondary"}>
                            {category.status === 'active' ? 'Активна' : 'Неактивна'}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(category.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredCategories.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Tag className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-semibold">Категории не найдены</h3>
                    <p className="text-muted-foreground">Попробуйте изменить критерии поиска или фильтрации.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-white" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge variant={category.status === 'active' ? "default" : "secondary"}>
                      {category.productsCount} товаров
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {category.description || 'Без описания'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="overflow-hidden border-2 border-dashed flex flex-col items-center justify-center h-[232px] cursor-pointer hover:bg-muted/50" onClick={() => setIsAddDialogOpen(true)}>
              <div className="p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Добавить категорию</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Создайте новую категорию для ваших товаров
                </p>
              </div>
            </Card>
          </div>
          
          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Tag className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold">Категории не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить критерии поиска или фильтрации.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Диалог добавления категории */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Добавить категорию</DialogTitle>
            <DialogDescription>
              Создайте новую категорию для группировки товаров
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название категории</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Например: Шоколадные торты" 
                        {...field} 
                        onChange={(e) => handleNameChange(e.target.value, addForm)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL-идентификатор (slug)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="chocolate-cakes" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание (необязательно)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Краткое описание категории" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Активная</SelectItem>
                        <SelectItem value="inactive">Неактивная</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Создать категорию</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования категории */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Редактировать категорию</DialogTitle>
            <DialogDescription>
              Изменение параметров категории товаров
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название категории</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Например: Шоколадные торты" 
                        {...field} 
                        onChange={(e) => handleNameChange(e.target.value, editForm)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL-идентификатор (slug)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="chocolate-cakes" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание (необязательно)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Краткое описание категории" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Активная</SelectItem>
                        <SelectItem value="inactive">Неактивная</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Сохранить изменения</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
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

export default AdminCategories;
