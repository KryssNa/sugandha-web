import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Star, Trash2 } from 'lucide-react';
import { CustomButton } from '../buttons/customButtons';

interface ImageGalleryProps {
  onImagesChange: (images: ImageFile[]) => void;
}

interface ImageFile {
  id: string;
  url: string;
  isPrimary: boolean;
  file?: File;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    
    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          // Here you'd make your API call to upload the image
          // For now, creating a local URL
          const url = URL.createObjectURL(file);
          
          return {
            id: Math.random().toString(36).substring(7),
            url,
            isPrimary: false,
            file
          };
        })
      );

      setImages(prev => [...prev, ...uploadedImages]);
      onImagesChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleImageUpload(e.dataTransfer.files);
  }, [handleImageUpload]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const setPrimaryImage = useCallback((id: string) => {
    setImages(prev => 
      prev.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-lg border-2 border-dashed p-8
          transition-all duration-200 ease-in-out
          ${dragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => handleImageUpload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        
        <div className="text-center">
          <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer rounded-md font-semibold text-orange-600 focus-within:outline-none hover:text-orange-500"
            >
              <span>Upload images</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>

        {/* Upload Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-150" />
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-300" />
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map(image => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image.url}
                alt="Product"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                <div className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setPrimaryImage(image.id)}
                    className="!p-2"
                  >
                    <Star className={`w-4 h-4 ${image.isPrimary ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </CustomButton>

                  <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                    className="!p-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </CustomButton>
                </div>
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;