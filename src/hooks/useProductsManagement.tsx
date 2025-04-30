
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/components/ProductCard";
import { products as initialProducts } from "@/data/products";

export const useProductsManagement = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleAddProduct = (formData: Omit<Product, "id">) => {
    const newProduct: Product = {
      id: productsList.length + 1,
      ...formData
    };
    setProductsList([...productsList, newProduct]);
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (formData: Omit<Product, "id">) => {
    if (!currentProduct) return;
    
    const updatedProducts = productsList.map(product => 
      product.id === currentProduct.id 
        ? { ...product, ...formData } 
        : product
    );
    
    setProductsList(updatedProducts);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
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
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return {
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
  };
};
