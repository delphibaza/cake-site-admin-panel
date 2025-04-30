
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 text-lg font-bold">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          size="sm"
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          В корзину
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to={`/product/${product.id}`}>
            Подробнее
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
