
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="relative flex h-[40vh] items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1526&q=80')" }}
          >
            <div className="container text-center">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                О нас
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-white/90">
                Узнайте историю нашей кондитерской и секреты наших лучших тортов
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-bold">Наша история</h2>
                <p className="text-muted-foreground">
                  Как всё начиналось и к чему мы пришли
                </p>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Кондитерская "Вкусные Торты" была основана в 2010 году небольшой командой энтузиастов, влюбленных в кондитерское искусство. 
                  Всё началось с маленькой кухни и нескольких рецептов, передававшихся из поколения в поколение.
                </p>
                
                <p>
                  Сегодня мы — одна из ведущих кондитерских в городе, специализирующаяся на изготовлении тортов и десертов по индивидуальным заказам. 
                  Наша миссия — создавать не просто вкусные, но и уникальные торты, которые станут центральным элементом любого праздника.
                </p>
                
                <p>
                  Мы гордимся тем, что используем только свежие, натуральные ингредиенты и не добавляем консерванты в наши изделия. 
                  Каждый торт изготавливается вручную с особой заботой и вниманием к деталям.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Our Team */}
        <section className="py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold">Наша команда</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Познакомьтесь с профессионалами, которые создают наши вкусные шедевры
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1587116987928-25ce6198be38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                    alt="Анна Иванова" 
                    className="h-48 w-48 object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Анна Иванова</h3>
                <p className="text-primary">Шеф-кондитер</p>
                <p className="mt-2 text-muted-foreground">
                  Более 15 лет опыта в создании эксклюзивных тортов и десертов
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1567966438017-a0c46bc5d989?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                    alt="Михаил Петров" 
                    className="h-48 w-48 object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Михаил Петров</h3>
                <p className="text-primary">Кондитер-декоратор</p>
                <p className="mt-2 text-muted-foreground">
                  Специалист по созданию уникального декора из мастики и шоколада
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                    alt="Сергей Сидоров" 
                    className="h-48 w-48 object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Сергей Сидоров</h3>
                <p className="text-primary">Технолог</p>
                <p className="mt-2 text-muted-foreground">
                  Разрабатывает новые рецепты и следит за качеством всех ингредиентов
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Testimonials */}
        <section className="bg-muted py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold">Отзывы наших клиентов</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Что говорят о нас те, кто уже попробовал наши торты
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-background p-6 shadow-sm">
                <div className="mb-4 text-2xl text-yellow-500">★★★★★</div>
                <p className="mb-4 italic">
                  "Заказывала торт на юбилей мужа. Все гости были в восторге! Торт не только красивый, но и очень вкусный. Обязательно буду заказывать еще."
                </p>
                <div className="font-semibold">Елена К.</div>
              </div>
              
              <div className="rounded-lg bg-background p-6 shadow-sm">
                <div className="mb-4 text-2xl text-yellow-500">★★★★★</div>
                <p className="mb-4 italic">
                  "Впервые попробовал их морковный торт и теперь это мой любимый десерт. Идеальный баланс специй и нежного крема. Рекомендую всем!"
                </p>
                <div className="font-semibold">Дмитрий В.</div>
              </div>
              
              <div className="rounded-lg bg-background p-6 shadow-sm">
                <div className="mb-4 text-2xl text-yellow-500">★★★★★</div>
                <p className="mb-4 italic">
                  "Заказывала торт на свадьбу. Кондитеры учли все наши пожелания и создали настоящий шедевр! Спасибо за то, что сделали наш день особенным."
                </p>
                <div className="font-semibold">Мария и Алексей</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
