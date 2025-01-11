import React, { useState, useCallback } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Star, Trash2, Edit2, Loader } from 'lucide-react';
import { CustomButton } from '../buttons/customButtons';
import CustomInput from '../input/customInput';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
  uploadEndpoint: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  onImagesChange,
  maxImages = 8,
  uploadEndpoint
}) => {
  const [dragging, setDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: number}>({});
  const [editingAlt, setEditingAlt] = useState<string | null>(null);

  // Handle image upload to API
  const uploadImage = async (file: File) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Track upload progress
      setUploadingFiles(prev => ({ ...prev, [tempId]: 0 }));
      const response = await axios.post(uploadEndpoint, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total ? (progressEvent.loaded / progressEvent.total) * 100 : 0;
          setUploadingFiles(prev => ({ ...prev, [tempId]: progress }));
        },
      });

      const data = response.data;
      
      // Add new image to state
      const newImage: ProductImage = {
        id: data.id,
        url: data.url,
        alt: file.name.split('.')[0], // Default alt text from filename
        isPrimary: images.length === 0 // First image is primary
      };

      onImagesChange([...images, newImage]);
    } catch (error) {
      console.error('Upload failed:', error);
      // Show error toast here
    } finally {
      // Remove progress tracking
      setUploadingFiles(prev => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    Array.from(files).forEach(file => {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload only images');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Image size should be less than 10MB');
        return;
      }

      uploadImage(file);
    });
  }, [images, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleAltChange = (id: string, newAlt: string) => {
    onImagesChange(
      images.map(img => 
        img.id === id 
          ? { ...img, alt: newAlt }
          : img
      )
    );
    setEditingAlt(null);
  };

  const setPrimaryImage = (id: string) => {
    onImagesChange(
      images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    );
  };

  const removeImage = async (id: string) => {
    try {
      // Optional: Call API to delete image from storage
      const confirmed = window.confirm('Are you sure you want to remove this image?');
      if (!confirmed) return;

      onImagesChange(images.filter(img => img.id !== id));
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
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
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
            id="product-image-upload"
          />
          
          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label
                htmlFor="product-image-upload"
                className="relative cursor-pointer rounded-md font-semibold text-orange-600 focus-within:outline-none hover:text-orange-500"
              >
                <span>Upload images</span>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG up to 10MB ({images.length}/{maxImages} images)
            </p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map(image => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="relative group"
            >
              {/* Image Card */}
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 
                  transition-all duration-200 flex items-center justify-center space-x-2 
                  opacity-0 group-hover:opacity-100">
                  <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setPrimaryImage(image.id)}
                    className="!p-2"
                  >
                    <Star 
                      className={`w-4 h-4 ${image.isPrimary ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                    />
                  </CustomButton>

                  <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingAlt(image.id)}
                    className="!p-2"
                  >
                    <Edit2 className="w-4 h-4" />
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

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white 
                    text-xs px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}

                {/* Upload Progress */}
                {uploadingFiles[image.id] !== undefined && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 
                    flex items-center justify-center">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
                      <p className="text-sm text-gray-600 mt-2">
                        {Math.round(uploadingFiles[image.id])}%
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alt Text Edit */}
              <AnimatePresence>
                {editingAlt === image.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 top-full mt-2 bg-white rounded-lg 
                      shadow-lg border border-gray-200 p-3 z-10"
                  >
                    <CustomInput
                      label="Alt Text"
                      value={image.alt}
                      onChange={(e) => handleAltChange(image.id, e.target.value)}
                      placeholder="Describe the image"
                      name={`alt-${image.id}`}
                    />
                    <div className="flex justify-end mt-2">
                      <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAlt(null)}
                      >
                        Done
                      </CustomButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductImageGallery;