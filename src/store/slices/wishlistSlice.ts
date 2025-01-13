// slices/wishlistSlice.ts
import { Product } from '@/components/shared/types/product.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface WishlistItem extends Product {
    addedAt: string;
    inStock: boolean;
}

export interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    error: string | null;
}

// Constants
const WISHLIST_STORAGE_KEY = 'sugandha_wishlist';

// Helper Functions
const saveToLocalStorage = (wishlistState: WishlistState) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistState));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }
};

const loadFromLocalStorage = (): WishlistState | null => {
    if (typeof window === 'undefined') return null;

    try {
        const wishlistData = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return wishlistData ? JSON.parse(wishlistData) : null;
    } catch (error) {
        console.error('Error loading wishlist:', error);
        return null;
    }
};

// Initial State
const initialState: WishlistState = {
    items: [],
    isLoading: false,
    error: null,
    ...loadFromLocalStorage()
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            const exists = state.items.find(item => item.id === action.payload.id);

            if (!exists) {
                state.items.push({
                    ...action.payload,
                    addedAt: new Date().toISOString(),
                    inStock: action.payload.quantity > 0
                });
                saveToLocalStorage(state);
            }
        },

        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveToLocalStorage(state);
        },

        updateWishlistItem: (state, action: PayloadAction<{
            productId: string;
            updates: Partial<WishlistItem>;
        }>) => {
            const { productId, updates } = action.payload;
            const item = state.items.find(item => item.id === productId);

            if (item) {
                Object.assign(item, updates);
                saveToLocalStorage(state);
            }
        },

        toggleWishlistItem: (state, action: PayloadAction<Product>) => {
            const existingIndex = state.items.findIndex(
                item => item.id === action.payload.id
            );

            if (existingIndex > -1) {
                state.items.splice(existingIndex, 1);
            } else {
                state.items.push({
                    ...action.payload,
                    addedAt: new Date().toISOString(),
                    inStock: action.payload.quantity > 0
                });
            }
            saveToLocalStorage(state);
        },

        moveToCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveToLocalStorage(state);
        },

        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        hydrate: (state) => {
            const savedWishlist = loadFromLocalStorage();
            if (savedWishlist) {
                state.items = savedWishlist.items;
            }
        },

        // Sort wishlist items
        sortWishlist: (state, action: PayloadAction<'date' | 'name' | 'price'>) => {
            switch (action.payload) {
                case 'date':
                    state.items.sort((a, b) =>
                        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
                    );
                    break;
                case 'name':
                    state.items.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'price':
                    state.items.sort((a, b) => b.basePrice - a.basePrice);
                    break;
            }
            saveToLocalStorage(state);
        },

        // Filter out of stock items
        filterOutOfStock: (state, action: PayloadAction<boolean>) => {
            if (action.payload) {
                state.items = state.items.filter(item => item.inStock);
            }
            saveToLocalStorage(state);
        }
    }
});

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
    state.wishlist.items;

export const selectIsInWishlist = (productId: string) =>
    (state: { wishlist: WishlistState }) =>
        state.wishlist.items.some(item => item.id === productId);

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
    state.wishlist.items.length;

export const {
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    toggleWishlistItem,
    moveToCart,
    clearWishlist,
    setLoading,
    setError,
    hydrate,
    sortWishlist,
    filterOutOfStock
} = wishlistSlice.actions;

export default wishlistSlice.reducer;