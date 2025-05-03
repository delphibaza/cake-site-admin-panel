
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewCategoryCardProps {
  onClick: () => void;
}

const NewCategoryCard = ({ onClick }: NewCategoryCardProps) => {
  return (
    <Card className="border-2 border-dashed flex flex-col items-center justify-center h-[208px] cursor-pointer hover:bg-gray-50/50" onClick={onClick}>
      <Plus className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm font-medium text-gray-600">Добавить категорию</p>
      <Button variant="ghost" size="sm" className="mt-2">
        Создать новую
      </Button>
    </Card>
  );
};

export default NewCategoryCard;
