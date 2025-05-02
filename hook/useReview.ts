import { create } from 'zustand';
import { IReview } from '../app/types';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ReviewStore {
  reviews: IReview[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: (listingId: string) => Promise<void>;
  addReview: (listingId: string, rating: number, comment: string) => Promise<void>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

const useReview = create<ReviewStore>((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async (listingId: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/api/listings/${listingId}/reviews`);
      set({ reviews: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reviews', isLoading: false });
      toast.error('Could not load reviews');
    }
  },

  addReview: async (listingId: string, rating: number, comment: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`/api/listings/${listingId}/reviews`, {
        rating,
        comment
      });
      
      set((state) => ({
        reviews: [...state.reviews, response.data],
        isLoading: false
      }));
      
      toast.success('Review added successfully');
    } catch (error) {
      set({ error: 'Failed to add review', isLoading: false });
      toast.error('Could not add review');
    }
  },

  updateReview: async (reviewId: string, rating: number, comment: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.put(`/api/reviews/${reviewId}`, {
        rating,
        comment
      });
      
      set((state) => ({
        reviews: state.reviews.map((review) => 
          review.id === reviewId ? response.data : review
        ),
        isLoading: false
      }));
      
      toast.success('Review updated successfully');
    } catch (error) {
      set({ error: 'Failed to update review', isLoading: false });
      toast.error('Could not update review');
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/api/reviews/${reviewId}`);
      
      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== reviewId),
        isLoading: false
      }));
      
      toast.success('Review deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete review', isLoading: false });
      toast.error('Could not delete review');
    }
  }
}));

export default useReview; 