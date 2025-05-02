
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, LogOut, Loader2, Save, Package, Clock, CreditCard } from "lucide-react";

// Схема валидации профиля
const profileSchema = z.object({
  fullName: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!currentUser) {
    navigate("/login");
    return null;
  }
  
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || "",
      address: currentUser.address || "",
    },
  });
  
  const onSubmit = async (values: ProfileValues) => {
    try {
      setIsSubmitting(true);
      
      const success = await updateUserProfile({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
      });

      if (success) {
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные были успешно обновлены.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении профиля.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
      duration: 3000,
    });
  };

  // Получаем инициалы для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Боковая панель профиля */}
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://i.pravatar.cc/150?img=68" alt={currentUser.fullName} />
                  <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              
              <nav className="grid gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => {}}>
                  <User className="mr-2 h-4 w-4" /> Профиль
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => {}}>
                  <Package className="mr-2 h-4 w-4" /> Мои заказы
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => {}}>
                  <Clock className="mr-2 h-4 w-4" /> История
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => {}}>
                  <CreditCard className="mr-2 h-4 w-4" /> Способы оплаты
                </Button>
              </nav>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Выйти из аккаунта
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Подтверждение выхода</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите выйти из аккаунта?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                      Выйти
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            {/* Основное содержимое */}
            <div className="space-y-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Профиль</TabsTrigger>
                  <TabsTrigger value="orders">Заказы</TabsTrigger>
                  <TabsTrigger value="security">Безопасность</TabsTrigger>
                </TabsList>
                
                {/* Вкладка профиля */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Информация профиля</CardTitle>
                      <CardDescription>
                        Обновите ваши персональные данные и контактную информацию
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Имя и фамилия</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input disabled {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                  <Input placeholder="+7 (999) 123-45-67" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Адрес доставки</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ваш адрес" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="mt-4 bg-pink-600 hover:bg-pink-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Обновление...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Вкладка заказов */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Мои заказы</CardTitle>
                      <CardDescription>
                        История ваших заказов и их текущий статус
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16 text-muted-foreground">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">У вас пока нет заказов</h3>
                        <p className="mt-2 text-sm">
                          Ваши заказы будут отображаться здесь после оформления.
                        </p>
                        <Button className="mt-6 bg-pink-600 hover:bg-pink-700" onClick={() => navigate("/catalog")}>
                          Перейти в каталог
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Вкладка безопасности */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Безопасность аккаунта</CardTitle>
                      <CardDescription>
                        Управление паролем и настройки безопасности
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Изменение пароля</h3>
                        <Separator />
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Текущий пароль</Label>
                              <Input type="password" placeholder="••••••••" />
                            </div>
                            <div></div>
                            <div className="space-y-2">
                              <Label>Новый пароль</Label>
                              <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                              <Label>Подтверждение пароля</Label>
                              <Input type="password" placeholder="••••••••" />
                            </div>
                          </div>
                          <Button variant="outline">Изменить пароль</Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        Последний вход: {new Date().toLocaleDateString("ru-RU", { 
                          day: "numeric", 
                          month: "long", 
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Компонент Label для вкладки безопасности
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

export default Profile;
