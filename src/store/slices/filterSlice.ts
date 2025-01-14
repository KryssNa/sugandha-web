// import { FilterState } from '@/components/shared/types/filterTypes';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// const initialState: FilterState = {
//   priceRange: {
//     min: 0,
//     max: 50000,
//     current: [0, 50000],
//   },
//   brands: [],
//   categories: [],
//   search: "",
//   rating: null,
//   availability: "all",
//   sortBy: "popular",
//   gender: "all",
// };

// const filterSlice = createSlice({
//   name: 'filter',
//   initialState,
//   reducers: {
//     setPriceRange: (state, action: PayloadAction<[number, number]>) => {
//       state.priceRange.current = action.payload;
//     },
//     toggleBrand: (state, action: PayloadAction<string>) => {
//       const brandIndex = state.brands.indexOf(action.payload);
//       if (brandIndex > -1) {
//         state.brands.splice(brandIndex, 1);
//       } else {
//         state.brands.push(action.payload);
//       }
//     },
//     toggleCategory: (state, action: PayloadAction<string>) => {
//       const categoryIndex = state.categories.indexOf(action.payload);
//       if (categoryIndex > -1) {
//         state.categories.splice(categoryIndex, 1);
//       } else {
//         state.categories.push(action.payload);
//       }
//     },
//     setSearch: (state, action: PayloadAction<string>) => {
//       state.search = action.payload;
//     },
//     setRating: (state, action: PayloadAction<number | null>) => {
//       state.rating = action.payload;
//     },
//     setAvailability: (state, action: PayloadAction<FilterState["availability"]>) => {
//       state.availability = action.payload;
//     },
//     setSortBy: (state, action: PayloadAction<FilterState["sortBy"]>) => {
//       state.sortBy = action.payload;
//     },
//     setFilters: (state, action: PayloadAction<FilterState>) => {
//         return action.payload;
//         },
//     resetFilters: (state) => {
//       return { ...initialState, priceRange: state.priceRange };
//     },
//   },
// });

// export const {
//   setPriceRange,
//   toggleBrand,
//   toggleCategory,
//   setSearch,
//   setRating,
//   setAvailability,
//   setSortBy,
//   setFilters,
//   resetFilters,
// } = filterSlice.actions;

// export default filterSlice.reducer;

// src/store/slices/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
    current: [number, number];
  };
  brands: string[];
  categories: string[];
  ratings: number[];
  availability: 'all' | 'inStock' | 'outOfStock';
  search: string;
  sortBy: 'popular' | 'priceAsc' | 'priceDesc';
}

const initialState: FilterState = {
  priceRange: {
    min: 0,
    max: 50000,
    current: [0, 50000]
  },
  brands: [],
  categories: [],
  ratings: [],
  availability: 'all',
  search: '',
  sortBy: 'popular'
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Set entire filter state
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },

    // Price Range Actions
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange.current = action.payload;
    },

    // Multi-select filter actions
    toggleBrand: (state, action: PayloadAction<string>) => {
      const index = state.brands.indexOf(action.payload);
      if (index === -1) {
        state.brands.push(action.payload);
      } else {
        state.brands.splice(index, 1);
      }
    },

    toggleCategory: (state, action: PayloadAction<string>) => {
      const index = state.categories.indexOf(action.payload);
      if (index === -1) {
        state.categories.push(action.payload);
      } else {
        state.categories.splice(index, 1);
      }
    },

    toggleRating: (state, action: PayloadAction<number>) => {
      const index = state.ratings.indexOf(action.payload);
      if (index === -1) {
        state.ratings.push(action.payload);
      } else {
        state.ratings.splice(index, 1);
      }
    },

    // Single-select filter actions
    setAvailability: (state, action: PayloadAction<FilterState['availability']>) => {
      state.availability = action.payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },

    // Reset all filters
    resetFilters: () => initialState
  }
});

export const {
  setFilters,
  setPriceRange,
  toggleBrand,
  toggleCategory,
  toggleRating,
  setAvailability,
  setSearch,
  resetFilters,
  setSortBy
} = filterSlice.actions;

export default filterSlice.reducer;