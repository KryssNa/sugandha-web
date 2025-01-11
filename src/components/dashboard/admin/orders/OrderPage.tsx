// pages/admin/orders.tsx

import { useDashboardFilters } from "@/hooks/dashboard/useFilters";
import { useOrders } from "@/hooks/dashboard/useOrders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrdersManagement, { Order } from "./OrderManagement";
import StatusUpdateModal from "./StatusUpdateModal";

const OrdersPage = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const router = useRouter();
    const {
        orders,
        loading,
        updateOrder,
        deleteOrder,
        filters: orderFilters,
        updateFilters
    } = useOrders();

    const {
        filters: dashboardFilters,
        updateFilter,
        resetFilters
    } = useDashboardFilters();

    const handleUpdateStatus = async (id: string, status: Order['status']) => {
        await updateOrder(id, { status });
        setSelectedOrder(null);
    };

    return (
        <div className="p-6">
            <OrdersManagement
                orders={orders}
                loading={loading}
                onViewOrder={(id) => {
                    const order = orders.find(o => o.id === id);
                    setSelectedOrder(order || null);
                }}
                onEditOrder={(id) => router.push(`/admin/orders/${id}/edit`)}
                onDeleteOrder={deleteOrder}
                onUpdateStatus={handleUpdateStatus}
            />

            <StatusUpdateModal
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

export default OrdersPage;