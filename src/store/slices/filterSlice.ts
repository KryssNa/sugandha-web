import { FilterState } from '@/components/shared/types/filterTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FilterState = {
  priceRange: {
    min: 0,
    max: 50000,
    current: [0, 50000],
  },
  brands: [],
  categories: [],
  search: "",
  rating: null,
  availability: "all",
  sortBy: "popular",
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange.current = action.payload;
    },
    toggleBrand: (state, action: PayloadAction<string>) => {
      const brandIndex = state.brands.indexOf(action.payload);
      if (brandIndex > -1) {
        state.brands.splice(brandIndex, 1);
      } else {
        state.brands.push(action.payload);
      }
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryIndex = state.categories.indexOf(action.payload);
      if (categoryIndex > -1) {
        state.categories.splice(categoryIndex, 1);
      } else {
        state.categories.push(action.payload);
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },
    setAvailability: (state, action: PayloadAction<FilterState["availability"]>) => {
      state.availability = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
        return action.payload;
        },
    resetFilters: (state) => {
      return { ...initialState, priceRange: state.priceRange };
    },
  },
});

export const {
  setPriceRange,
  toggleBrand,
  toggleCategory,
  setSearch,
  setRating,
  setAvailability,
  setSortBy,
  setFilters,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;