
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardContainerProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  }>;
  headerAction?: ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  isLoading?: boolean;
  minimalist?: boolean;
  fullWidth?: boolean;
}

/**
 * Универсальный контейнер для элементов дашборда
 */
export function DashboardContainer({
  title,
  description,
  className,
  children,
  actions,
  headerAction,
  collapsible = false,
  collapsed = false,
  onCollapseToggle,
  isLoading = false,
  minimalist = false,
  fullWidth = false,
}: DashboardContainerProps) {
  // Если используется минималистичный вариант без карточки
  if (minimalist) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            {headerAction}
            
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                      {action.icon}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className={isLoading ? "opacity-60 pointer-events-none" : ""}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      fullWidth ? "col-span-full" : "",
      className
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2",
        collapsible && "cursor-pointer select-none",
      )} onClick={collapsible ? onCollapseToggle : undefined}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        
        <div className="flex items-center gap-2">
          {headerAction}
          
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "transition-all duration-300",
        collapsed ? "h-0 p-0 overflow-hidden" : "",
        isLoading ? "opacity-60 pointer-events-none" : ""
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
