
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import UserProfileButton from "@/components/UserProfileButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/60">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-pink-600"
            >
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            <span className="hidden font-bold sm:inline-block">Sweet Cake</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-pink-600"
            >
              Главная
            </Link>
            <Link
              to="/catalog"
              className="text-sm font-medium transition-colors hover:text-pink-600"
            >
              Каталог
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-pink-600"
            >
              О нас
            </Link>
            <Link
              to="/contacts"
              className="text-sm font-medium transition-colors hover:text-pink-600"
            >
              Контакты
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="mr-2 text-slate-600 hover:text-slate-900">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          
          {/* Компонент профиля пользователя */}
          <UserProfileButton />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/"
                  className="hover:text-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  Главная
                </Link>
                <Link
                  to="/catalog"
                  className="hover:text-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  Каталог
                </Link>
                <Link
                  to="/about"
                  className="hover:text-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  О нас
                </Link>
                <Link
                  to="/contacts"
                  className="hover:text-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  Контакты
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
