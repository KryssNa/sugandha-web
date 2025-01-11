// hooks/useProductImages.ts
import { IImage } from '@/components/shared/types/product.types';
import { useCallback, useState } from 'react';
import Swal from "sweetalert2";

interface ImageUploadResponse {
  id: string;
  url: string;
  alt: string;
}

export const useProductImages = (productId: string) => {
  const [images, setImages] = useState<IImage[]>([]);
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

  const uploadImages = async (files: File[]) => {
    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      const newImages: IImage[] = data.images;
      setImages(prev => [...prev, ...newImages]);
      showToast('success', 'Images uploaded successfully');
      return newImages;

    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to upload images');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
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
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete image');
      }

      setImages(prev => prev.filter(img => img.id !== imageId));
      showToast('success', 'Image deleted successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete image');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateImageOrder = async (newOrder: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/images/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder images');
      }

      const reorderedImages = newOrder
        .map(id => images.find(img => img.id === id))
        .filter((img): img is IImage => img !== undefined);

      setImages(reorderedImages);
      showToast('success', 'Images reordered successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to reorder images');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}/primary`,
        { method: 'PATCH' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to set primary image');
      }

      setImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));

      showToast('success', 'Primary image updated');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to set primary image');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateImageAlt = async (imageId: string, alt: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alt }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update image alt text');
      }

      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, alt } : img
      ));

      showToast('success', 'Image alt text updated');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update image alt text');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}/images`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch images');
      }

      setImages(data.images);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }
    , [productId]);

  return {
    images,
    loading,
    actions: {
      uploadImages,
      deleteImage,
      updateImageOrder,
      setPrimaryImage,
      updateImageAlt,
      fetchImages
    }
  };
};