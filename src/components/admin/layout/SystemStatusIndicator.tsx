
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SystemStatusIndicatorProps {
  status?: 'active' | 'warning' | 'error' | 'loading';
}

const SystemStatusIndicator = ({ status = 'active' }: SystemStatusIndicatorProps) => {
  const [ping, setPing] = useState(false);
  
  // Имитация пинга системы
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(true);
      setTimeout(() => setPing(false), 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusDetails = () => {
    switch (status) {
      case 'active': 
        return { 
          color: 'bg-green-500', 
          pulseColor: 'bg-green-500/40',
          text: 'Сервер активен',
          description: 'Все системы работают нормально'
        };
      case 'warning': 
        return { 
          color: 'bg-yellow-500', 
          pulseColor: 'bg-yellow-500/40',
          text: 'Внимание',
          description: 'Высокая загрузка сервера'
        };
      case 'error': 
        return { 
          color: 'bg-red-500', 
          pulseColor: 'bg-red-500/40',
          text: 'Ошибка',
          description: 'Проблемы с подключением к серверу'
        };
      case 'loading': 
        return { 
          color: 'bg-blue-500', 
          pulseColor: 'bg-blue-500/40',
          text: 'Соединение',
          description: 'Проверка соединения с сервером'
        };
      default: 
        return { 
          color: 'bg-gray-500', 
          pulseColor: 'bg-gray-500/40',
          text: 'Статус неизвестен',
          description: 'Невозможно определить статус сервера'
        };
    }
  };

  const { color, pulseColor, text, description } = getStatusDetails();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-200 cursor-default">
            <div className="relative">
              <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>
              {ping && (
                <span className={`absolute -inset-1 rounded-full ${pulseColor} animate-ping`}></span>
              )}
            </div>
            <span>{text}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[200px]">
          <p>{description}</p>
          <p className="text-muted-foreground mt-1">Последняя проверка: {new Date().toLocaleTimeString('ru-RU')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SystemStatusIndicator;
