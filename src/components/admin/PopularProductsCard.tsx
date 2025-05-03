
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Plus, Cake } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductItem {
  id: number;
  name: string;
  sales: number;
  stock: number;
  trend: number;
}

interface PopularProductsCardProps {
  products: ProductItem[];
  onAddClick?: () => void;
  onViewAllClick?: () => void;
}

const PopularProductsCard = ({ products, onAddClick, onViewAllClick }: PopularProductsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Популярные товары</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={onViewAllClick}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Все товары</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                <Cake className="h-5 w-5 text-pink-500" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{product.name}</p>
                  <Badge variant={product.trend > 0 ? "outline" : "destructive"} className="ml-auto">
                    {product.trend > 0 ? "+" : ""}{product.trend}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{product.sales} продано</span>
                  <span>Остаток: {product.stock}</span>
                </div>
                <Progress value={product.stock > 10 ? 75 : 35} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onAddClick}
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Добавить новый товар
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PopularProductsCard;
