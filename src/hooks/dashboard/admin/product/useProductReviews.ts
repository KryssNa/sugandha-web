// hooks/useProductReviews.ts
import { Rating, Review } from '@/components/shared/types/productTypes';
import { useState, useCallback, useEffect } from 'react';
import Swal from "sweetalert2";

interface ReviewFilters {
  rating?: number;
  verifiedOnly?: boolean;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<Rating>({
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
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

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '10',
        sortBy: filters.sortBy || 'date',
        sortOrder: filters.sortOrder || 'desc',
        ...(filters.rating && { rating: filters.rating.toString() }),
        ...(filters.verifiedOnly && { verifiedOnly: 'true' }),
      });

      const response = await fetch(
        `/api/admin/products/${productId}/reviews?${queryParams}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      setReviews(data.reviews);
      setRating(data.rating);
      return data;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch reviews');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/reviews/${reviewId}/approve`,
        { method: 'PATCH' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve review');
      }

      await fetchReviews();
      showToast('success', 'Review approved successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to approve review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const confirmed = await Swal.fire({
      title: 'Delete Review',
      text: 'Are you sure you want to delete this review?',
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
        `/api/admin/products/${productId}/reviews/${reviewId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete review');
      }

      await fetchReviews();
      showToast('success', 'Review deleted successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reportReview = async (reviewId: string, reason: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/reviews/${reviewId}/report`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to report review');
      }

      showToast('success', 'Review reported successfully');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to report review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReviewHelpfulness = async (reviewId: string, helpful: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/reviews/${reviewId}/helpful`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ helpful }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update review helpfulness');
      }

      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + (helpful ? 1 : -1) }
          : review
      ));

      showToast('success', 'Review helpfulness updated');
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update review helpfulness');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkModerateReviews = async (reviewIds: string[], action: 'approve' | 'delete') => {
    const confirmed = await Swal.fire({
      title: `Bulk ${action === 'approve' ? 'Approve' : 'Delete'} Reviews`,
      text: `Are you sure you want to ${action} ${reviewIds.length} reviews?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} them!`
    });

    if (!confirmed.isConfirmed) return false;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/products/${productId}/reviews/bulk-${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewIds }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} reviews`);
      }

      await fetchReviews();
      showToast('success', `Reviews ${action}d successfully`);
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : `Failed to ${action} reviews`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = useCallback((newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  return {
    reviews,
    rating,
    loading,
    filters,
    actions: {
      fetchReviews,
      approveReview,
      deleteReview,
      reportReview,
      updateReviewHelpfulness,
      bulkModerateReviews,
      updateFilters,
    },
  };
};

export default useProductReviews;