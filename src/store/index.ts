import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import checkoutReducer from './slices/checkoutSlice';
import filterReducer from './slices/filterSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import wishlistReducer from './slices/wishlistSlice';
import variantReducer from './slices/variantSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        product: productReducer,
        checkout: checkoutReducer,
        wishlist: wishlistReducer,
        filter: filterReducer,
        auth: authReducer,
        categories: categoryReducer,
        variants: variantReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
