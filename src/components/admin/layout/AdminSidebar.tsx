
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { AdminNavItem, SystemInfo } from "../types/admin";

interface AdminSidebarProps {
  mainNavItems: AdminNavItem[];
  analyticsItems: AdminNavItem[];
  settingsItems: AdminNavItem[];
  isActive: (path: string) => boolean;
  systemInfo: SystemInfo;
  onUpdateSystem: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AdminSidebar = ({ 
  mainNavItems, 
  analyticsItems,
  settingsItems, 
  isActive, 
  systemInfo,
  onUpdateSystem,
  isCollapsed,
  toggleCollapse
}: AdminSidebarProps) => {
  // Компонент навигационной секции
  const NavSection = ({ 
    items, 
    title, 
    className = "" 
  }: { 
    items: AdminNavItem[]; 
    title?: string; 
    className?: string; 
  }) => {
    return (
      <div className={`py-2 ${className}`}>
        {title && !isCollapsed && (
          <h3 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
            {title}
          </h3>
        )}
        <nav className="grid gap-1 px-2">
          {items.map((item) => {
            const isActiveItem = isActive(item.path);
            
            // Создаем кнопку навигации
            const NavButton = (
              <Button 
                variant={isActiveItem ? "secondary" : "ghost"} 
                className={`w-full justify-start ${isCollapsed ? 'h-10 w-10 p-0 justify-center' : ''}`}
              >
                {item.icon && (
                  <span className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`}>
                    {item.icon}
                  </span>
                )}
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Button>
            );
            
            // Если меню свернуто, оборачиваем в тултип
            return (
              <div key={item.path}>
                {isCollapsed ? (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={`/admin${item.path ? `/${item.path}` : ''}`}>
                          {NavButton}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col gap-1">
                        <span className="font-medium">{item.name}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        )}
                        {item.badge && (
                          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary font-medium">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link to={`/admin${item.path ? `/${item.path}` : ''}`}>
                    {NavButton}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <aside className={`hidden md:flex border-r dark:border-gray-700 flex-col py-6 overflow-hidden transition-all duration-300 ${
      isCollapsed ? 'md:w-[64px]' : 'md:w-[220px] lg:w-[240px]'
    }`}>
      {/* Основная навигация */}
      <NavSection items={mainNavItems} title="Управление" />
      
      {/* Аналитика */}
      <NavSection items={analyticsItems} title="Аналитика" className="mt-4" />
      
      {/* Настройки */}
      <NavSection items={settingsItems} title="Настройки" className="mt-4" />
      
      {/* Информация о системе и кнопка сворачивания */}
      <div className="mt-auto px-3 flex flex-col gap-3">
        {/* Карточка системной информации (только при развернутом сайдбаре) */}
        {!isCollapsed && (
          <Card className="bg-card/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Система v{systemInfo.version}</CardTitle>
              <CardDescription className="text-xs">
                {systemInfo.lastUpdate}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {systemInfo.hasUpdate ? (
                <div className="text-xs text-muted-foreground">
                  <p>Новая версия панели доступна!</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full text-xs"
                    onClick={onUpdateSystem}
                  >
                    Обновить сейчас
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  <p>Система обновлена до последней версии.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Кнопка сворачивания/разворачивания меню */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleCollapse}
          className={`${isCollapsed ? 'mx-auto w-9 h-9 p-0' : ''}`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Свернуть меню
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
