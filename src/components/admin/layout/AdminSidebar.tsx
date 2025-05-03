
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminNavItem } from "../types/admin";

interface AdminSidebarProps {
  navItems: AdminNavItem[];
  settingsItems: AdminNavItem[];
  isActive: (path: string) => boolean;
  systemInfo: {
    version: string;
    lastUpdate: string;
    hasUpdate: boolean;
  };
  onUpdateSystem: () => void;
}

const AdminSidebar = ({ 
  navItems, 
  settingsItems, 
  isActive, 
  systemInfo,
  onUpdateSystem
}: AdminSidebarProps) => {
  return (
    <aside className="hidden md:flex border-r flex-col space-y-6 py-6">
      <nav className="grid gap-1 px-2">
        {navItems.map((item) => (
          <Link key={item.path} to={`/admin${item.path ? `/${item.path}` : ''}`}>
            <Button 
              variant={isActive(item.path) ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              {item.icon} {item.name}
              {item.badge && (
                <span className="ml-auto rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
                  {item.badge}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="px-3 py-2">
        <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight">Настройки</h3>
        <nav className="grid gap-1 px-2">
          {settingsItems.map((item) => (
            <Link key={item.path} to={`/admin/${item.path}`}>
              <Button 
                variant={isActive(item.path) ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                {item.icon} {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Система v{systemInfo.version}</CardTitle>
            <CardDescription className="text-xs">
              Последнее обновление: {systemInfo.lastUpdate}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {systemInfo.hasUpdate ? (
              <div className="text-xs text-muted-foreground">
                <p>Новая версия панели управления доступна!</p>
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
                <p>Ваша система обновлена до последней версии.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default AdminSidebar;
