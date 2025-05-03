
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("bg-gray-200");

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      
      // Длина пароля
      if (password.length >= 8) score += 20;
      if (password.length >= 12) score += 10;
      
      // Наличие разных типов символов
      if (/[A-Z]/.test(password)) score += 15;
      if (/[a-z]/.test(password)) score += 15;
      if (/[0-9]/.test(password)) score += 15;
      if (/[^A-Za-z0-9]/.test(password)) score += 15;
      
      // Разнообразие символов
      const uniqueChars = new Set(password).size;
      score += Math.min(10, uniqueChars * 2);
      
      return Math.min(100, score);
    };

    const strength = calculateStrength();
    setStrength(strength);

    if (strength < 30) {
      setLabel("Слабый");
      setColor("bg-red-500");
    } else if (strength < 60) {
      setLabel("Средний");
      setColor("bg-yellow-500");
    } else if (strength < 80) {
      setLabel("Хороший");
      setColor("bg-green-400");
    } else {
      setLabel("Отличный");
      setColor("bg-green-600");
    }
  }, [password]);

  return (
    <div className="w-full space-y-1">
      <Progress value={strength} className={`h-1.5 ${color}`} />
      <p className="text-xs text-muted-foreground flex justify-between">
        <span>Надежность:</span>
        <span className={`font-medium 
          ${color === "bg-red-500" ? "text-red-500" : ""}
          ${color === "bg-yellow-500" ? "text-yellow-600" : ""}
          ${color === "bg-green-400" ? "text-green-500" : ""}
          ${color === "bg-green-600" ? "text-green-600" : ""}
        `}>
          {label}
        </span>
      </p>
    </div>
  );
};
