import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import wishlistReducer from './slices/wishlistSlice';
import filterReducer from './slices/filterSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        product: productReducer,
        checkout: checkoutReducer,
        wishlist: wishlistReducer,
        filter: filterReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
