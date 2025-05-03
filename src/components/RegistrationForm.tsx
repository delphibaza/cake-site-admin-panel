
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Loader2, ArrowRight, ShieldCheck, AlertCircle, Check } from "lucide-react";
import { PasswordStrengthMeter } from "./authentication/PasswordStrengthMeter";

// Схема валидации данных с улучшенной валидацией
const registrationSchema = z.object({
  fullName: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву" })
    .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" })
    .regex(/[^A-Za-z0-9]/, { message: "Пароль должен содержать хотя бы один спецсимвол" }),
  confirmPassword: z.string(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-\(\)]{10,15}$/, { message: "Введите корректный номер телефона" })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Вы должны принять условия для регистрации",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegistrationValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  // Отслеживаем изменения пароля для метрики силы
  const watchPassword = form.watch("password");

  // При изменении пароля очищаем ошибку подтверждения пароля
  const clearConfirmError = () => {
    if (form.formState.errors.confirmPassword) {
      form.clearErrors("confirmPassword");
    }
  };

  const onSubmit = async (values: RegistrationValues) => {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      // Отправка данных на регистрацию
      const { confirmPassword, acceptTerms, ...userData } = values;
      const success = await register(userData);

      if (success) {
        setRegistrationSuccess(true);
        toast({
          title: "Регистрация успешна!",
          description: "Вы успешно зарегистрировались и вошли в систему.",
          duration: 3000,
        });
        
        // Редирект с небольшой задержкой, чтобы пользователь увидел сообщение об успехе
        setTimeout(() => navigate("/"), 1500);
      } else {
        setRegistrationError("Пользователь с таким email уже существует.");
        toast({
          title: "Ошибка регистрации",
          description: "Пользователь с таким email уже существует.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      setRegistrationError("Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.");
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Регистрация успешна!</CardTitle>
          <CardDescription>
            Ваша учетная запись создана. Сейчас вы будете перенаправлены на главную страницу.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <UserPlus className="h-12 w-12 text-pink-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-pink-800">Регистрация</CardTitle>
        <CardDescription>
          Создайте учетную запись, чтобы делать заказы и отслеживать их статус
        </CardDescription>
      </CardHeader>
      
      {registrationError && (
        <div className="px-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя и фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите ваше полное имя" {...field} autoComplete="name" />
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
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      {...field} 
                      autoComplete="email" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Минимум 8 символов" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          clearConfirmError();
                        }}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    {watchPassword && <PasswordStrengthMeter password={watchPassword} />}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Повторите пароль" 
                        {...field}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="text-sm text-muted-foreground">
              Дополнительная информация (необязательно)
            </div>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+7 (999) 123-45-67" 
                      {...field} 
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Будет использоваться для связи по заказам
                  </FormDescription>
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
                    <Input 
                      placeholder="Ваш адрес" 
                      {...field} 
                      autoComplete="street-address"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Вы сможете изменить адрес при оформлении заказа
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Условия использования</FormLabel>
                    <FormDescription className="text-xs">
                      Я согласен с <Link to="/terms" className="text-pink-600 hover:text-pink-800 underline underline-offset-4">условиями использования</Link> и <Link to="/privacy" className="text-pink-600 hover:text-pink-800 underline underline-offset-4">политикой конфиденциальности</Link>
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="flex items-center justify-center w-full text-xs text-muted-foreground gap-1 mb-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Ваши данные надежно защищены</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Создание аккаунта...
                </>
              ) : (
                "Создать аккаунт"
              )}
            </Button>
            
            <div className="text-sm text-center">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-800">
                Войти <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegistrationForm;
