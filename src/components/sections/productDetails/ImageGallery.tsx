import { IImage } from '@/components/shared/types/product.types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images: IImage[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  console.log("images", images);


  return (
    <div className="lg:w-1/2 space-y-4">
      <div className="relative h-96 rounded-2xl border border-gray-200 overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: isZoomed ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          onHoverStart={() => setIsZoomed(true)}
          onHoverEnd={() => setIsZoomed(false)}
        >
          <Image
            src={images[selectedImage]?.url || "/api/placeholder/400/400"}
            alt={images[selectedImage]?.alt || title}
            fill
            className="object-contain"
            referrerPolicy='no-referrer'
            crossOrigin='anonymous'
            unoptimized
          />
        </motion.div>

      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images?.map((image, index) => (
          <motion.button
            key={image.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(index)}
            className={`relative w-24 h-24 rounded-lg border-2 
              ${selectedImage === index ? "border-orange-500" : "border-gray-200"}`}
          >
            <Image
              src={`${image.url}`}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
              unoptimized 
              referrerPolicy='no-referrer'
              crossOrigin='anonymous'
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;