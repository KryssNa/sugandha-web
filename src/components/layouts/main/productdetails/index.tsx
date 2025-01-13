import ProductDetailsSection from "@/components/sections/productDetails/productDetail";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage = ({ slug }: ProductDetailsPageProps) => {
  return (
    <div>
      <DynamicBreadcrumb />
      <ProductDetailsSection slug={slug} />
    </div>
  );
};
