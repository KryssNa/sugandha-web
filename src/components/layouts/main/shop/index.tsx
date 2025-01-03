import { ProductView } from "@/components/sections/shop/productView/productView";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Shop = () => {
  return (
    <div>
      <DynamicBreadcrumb />
      <ProductView />
    </div>
  );
};
