"use client";
import { CustomSlider } from "@/components/shared/sliders/customSlider";
import { CartIcon, LeftArrowIcon, RightArrowIcon } from "@/utils/helpers/svgicon";
import Link from "next/link";
import { start } from "repl";

interface Slide {
  title: {
    start: string;
    middle: string;
    end: string;
  };
  image: string;
  subtitle: string;
}

const BannerContent = ({ slide }: { slide: Slide }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 h-full py-20">
    {/* Content */}
    <div className="space-y-6">
      <h1 className="text-white text-4xl md:text-6xl font-bold font-quicksand ">
        <div className="pb-2 md:pb-4 xl:pb-6">
        {slide.title.start}{" "}
        <span className="text-4xl md:text-8xl font-dancing font-extrabold text-[#211f49]">
          {slide.title.middle}{" "}
        </span>{" "}
        </div>
        {slide.title.end}
      </h1>

      <p className="text-white/90 text-lg max-w-lg">{slide.subtitle}</p>

      <Link
        href="/shop"
        className="inline-flex items-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors gap-2 group"
      >
        Shop Now
        <CartIcon className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
      </Link>
    </div>

    {/* Image */}
    <div className="flex justify-center">
      <div className="relative group">
        <img
          src={slide.image}
          alt={slide.title.middle}
          className="max-w-full h-auto transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  </div>
);

const BannerSlider = () => {
  const slides = [
    {
      title: {
        start : "Make Your",
        middle: "Pahichan",
        end: "Your Story in Scents",
      },
      image: "assets/images/herosection/heroimage.svg",
      subtitle: "Experience the essence of luxury with our premium perfumes.",
    },
    {
      title: {
        start : "Express Your",
        middle: "Swabhav",
        end: "Heritage of Excellence",
      },
      image: "assets/images/herosection/heroimage.svg",
      subtitle: "Indulge in the finest fragrances crafted for elegance.",
    },
    {
      title: {
        start : "Make Your",
        middle: "Pahichan",
        end: "A Luxurious Legacy Defined",
      },
      image: "assets/images/herosection/heroimage.svg",
      subtitle: "Discover the art of scent with our exclusive collection.",
    },
  ];

  // Transform slides for CustomSlider
  const sliderSlides = slides.map((slide, index) => ({
    id: index,
    content: <BannerContent slide={slide} />
  }));

  // Custom navigation arrows
  const customArrows = {
    prev: <LeftArrowIcon className="h-5 w-5" />,
    next: <RightArrowIcon className="w-5 h-5" />
  };

  return (    <section className="relative bg-gradient-to-b md:bg-gradient-to-r from-[#826740] via-[#b5a388] to-[#e9dfd1] overflow-hidden cursor-grab group">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" />

      <CustomSlider
        slides={sliderSlides}
        autoPlay={true}
        autoPlayInterval={5000}
        showArrows={true}
        showDots={true}
        className="h-[85vh]"
        // className="h-[88vh]"
        containerClassName="container mx-auto px-4 h-full flex items-center"
        arrowClassName="w-8 h-8 flex items-center justify-center rounded-full border border-secondaryBg text-seborder-secondaryBg hover:bg-primary hover:text-white hover:border-primary transition-colors opacity-0 group-hover:opacity-100"
        dotClassName="w-3 h-3 rounded-full transition-colors bg-white/50"
        activeDotClassName="bg-white"
        transitionDuration={0.5}
        renderArrow={customArrows}
      />
    </section>
  );
};

export default BannerSlider;