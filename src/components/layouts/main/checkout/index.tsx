import CheckoutPage from "@/components/sections/checkout/checkout";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Checkout = () => {
    return (
        <div>
        <DynamicBreadcrumb />
        <CheckoutPage />
        </div>
    );
    }