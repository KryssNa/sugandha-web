'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Trash2, 
  ImageIcon 
} from 'lucide-react';

interface MediaManagementSectionProps {
  imageManager: {
    images: any[];
    actions: {
      uploadImages: (files: File[]) => Promise<any>;
      deleteImage: (imageId: string) => Promise<boolean>;
      setPrimaryImage: (imageId: string) => Promise<boolean>;
    };
  };
}

const MediaManagementSection: React.FC<MediaManagementSectionProps> = ({ 
  imageManager 
}) => {
  const [draggingOver, setDraggingOver] = useState(false);

  // Image upload handler
  const handleImageUpload = async (files: FileList | null) => {
    if (files) {
      try {
        const fileArray = Array.from(files);
        await imageManager.actions.uploadImages(fileArray);
      } catch (error) {
        console.error('Image upload failed', error);
        alert('Failed to upload images. Please try again.');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
      
      {/* Image Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 
        ${draggingOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden" 
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className="cursor-pointer flex flex-col items-center"
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop images or 
            <span className="text-orange-500 ml-1 hover:underline">
              browse files
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Support: PNG, JPG, WEBP (Max 10MB)
          </p>
        </label>
      </div>

      {/* Image Grid */}
      {imageManager.images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imageManager.images.map((image, index) => (
            <div 
              key={image.id} 
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <img 
                src={image.url} 
                alt={`Product Image ${index + 1}`} 
                className="w-full h-40 object-cover"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 
                group-hover:opacity-100">
                <button 
                  onClick={() => imageManager.actions.setPrimaryImage(image.id)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  title="Set as Primary"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </button>
                <button 
                  onClick={() => imageManager.actions.deleteImage(image.id)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  title="Delete Image"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* Primary Image Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 right-2 bg-green-500 text-white 
                  px-2 py-1 rounded-full text-xs">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManagementSection;