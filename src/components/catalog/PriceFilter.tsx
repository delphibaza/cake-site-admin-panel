
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  currentRange: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceFilter = ({ minPrice, maxPrice, currentRange, onChange }: PriceFilterProps) => {
  return (
    <AccordionItem value="price">
      <AccordionTrigger>Цена</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="pt-4">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={100}
              value={[currentRange[0], currentRange[1]]}
              onValueChange={(value) => onChange([value[0], value[1]])}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">{currentRange[0]} ₽</div>
            <div className="text-sm">{currentRange[1]} ₽</div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PriceFilter;
