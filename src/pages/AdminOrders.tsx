
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderDetailsDialog from "@/components/admin/OrderDetailsDialog";
import OrdersFilter from "@/components/admin/OrdersFilter";

const AdminOrders = () => {
  const {
    filteredOrders,
    selectedOrder,
    showOrderDetails,
    statusFilter,
    setStatusFilter,
    updateOrderStatus,
    openOrderDetails,
    closeOrderDetails
  } = useOrdersManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link to="/admin" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Управление заказами</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Список заказов</h2>
          <OrdersFilter 
            value={statusFilter}
            onValueChange={setStatusFilter}
          />
        </div>

        <OrdersTable 
          orders={filteredOrders}
          onViewDetails={openOrderDetails}
        />
      </div>

      <OrderDetailsDialog 
        open={showOrderDetails}
        onOpenChange={closeOrderDetails}
        order={selectedOrder}
        onStatusChange={updateOrderStatus}
      />
    </div>
  );
};

export default AdminOrders;
