
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: number;
  name: string;
  count: number;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const CategoryCard = ({ id, name, count, onView, onEdit }: CategoryCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
        <Tag className="h-12 w-12 text-white" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{name}</h3>
          <Badge variant="outline">{count} товаров</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onView && onView(id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Просмотр
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit && onEdit(id)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Редактировать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Иконка для редактирования
const Pencil = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export default CategoryCard;
