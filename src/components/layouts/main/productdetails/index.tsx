import ProductDetailsSection from "@/components/sections/productDetails/productDetail";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const ProductDetailsPage = () => {
  return (
    <div>
      <DynamicBreadcrumb />
      <ProductDetailsSection />
    </div>
  );
};
