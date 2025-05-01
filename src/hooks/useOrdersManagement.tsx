
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/order";
import { sampleOrders } from "@/types/order";

export const useOrdersManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Проверка авторизации
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const updateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
  };

  return {
    orders,
    filteredOrders,
    selectedOrder,
    showOrderDetails,
    statusFilter,
    setStatusFilter,
    updateOrderStatus,
    openOrderDetails,
    closeOrderDetails
  };
};
