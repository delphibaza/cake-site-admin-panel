
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  children?: ReactNode;
  actionLabel?: string;
  actionIcon?: ReactNode;
  actionUrl?: string;
  onAction?: () => void;
  backUrl?: string;
  backLabel?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
  actionLabel,
  actionIcon,
  actionUrl,
  onAction,
  backUrl,
  backLabel = "Назад",
}: PageHeaderProps) {
  // Если есть действие (action) и URL или обработчик
  const hasAction = actionLabel && (actionUrl || onAction);
  
  // Если есть кнопка "Назад"
  const hasBackButton = backUrl;
  
  // Если есть хлебные крошки
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;

  return (
    <div className="mb-8 space-y-3">
      {/* Хлебные крошки */}
      {hasBreadcrumbs && (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">
                  <Home className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="opacity-80">{item.label}</span>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* Кнопка "Назад" */}
          {hasBackButton && (
            <Button
              variant="link"
              className="px-0 mb-1 text-muted-foreground flex items-center gap-1 text-sm h-auto"
              asChild
            >
              <Link to={backUrl}>
                <ChevronRight className="h-4 w-4 rotate-180" />
                {backLabel}
              </Link>
            </Button>
          )}
          
          {/* Заголовок и описание */}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        {/* Кнопка действия */}
        {hasAction && (
          actionUrl ? (
            <Button asChild>
              <Link to={actionUrl}>
                {actionIcon}
                {actionLabel}
              </Link>
            </Button>
          ) : (
            <Button onClick={onAction}>
              {actionIcon}
              {actionLabel}
            </Button>
          )
        )}
      </div>
      
      {/* Дополнительный контент */}
      {children}
    </div>
  );
}
