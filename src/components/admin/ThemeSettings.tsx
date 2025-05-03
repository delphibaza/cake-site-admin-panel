
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, Moon, PaintBucket, Sun, Monitor } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";

export default function ThemeSettings() {
  const { mode, color, setMode, setColor } = useAdminTheme();
  const [open, setOpen] = useState(false);

  // Доступные темы
  const themes = [
    { value: "light", label: "Светлая", icon: Sun },
    { value: "dark", label: "Темная", icon: Moon },
    { value: "system", label: "Системная", icon: Monitor },
  ] as const;

  // Доступные цветовые схемы
  const colors = [
    { value: "blue", label: "Синяя", color: "#0086E6" },
    { value: "purple", label: "Фиолетовая", color: "#9b87f5" },
    { value: "green", label: "Зеленая", color: "#2ECC71" },
    { value: "pink", label: "Розовая", color: "#E91E63" },
    { value: "orange", label: "Оранжевая", color: "#F39C12" },
  ] as const;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Настройки темы">
          <PaintBucket className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          {/* Выбор режима темы */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Режим</h4>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <Button
                    key={theme.value}
                    variant={mode === theme.value ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setMode(theme.value)}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {theme.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Выбор цветовой схемы */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Основной цвет</h4>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((item) => (
                <Button
                  key={item.value}
                  variant="outline"
                  size="sm"
                  className="flex h-8 w-8 p-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.color }}
                  onClick={() => setColor(item.value)}
                  aria-label={item.label}
                >
                  {color === item.value && <Check className="h-4 w-4 text-white" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
