import Brand from "@/components/sections/homepage/brand";
import DealsSection from "@/components/sections/homepage/deal/dealSection";
import { GiftSection } from "@/components/sections/homepage/gift/giftSection";
import BannerSlider from "@/components/sections/homepage/hero";
import { NewArrivals } from "@/components/sections/homepage/newArrival/newArrival";
import { PremiumProducts } from "@/components/sections/homepage/premiumProducts";
import { RecommendedProducts } from "@/components/sections/homepage/recommendedProduct/recommendedProduct";

const HomePage = () => {
  return (
    <div>
      <BannerSlider />
      <Brand />
      <PremiumProducts />
      <NewArrivals />
      <RecommendedProducts />
      <DealsSection />
      <GiftSection />
    </div>
  );
};

export default HomePage;