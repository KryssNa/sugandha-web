// components/ImageGallery.tsx
import { api } from '@/lib/axios';
import { AxiosProgressEvent } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ImagePlus,
  Loader,
  Star,
  Trash2
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ImageFile } from '../types/image.types';

interface ImageGalleryProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  uploadEndpoint: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagesChange,
  maxImages = 8,
  uploadEndpoint
}) => {
  const [dragging, setDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: number }>({});

  // Image Upload Handler
  const uploadImage = async (file: File) => {
    const tempId = Math.random().toString(36).substr(2, 9);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('images', file);

      // Track upload progress
      setUploadingFiles(prev => ({ ...prev, [tempId]: 0 }));

      const response = await api.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total
            ? (progressEvent.loaded / progressEvent.total) * 100
            : 0;
          setUploadingFiles(prev => ({ ...prev, [tempId]: progress }));
        },
      });

      // Destructure the first image from the data array
      const [uploadedImage] = response.data.data;

      // Add new image to state
      const newImage: ImageFile = {
        id: tempId, // Use temp ID until server confirms
        url: uploadedImage.fileUrl, // Use the full URL from response
        alt: uploadedImage.originalName.split('.')[0], // Use original filename
        isPrimary: images.length === 0, // First image is primary
        file
      };

      onImagesChange([...images, newImage]);
    } catch (error) {
      console.error('Upload failed:', error);
      // Optionally show error toast
    } finally {
      // Remove progress tracking
      setUploadingFiles(prev => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
    }
  };

  // File Selection Handler
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

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Image Management Functions
  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  const setPrimaryImage = (id: string) => {
    onImagesChange(
      images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    );
  };

  const updateImageAlt = (id: string, alt: string) => {
    onImagesChange(
      images.map(img =>
        img.id === id ? { ...img, alt } : img
      )
    );
  };
  console.log("images", images);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {images.length < maxImages && (
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
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
            id="image-upload"
          />

          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label
                htmlFor="image-upload"
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
                  crossOrigin="anonymous"
                />

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

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 
                  transition-all duration-200 flex items-center justify-center space-x-2 
                  opacity-0 group-hover:opacity-100">
                  {/* Set Primary Button */}
                  <button
                    onClick={() => setPrimaryImage(image.id)}
                    className="text-white hover:text-yellow-300"
                  >
                    <Star
                      className={`w-6 h-6 ${image.isPrimary ? 'fill-yellow-500' : ''}`}
                    />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className="text-white hover:text-red-500"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white 
                    text-xs px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;