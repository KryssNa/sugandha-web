// hooks/useProductScentNotes.ts
import { IScentNote } from '@/components/shared/types/productTypes';
import { useState, useCallback } from 'react';
import Swal from "sweetalert2";

export const useProductScentNotes = (productId: string) => {
  const [scentNotes, setScentNotes] = useState<IScentNote[]>([]);
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

  const addScentNote = async (type: string, notes: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}/scent-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add scent notes');
      }

      setScentNotes(prev => [...prev, { type, notes }]);
      showToast('success', 'Scent notes added successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to add scent notes');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchScentNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}/scent-notes`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch scent notes');
      }

      setScentNotes(data.scentNotes);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch scent notes');
    } finally {
      setLoading(false);
    }
  }
  , [productId]);

  const updateScentNotes = async (type: string, notes: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/scent-notes/${type}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update scent notes');
      }

      setScentNotes(prev => prev.map(sn => 
        sn.type === type ? { ...sn, notes } : sn
      ));
      
      showToast('success', 'Scent notes updated successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update scent notes');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteScentNote = async (type: string) => {
    const confirmed = await Swal.fire({
      title: 'Delete Scent Notes',
      text: `Are you sure you want to delete the ${type} notes?`,
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
        `/api/admin/products/${productId}/scent-notes/${type}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete scent notes');
      }

      setScentNotes(prev => prev.filter(sn => sn.type !== type));
      showToast('success', 'Scent notes deleted successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete scent notes');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderNotes = async (type: string, newOrder: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/scent-notes/${type}/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder scent notes');
      }

      setScentNotes(prev => prev.map(sn => 
        sn.type === type ? { ...sn, notes: newOrder } : sn
      ));
      
      showToast('success', 'Scent notes reordered successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to reorder scent notes');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateScentNotes = (notes: IScentNote[]): string[] => {
    const errors: string[] = [];
    const validTypes = ['top', 'middle', 'base'];
    
    // Check for duplicate types
    const types = notes.map(note => note.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      errors.push('Duplicate scent note types found');
    }

    // Validate each note
    notes.forEach(note => {
      if (!validTypes.includes(note.type)) {
        errors.push(`Invalid note type: ${note.type}`);
      }
      if (!note.notes || note.notes.length === 0) {
        errors.push(`No notes provided for ${note.type} type`);
      }
    });

    return errors;
  };

  return {
    scentNotes,
    loading,
    actions: {
      addScentNote,
      updateScentNotes,
      deleteScentNote,
      reorderNotes,
      validateScentNotes,
      fetchScentNotes
    }
  };
};