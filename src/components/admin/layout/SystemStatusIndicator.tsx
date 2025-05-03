
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CheckCircle2, AlertCircle, AlertTriangle, ServerOff, Loader2,
  RefreshCw, Activity, Cpu, Database, MemoryStick, WifiOff 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SystemStatusIndicatorProps {
  status?: 'active' | 'warning' | 'error' | 'loading';
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkStatus: 'online' | 'offline' | 'degraded';
  responseTime: number; // в миллисекундах
  lastChecked: Date;
}

const SystemStatusIndicator = ({ status = 'active' }: SystemStatusIndicatorProps) => {
  const [ping, setPing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 28,
    memoryUsage: 42,
    diskUsage: 65,
    networkStatus: 'online',
    responseTime: 87,
    lastChecked: new Date()
  });
  const [loading, setLoading] = useState(false);
  
  // Имитация пинга системы
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(true);
      setTimeout(() => setPing(false), 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Периодическое обновление метрик
  useEffect(() => {
    const updateMetrics = () => {
      // Имитация запроса к серверу для получения актуальных метрик
      setMetrics({
        cpuUsage: Math.floor(Math.random() * 60) + 10,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        diskUsage: Math.floor(Math.random() * 20) + 60,
        networkStatus: Math.random() > 0.9 ? 'degraded' : 'online',
        responseTime: Math.floor(Math.random() * 150) + 50,
        lastChecked: new Date()
      });
    };

    const interval = setInterval(updateMetrics, 60000); // Обновляем каждую минуту
    
    return () => clearInterval(interval);
  }, []);

  // Обработчик обновления метрик вручную
  const handleRefreshMetrics = () => {
    setLoading(true);
    setTimeout(() => {
      // Имитация обновления метрик
      setMetrics({
        cpuUsage: Math.floor(Math.random() * 60) + 10,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        diskUsage: Math.floor(Math.random() * 20) + 60,
        networkStatus: Math.random() > 0.95 ? 'degraded' : 'online',
        responseTime: Math.floor(Math.random() * 150) + 50,
        lastChecked: new Date()
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusDetails = () => {
    switch (status) {
      case 'active': 
        return { 
          color: 'bg-green-500 dark:bg-green-600', 
          pulseColor: 'bg-green-500/40 dark:bg-green-600/40',
          text: 'Сервер активен',
          description: 'Все системы работают нормально',
          icon: <CheckCircle2 className="h-4 w-4" />
        };
      case 'warning': 
        return { 
          color: 'bg-yellow-500 dark:bg-yellow-600', 
          pulseColor: 'bg-yellow-500/40 dark:bg-yellow-600/40',
          text: 'Внимание',
          description: 'Высокая загрузка сервера',
          icon: <AlertTriangle className="h-4 w-4" />
        };
      case 'error': 
        return { 
          color: 'bg-red-500 dark:bg-red-600', 
          pulseColor: 'bg-red-500/40 dark:bg-red-600/40',
          text: 'Ошибка',
          description: 'Проблемы с подключением к серверу',
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'loading': 
        return { 
          color: 'bg-blue-500 dark:bg-blue-600', 
          pulseColor: 'bg-blue-500/40 dark:bg-blue-600/40',
          text: 'Соединение',
          description: 'Проверка соединения с сервером',
          icon: <Loader2 className="h-4 w-4 animate-spin" />
        };
      default: 
        return { 
          color: 'bg-gray-500', 
          pulseColor: 'bg-gray-500/40',
          text: 'Статус неизвестен',
          description: 'Невозможно определить статус сервера',
          icon: <ServerOff className="h-4 w-4" />
        };
    }
  };

  const { color, pulseColor, text, description, icon } = getStatusDetails();

  // Определение цвета индикатора для метрик
  const getMetricColor = (value: number) => {
    if (value > 80) return 'bg-red-500 dark:bg-red-600';
    if (value > 60) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-green-500 dark:bg-green-600';
  };

  return (
    <Popover open={showDetails} onOpenChange={setShowDetails}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="fixed bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-200"
        >
          <div className="relative">
            <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>
            {ping && (
              <span className={`absolute -inset-1 rounded-full ${pulseColor} animate-ping`}></span>
            )}
          </div>
          <span>{text}</span>
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              {icon}
              <span>Статус системы</span>
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleRefreshMetrics}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            {description}
          </div>
          
          <div className="space-y-3">
            {/* CPU Usage */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>CPU</span>
                </div>
                <span className="text-xs font-medium">{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" indicatorClassName={getMetricColor(metrics.cpuUsage)} />
            </div>
            
            {/* Memory Usage */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <MemoryStick className="h-3.5 w-3.5" />
                  <span>Память</span>
                </div>
                <span className="text-xs font-medium">{metrics.memoryUsage}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" indicatorClassName={getMetricColor(metrics.memoryUsage)} />
            </div>
            
            {/* Disk Usage */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  <span>Диск</span>
                </div>
                <span className="text-xs font-medium">{metrics.diskUsage}%</span>
              </div>
              <Progress value={metrics.diskUsage} className="h-2" indicatorClassName={getMetricColor(metrics.diskUsage)} />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t text-sm">
            <div className="flex items-center gap-1.5">
              {metrics.networkStatus === 'online' ? (
                <Activity className="h-3.5 w-3.5 text-green-500" />
              ) : metrics.networkStatus === 'degraded' ? (
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>Сеть:</span>
              <span className={
                metrics.networkStatus === 'online' 
                  ? 'text-green-500' 
                  : metrics.networkStatus === 'degraded' 
                    ? 'text-yellow-500' 
                    : 'text-red-500'
              }>
                {metrics.networkStatus === 'online' 
                  ? 'Онлайн' 
                  : metrics.networkStatus === 'degraded' 
                    ? 'Нестабильно' 
                    : 'Офлайн'}
              </span>
            </div>
            <span className="text-xs">{metrics.responseTime} мс</span>
          </div>
          
          <div className="text-xs text-muted-foreground text-right pt-1">
            Обновлено: {metrics.lastChecked.toLocaleTimeString('ru-RU')}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SystemStatusIndicator;
