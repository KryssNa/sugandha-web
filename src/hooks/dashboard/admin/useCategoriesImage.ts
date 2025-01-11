// hooks/useCategoryImages.ts
import { useState, useCallback } from 'react';
import Swal from "sweetalert2";

interface ImageUploadResponse {
  url: string;
  alt: string;
}

export const useCategoryImages = () => {
  const [loading, setLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      customClass: { popup: "z-xxxl" },
      icon: type,
      title: message
    });
  };

  const validateImage = (file: File): string[] => {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload JPG, PNG, GIF, or WebP images.');
    }

    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }

    return errors;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const validationErrors = validateImage(file);
    
    if (validationErrors.length > 0) {
      showToast('error', validationErrors.join(' '));
      throw new Error(validationErrors.join(' '));
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/categories/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      showToast('success', 'Image uploaded successfully');
      return data.url;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    const confirmed = await Swal.fire({
      title: 'Delete Image',
      text: 'Are you sure you want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirmed.isConfirmed) return false;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete image');
      }

      showToast('success', 'Image deleted successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete image');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateImageAlt = async (imageUrl: string, alt: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories/update-image-alt', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, alt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update image alt text');
      }

      showToast('success', 'Image alt text updated successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update image alt text');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const optimizeImage = async (file: File): Promise<File> => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/categories/optimize-image', {
        method: 'POST',
        body: formData,
      });

      const optimizedBlob = await response.blob();
      const optimizedFile = new File([optimizedBlob], file.name, {
        type: file.type,
      });

      return optimizedFile;
    } catch (err) {
      showToast('error', 'Failed to optimize image. Using original file.');
      return file;
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      try {
        const optimizedFile = await optimizeImage(file);
        const url = await uploadImage(optimizedFile);
        urls.push(url);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    return urls;
  };

  return {
    loading,
    actions: {
      uploadImage,
      deleteImage,
      updateImageAlt,
      optimizeImage,
      uploadMultipleImages,
      validateImage,
    }
  };
};

export default useCategoryImages;