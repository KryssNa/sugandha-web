import CartSection from "@/components/sections/cart/cartSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Cart = () => {
  return (
    <div>
      <DynamicBreadcrumb />
      <CartSection />
    </div>
  );
};
