
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { Product } from "@/components/ProductCard";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (formData: Omit<Product, "id">) => void;
  onCancel: () => void;
  buttonText: string;
}

const ProductForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  buttonText 
}: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        image: initialData.image
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Название</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Цена</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">URL изображения</Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="image"
            value={formData.image}
            onChange={handleChange}
            className="flex-grow"
            placeholder="https://example.com/image.jpg"
          />
          <Button size="icon" variant="outline">
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Label htmlFor="description" className="text-right">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          type="button" 
          className="bg-pink-600 hover:bg-pink-700" 
          onClick={handleSubmit}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
