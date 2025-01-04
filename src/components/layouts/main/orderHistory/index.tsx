import OrderHistorySection from "@/components/sections/order history/orderHistory"
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb"

export const OrderHistory = () => {

    return (
        <>
            <DynamicBreadcrumb />
            <OrderHistorySection />
        </>
    )

}