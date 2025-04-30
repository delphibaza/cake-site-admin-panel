
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Вкусные Торты</h3>
            <p className="text-sm text-muted-foreground">
              Лучшие торты для ваших праздников и важных событий
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-foreground">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-muted-foreground hover:text-foreground">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Телефон: +7 (123) 456-78-90
              </li>
              <li className="text-muted-foreground">
                Email: info@vkusnyetorty.ru
              </li>
              <li className="text-muted-foreground">
                Адрес: г. Москва, ул. Тортовая, 123
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Время работы</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Пн-Пт: 9:00 - 20:00
              </li>
              <li className="text-muted-foreground">
                Сб: 10:00 - 18:00
              </li>
              <li className="text-muted-foreground">
                Вс: 10:00 - 16:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Вкусные Торты. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
