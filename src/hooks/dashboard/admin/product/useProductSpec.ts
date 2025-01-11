// hooks/useProductSpecs.ts
import { ISpecification } from '@/components/shared/types/product.types';
import { useState } from 'react';
import Swal from "sweetalert2";

interface ProductSpecsState {
  specifications: ISpecification[];
  features: string[];
  ingredients: string[];
  loading: boolean;
}

export const useProductSpecs = (productId: string) => {
  const [state, setState] = useState<ProductSpecsState>({
    specifications: [],
    features: [],
    ingredients: [],
    loading: false
  });

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

  const addSpecification = async (spec: Omit<ISpecification, 'id'>) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/admin/products/${productId}/specifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spec),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add specification');
      }

      setState(prev => ({
        ...prev,
        specifications: [...prev.specifications, data.specification]
      }));

      showToast('success', 'Specification added successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to add specification');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateSpecification = async (specId: string, updates: Partial<ISpecification>) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(
        `/api/admin/products/${productId}/specifications/${specId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update specification');
      }

      setState(prev => ({
        ...prev,
        specifications: prev.specifications.map(spec =>
          spec.label === specId ? { ...spec, ...updates } : spec
        )
      }));

      showToast('success', 'Specification updated successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update specification');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const deleteSpecification = async (specId: string) => {
    const confirmed = await Swal.fire({
      title: 'Delete Specification',
      text: 'Are you sure you want to delete this specification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirmed.isConfirmed) return false;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(
        `/api/admin/products/${productId}/specifications/${specId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete specification');
      }

      setState(prev => ({
        ...prev,
        specifications: prev.specifications.filter(spec => spec.label !== specId)
      }));

      showToast('success', 'Specification deleted successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete specification');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateFeatures = async (features: string[]) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/admin/products/${productId}/features`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update ingredients');
      }

      setState(prev => ({
        ...prev,
        features
      }));

      showToast('success', 'Ingredients updated successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update ingredients');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const reorderSpecifications = async (newOrder: string[]) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(
        `/api/admin/products/${productId}/specifications/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder specifications');
      }

      setState(prev => {
        const reorderedSpecs = newOrder
          .map(label => prev.specifications.find(spec => spec.label === label))
          .filter((spec): spec is ISpecification => spec !== undefined);

        return {
          ...prev,
          specifications: reorderedSpecs
        };
      });

      showToast('success', 'Specifications reordered successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to reorder specifications');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const validateSpecifications = (specs: ISpecification[]): string[] => {
    const errors: string[] = [];
    const labels = new Set<string>();

    specs.forEach(spec => {
      if (!spec.label.trim()) {
        errors.push('Specification label cannot be empty');
      }
      if (!spec.value.trim()) {
        errors.push(`Value for "${spec.label}" cannot be empty`);
      }
      if (labels.has(spec.label)) {
        errors.push(`Duplicate specification label: "${spec.label}"`);
      }
      labels.add(spec.label);
    });

    return errors;
  };
  const updateIngredients = async (ingredients: string[]) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/admin/products/${productId}/ingredients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update ingredients');
      }

      setState(prev => ({
        ...prev,
        ingredients
      }));

      showToast('success', 'Ingredients updated successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update ingredients');
      return false;
    }
    finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }


  const bulkAddSpecifications = async (specs: Array<Omit<ISpecification, 'id'>>) => {
    const validationErrors = validateSpecifications(specs as ISpecification[]);
    if (validationErrors.length > 0) {
      showToast('error', validationErrors.join(', '));
      return false;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/admin/products/${productId}/specifications/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specifications: specs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add specifications');
      }

      setState(prev => ({
        ...prev,
        specifications: [...prev.specifications, ...data.specifications]
      }));

      showToast('success', 'Specifications added successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to add specifications');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchAllSpecs = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/admin/products/${productId}/specifications`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch specifications');
      }

      setState(prev => ({
        ...prev,
        specifications: data.specifications,
        features: data.features,
        ingredients: data.ingredients
      }));

      return data;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch specifications');
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    actions: {
      addSpecification,
      updateSpecification,
      deleteSpecification,
      updateFeatures,
      updateIngredients,
      reorderSpecifications,
      validateSpecifications,
      bulkAddSpecifications,
      fetchAllSpecs,
    }
  };
};

export default useProductSpecs;