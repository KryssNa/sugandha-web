import WishlistSection from "@/components/sections/wishlist/wishlistSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Wishlist = () => {
    return (
        <div>
        <DynamicBreadcrumb />
        <WishlistSection />
        </div>
    );
    }