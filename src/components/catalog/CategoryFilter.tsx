
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Category = 'all' | 'chocolate' | 'fruit' | 'classic' | 'wedding' | 'kids';

export const categories: { id: Category; name: string }[] = [
  { id: 'all', name: 'Все торты' },
  { id: 'chocolate', name: 'Шоколадные' },
  { id: 'fruit', name: 'Фруктовые' },
  { id: 'classic', name: 'Классические' },
  { id: 'wedding', name: 'Свадебные' },
  { id: 'kids', name: 'Детские' }
];

interface CategoryFilterProps {
  selectedCategory: Category;
  onChange: (category: Category) => void;
}

const CategoryFilter = ({ selectedCategory, onChange }: CategoryFilterProps) => {
  return (
    <AccordionItem value="category">
      <AccordionTrigger>Категории</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`}
                checked={selectedCategory === category.id}
                onCheckedChange={() => 
                  onChange(category.id)
                }
              />
              <Label 
                htmlFor={`category-${category.id}`}
                className="cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoryFilter;
