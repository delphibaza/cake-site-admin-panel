
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Product } from "@/components/ProductCard";

interface DeleteConfirmDialogProps {
  product: Product | null;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteConfirmDialog = ({ 
  product, 
  onDelete, 
  onCancel 
}: DeleteConfirmDialogProps) => {
  if (!product) return null;
  
  return (
    <>
      <p className="py-4">
        Вы уверены, что хотите удалить товар "{product.name}"? Это действие невозможно отменить.
      </p>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          type="button" 
          variant="destructive"
          onClick={onDelete}
        >
          Удалить товар
        </Button>
      </DialogFooter>
    </>
  );
};

export default DeleteConfirmDialog;
