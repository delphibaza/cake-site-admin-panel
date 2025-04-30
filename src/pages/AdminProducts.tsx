
import { Link } from "react-router-dom";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useProductsManagement } from "@/hooks/useProductsManagement";
import ProductsTable from "@/components/admin/ProductsTable";
import ProductForm from "@/components/admin/ProductForm";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

const AdminProducts = () => {
  const {
    productsList,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentProduct,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    openEditDialog,
    openDeleteDialog
  } = useProductsManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link to="/admin" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Управление товарами</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Список товаров</h2>
          <Button 
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Добавить товар
          </Button>
        </div>

        <ProductsTable 
          products={productsList}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      </div>

      {/* Диалог добавления товара */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddDialogOpen(false)}
            buttonText="Добавить товар"
          />
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования товара */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={currentProduct}
            onSubmit={handleEditProduct}
            onCancel={() => setIsEditDialogOpen(false)}
            buttonText="Сохранить изменения"
          />
        </DialogContent>
      </Dialog>

      {/* Диалог удаления товара */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
          </DialogHeader>
          <DeleteConfirmDialog
            product={currentProduct}
            onDelete={handleDeleteProduct}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
