
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { products } from "@/data/products";
import { Product } from "@/components/ProductCard";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: ""
  });

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: productsList.length + 1,
      ...formData
    };
    setProductsList([...productsList, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = productsList.map(product => 
      product.id === currentProduct.id 
        ? { ...product, ...formData } 
        : product
    );
    
    setProductsList(updatedProducts);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    resetForm();
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const filteredProducts = productsList.filter(
      product => product.id !== currentProduct.id
    );
    
    setProductsList(filteredProducts);
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image: ""
    });
  };

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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[80px]">Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="hidden md:table-cell">Описание</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>{product.price} ₽</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Диалог добавления товара */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Название</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Цена</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">URL изображения</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="button" className="bg-pink-600 hover:bg-pink-700" onClick={handleAddProduct}>
              Добавить товар
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования товара */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Название</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Цена</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">URL изображения</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="flex-grow"
                />
                <Button size="icon" variant="outline">
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="edit-description" className="text-right">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="button" className="bg-pink-600 hover:bg-pink-700" onClick={handleEditProduct}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления товара */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Вы уверены, что хотите удалить товар "{currentProduct?.name}"? Это действие невозможно отменить.
          </p>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Удалить товар
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
