
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SpecialFiltersProps {
  selectedFilters: string[];
  onToggle: (filter: string) => void;
}

const SpecialFilters = ({ selectedFilters, onToggle }: SpecialFiltersProps) => {
  return (
    <AccordionItem value="special">
      <AccordionTrigger>Дополнительно</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-inStock"
              checked={selectedFilters.includes('inStock')}
              onCheckedChange={() => onToggle('inStock')}
            />
            <Label htmlFor="filter-inStock" className="cursor-pointer">
              В наличии
            </Label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SpecialFilters;
